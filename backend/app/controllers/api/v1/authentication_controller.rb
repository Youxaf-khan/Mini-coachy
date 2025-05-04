module Api
  module V1
    class AuthenticationController < ApplicationController
      skip_before_action :authenticate_request, only: [ :login, :register ]

      # GET /api/v1/me
      def me
        render json: current_user
      end

      def login
        @user = User.find_by_email(params[:email] || params.dig(:authentication, :email))
        if @user&.authenticate(params[:password] || params.dig(:authentication, :password))
          token = JsonWebToken.encode(user_id: @user.id)
          render json: { token: token, user: @user.as_json(except: :password_digest) }, status: :ok
        else
          render json: { error: "Invalid credentials" }, status: :unauthorized
        end
      end

      def register
        @user = User.new(user_params)
        if @user.save
          token = JsonWebToken.encode(user_id: @user.id)
          render json: { token: token, user: @user.as_json(except: :password_digest) }, status: :created
        else
          render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def user_params
        params.permit(:name, :email, :password, :role)
      end
    end
  end
end
