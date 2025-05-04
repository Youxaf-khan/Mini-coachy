require 'rails_helper'

RSpec.describe Api::V1::UsersController, type: :controller do
  let(:admin) { FactoryBot.create(:user, role: 'admin') }
  let(:coach) { FactoryBot.create(:user, role: 'coach') }
  let(:client) { FactoryBot.create(:user, role: 'client') }
  let(:valid_attributes) { { name: 'Test User', email: 'test@example.com', role: 'client' } }
  let(:invalid_attributes) { { email: 'invalid_email' } }

  let(:admin_token) { JsonWebToken.encode(user_id: admin.id) }
  let(:coach_token) { JsonWebToken.encode(user_id: coach.id) }

  before do
    request.headers['Authorization'] = "Bearer #{admin_token}"
  end

  describe 'GET #index' do
    context 'when user is admin' do
      before do
        FactoryBot.create_list(:user, 3)
        admin
        coach
      end

      it 'returns all users' do
        get :index
        expect(response).to have_http_status(:ok)
        expect(json_response.length).to eq(5)
      end

      it 'filters users by role' do
        get :index, params: { role: 'coach' }
        expect(response).to have_http_status(:ok)
        expect(json_response.all? { |user| user['role'] == 'coach' }).to be true
      end
    end

    context 'when user is a coach' do
      before do
        request.headers['Authorization'] = "Bearer #{coach_token}"
      end

      it 'returns only clients when role=client is passed' do
        get :index, params: { role: 'client' }
        expect(response).to have_http_status(:ok)
        expect(json_response.all? { |user| user['role'] == 'client' }).to be true
      end
    end

    context 'when user is not admin' do
      before do
        request.headers['Authorization'] = "Bearer #{coach_token}"
      end

      it 'returns forbidden status when trying to access all users without a role' do
        get :index
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe 'GET #show' do
    context 'when user exists' do
      it 'returns the user' do
        get :show, params: { id: client.id }
        expect(response).to have_http_status(:ok)
        expect(json_response['id']).to eq(client.id)
      end
    end

    context 'when user does not exist' do
      it 'returns not found status' do
        get :show, params: { id: 999 }
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe 'PUT #update' do
    context 'with valid attributes' do
      it 'updates the user' do
        put :update, params: { id: client.id, user: valid_attributes }
        expect(response).to have_http_status(:ok)
        expect(json_response['name']).to eq(valid_attributes[:name])
      end
    end

    context 'with invalid attributes' do
      it 'returns unprocessable entity status' do
        put :update, params: { id: client.id, user: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'DELETE #destroy' do
    context 'when user is admin' do
      it 'deletes the user' do
        client
        
        expect {
          delete :destroy, params: { id: client.id }
        }.to change(User, :count).by(-1)
        expect(response).to have_http_status(:no_content)
      end
    end

    context 'when user is not admin' do
      before do
        request.headers['Authorization'] = "Bearer #{coach_token}"
      end

      it 'returns forbidden status' do
        delete :destroy, params: { id: client.id }
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe 'GET #stats' do
    context 'when user is admin' do
      it 'returns system statistics' do
        get :stats
        expect(response).to have_http_status(:ok)
        expect(json_response).to include(
          'total_users',
          'total_sessions',
          'active_coaches',
          'active_clients'
        )
      end
    end

    context 'when user is not admin' do
      before do
        request.headers['Authorization'] = "Bearer #{coach_token}"
      end

      it 'returns forbidden status' do
        get :stats
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe 'GET #recent_sessions' do
    context 'when user is admin' do
      before do
        FactoryBot.create_list(:session, 6)
      end

      it 'returns 5 most recent sessions' do
        get :recent_sessions
        expect(response).to have_http_status(:ok)
        expect(json_response.length).to eq(5)
      end
    end

    context 'when user is not admin' do
      before do
        request.headers['Authorization'] = "Bearer #{coach_token}"
      end

      it 'returns forbidden status' do
        get :recent_sessions
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe 'GET #recent_users' do
    context 'when user is admin' do
      before do
        FactoryBot.create_list(:user, 6)
      end

      it 'returns 5 most recent users' do
        get :recent_users
        expect(response).to have_http_status(:ok)
        expect(json_response.length).to eq(5)
      end
    end

    context 'when user is not admin' do
      before do
        request.headers['Authorization'] = "Bearer #{coach_token}"
      end

      it 'returns forbidden status' do
        get :recent_users
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  private

  def json_response
    JSON.parse(response.body)
  end
end 
