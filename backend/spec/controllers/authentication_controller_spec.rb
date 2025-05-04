require 'rails_helper'

RSpec.describe Api::V1::AuthenticationController, type: :controller do
  let(:valid_user) { FactoryBot.create(:user, email: 'test@example.com', password: 'password123') }
  let(:valid_credentials) { { email: valid_user.email, password: 'password123' } }
  let(:invalid_credentials) { { email: valid_user.email, password: 'wrong_password' } }
  let(:valid_registration) do
    {
      name: 'New User',
      email: 'new@example.com',
      password: 'password123',
      role: 'client'
    }
  end

  describe 'POST #login' do
    context 'with valid credentials' do
      it 'returns authentication token' do
        post :login, params: valid_credentials
        expect(response).to have_http_status(:ok)
        expect(json_response['token']).to be_present
        expect(json_response['user']).to be_present
        expect(json_response['user']['email']).to eq(valid_user.email)
      end
    end

    context 'with invalid credentials' do
      it 'returns unauthorized status' do
        post :login, params: invalid_credentials
        expect(response).to have_http_status(:unauthorized)
        expect(json_response['error']).to eq('Invalid credentials')
      end
    end
  end

  describe 'POST #register' do
    context 'with valid registration data' do
      it 'creates a new user and returns token' do
        expect {
          post :register, params: valid_registration
        }.to change(User, :count).by(1)
        
        expect(response).to have_http_status(:created)
        expect(json_response['token']).to be_present
        expect(json_response['user']['email']).to eq(valid_registration[:email])
      end
    end

    context 'with invalid registration data' do
      it 'returns validation errors' do
        post :register, params: { email: 'invalid_email' }
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response['errors']).to be_present
      end
    end
  end

  describe 'GET #me' do
    context 'with valid token' do
      it 'returns current user data' do
        token = JsonWebToken.encode(user_id: valid_user.id)
        request.headers['Authorization'] = "Bearer #{token}"
        get :me
        
        expect(response).to have_http_status(:ok)
        expect(json_response['email']).to eq(valid_user.email)
      end
    end

    context 'without token' do
      it 'returns unauthorized status' do
        get :me
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'with invalid token' do
      it 'returns unauthorized status' do
        request.headers['Authorization'] = 'Bearer invalid_token'
        get :me
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  private

  def json_response
    JSON.parse(response.body)
  end
end 
