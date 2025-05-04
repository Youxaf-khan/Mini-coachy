module Api
  module V1
    class SessionsController < ApplicationController
      before_action :authenticate_request
      before_action :set_session, only: [:show, :update, :destroy]

      def index
        cache_key = "sessions/#{current_user.id}/#{current_user.role}"
        @sessions = Rails.cache.fetch(cache_key, expires_in: 5.minutes) do
          if current_user.admin?
            Session.includes(:client, :coach).all
          elsif current_user.role == 'coach'
            Session.includes(:client, :coach).where(coach_id: current_user.id)
          else
            Session.includes(:client, :coach).where(client_id: current_user.id)
          end
        end
        render json: @sessions, include: [:client, :coach]
      end

      def show
        return render json: { error: 'Forbidden' }, status: :forbidden unless authorized_user?(@session)

        render json: @session, include: [:client, :coach]
      end


      def create
        unless current_user.admin? || current_user.role == 'coach'
          return render json: { error: 'Forbidden' }, status: :forbidden
        end

        @session = Session.new(session_params)
        if current_user.role == 'coach'
          @session.coach_id = current_user.id
        elsif current_user.admin?
          unless params[:session][:coach_id].present?
            return render json: { errors: ['Coach is required for session'] }, status: :unprocessable_entity
          end
          @session.coach_id = params[:session][:coach_id]
        end

        if @session.save
          invalidate_sessions_cache
          render json: @session, include: [:client, :coach], status: :created
        else
          render json: { errors: @session.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        return render json: { error: 'Forbidden' }, status: :forbidden unless authorized_user?(@session)

        if @session.update(session_params)
          invalidate_sessions_cache
          render json: @session, include: [:client, :coach]
        else
          render json: { errors: @session.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        return render json: { error: 'Forbidden' }, status: :forbidden unless authorized_user?(@session)

        @session.destroy
        invalidate_sessions_cache
        head :no_content
      end

      private

      def set_session
        @session = Session.includes(:client, :coach).find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Session not found' }, status: :not_found
      end

      def authorized_user?(session)
        return false unless current_user
        current_user.admin? || session.coach_id == current_user.id || session.client_id == current_user.id
      end

      def session_params
        params.require(:session).permit(:title, :description, :start_time, :end_time, :status, :client_id)
      end

      def invalidate_sessions_cache
        # Invalidate cache for both coach and client
        Rails.cache.delete("sessions/#{@session.coach_id}/coach")
        Rails.cache.delete("sessions/#{@session.client_id}/client")
        # Invalidate admin cache
        Rails.cache.delete("sessions/admin")
      end
    end
  end
end 
