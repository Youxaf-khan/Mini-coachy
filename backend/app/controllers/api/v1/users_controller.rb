module Api
  module V1
    class UsersController < ApplicationController
      before_action :authenticate_request
      before_action :set_user, only: [ :show, :update, :destroy ]
      before_action :authorize_admin, only: [ :destroy, :stats, :recent_sessions, :recent_users ]
      before_action :authorize_user_for_index, only: [ :index ]

      def index
        if params[:role].present?
          @users = User.where(role: params[:role])
        else
          @users = User.all
        end
        render json: @users
      end

      def show
        render json: @user
      end

      def update
        if @user.update(user_params)
          render json: @user
        else
          render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @user.destroy
        head :no_content
      end

      def stats
        authorize_admin
        render json: {
          total_users: User.count,
          total_sessions: Session.count,
          active_coaches: User.where(role: "coach").count,
          active_clients: User.where(role: "client").count
        }, status: :ok
      end

      def recent_sessions
        authorize_admin
        @sessions = Session.includes(:coach, :client)
                         .order(created_at: :desc)
                         .limit(5)
        render json: @sessions, include: [ :coach, :client ]
      end

      def recent_users
        authorize_admin
        @users = User.order(created_at: :desc).limit(5)
        render json: @users
      end

      private

      def set_user
        @user = User.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "User not found" }, status: :not_found
      end

      def user_params
        params.require(:user).permit(:name, :email, :role)
      end

      def authorize_admin
        unless current_user.admin?
          render json: { error: "Unauthorized" }, status: :forbidden and return
        end
      end

      def authorize_user_for_index
        unless current_user.admin? || params[:role].present?
          render json: { error: "Unauthorized" }, status: :forbidden
        end
      end
    end
  end
end
