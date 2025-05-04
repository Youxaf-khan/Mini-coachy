require 'rails_helper'

RSpec.describe Api::V1::SessionsController, type: :controller do
  let(:client) { FactoryBot.create(:user, role: 'client') }
  let(:coach) { FactoryBot.create(:user, role: 'coach') }
  let(:admin) { FactoryBot.create(:user, role: 'admin') }
  let(:token) { JsonWebToken.encode(user_id: coach.id) }
  let(:admin_token) { JsonWebToken.encode(user_id: admin.id) }
  let!(:session) { FactoryBot.create(:session, coach: coach, client: client) }
  let(:valid_attributes) do
    {
      title: 'Test Session',
      description: 'Test description',
      start_time: 3.days.from_now,
      end_time: 4.days.from_now,
      status: 'scheduled',
      client_id: client.id
    }
  end
  let(:invalid_attributes) do
    {
      title: '',
      start_time: nil,
      end_time: nil
    }
  end

  before do
    request.headers['Authorization'] = "Bearer #{token}"
  end

  describe 'GET #index' do
    context 'when user is authenticated' do
      before do
        3.times do |i|
          FactoryBot.create(:session,
            coach: coach,
            client: client,
            start_time: Time.now + i.hours,
            end_time: Time.now + (i + 1).hours
          )
        end
      end

      it 'returns sessions for the current user' do
        get :index
        expect(response).to have_http_status(:ok)
        expect(json_response).to be_an(Array)
        expect(json_response.length).to eq(4)
      end

      it 'filters sessions by status' do
        get :index, params: { status: 'scheduled' }
        expect(response).to have_http_status(:ok)
        expect(json_response.all? { |s| s['status'] == 'scheduled' }).to be true
      end
    end

    context 'when user is not authenticated' do
      before do
        request.headers['Authorization'] = nil
      end

      it 'returns unauthorized status' do
        get :index
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'GET #show' do
    context 'when session exists' do
      it 'returns the session' do
        get :show, params: { id: session.id }
        expect(response).to have_http_status(:ok)
        expect(json_response['id']).to eq(session.id)
      end

      it 'includes coach and client information' do
        get :show, params: { id: session.id }
        expect(response).to have_http_status(:ok)
        expect(json_response).to include('coach', 'client')
      end
    end

    context 'when session does not exist' do
      it 'returns not found status' do
        get :show, params: { id: 999 }
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'when user is not authorized' do
      let(:other_coach) { FactoryBot.create(:user, role: 'coach') }
      let(:other_token) { JsonWebToken.encode(user_id: other_coach.id) }

      before do
        request.headers['Authorization'] = "Bearer #{other_token}"
      end

      it 'returns forbidden status' do
        get :show, params: { id: session.id }
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe 'POST #create' do
    context 'with valid attributes' do
      it 'creates a new session' do
        expect {
          post :create, params: { session: valid_attributes }
        }.to change(Session, :count).by(1)
        expect(response).to have_http_status(:created)
        expect(json_response['title']).to eq(valid_attributes[:title])
      end
    end

    context 'with invalid attributes' do
      it 'returns unprocessable entity status' do
        post :create, params: { session: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response['errors']).to be_present
      end
    end

    context 'when user is not a coach' do
      let(:client_token) { JsonWebToken.encode(user_id: client.id) }

      before do
        request.headers['Authorization'] = "Bearer #{client_token}"
      end

      it 'returns forbidden status' do
        post :create, params: { session: valid_attributes }
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe 'PUT #update' do
    context 'with valid attributes' do
      it 'updates the session' do
        put :update, params: { id: session.id, session: { title: 'Updated Title' } }
        expect(response).to have_http_status(:ok)
        expect(session.reload.title).to eq('Updated Title')
      end
    end

    context 'with invalid attributes' do
      it 'returns unprocessable entity status' do
        put :update, params: { id: session.id, session: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response['errors']).to be_present
      end
    end

    context 'when user is not authorized' do
      let(:other_coach) { FactoryBot.create(:user, role: 'coach') }
      let(:other_token) { JsonWebToken.encode(user_id: other_coach.id) }

      before do
        request.headers['Authorization'] = "Bearer #{other_token}"
      end

      it 'returns forbidden status' do
        put :update, params: { id: session.id, session: { title: 'Updated Title' } }
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe 'DELETE #destroy' do
    context 'when user is authorized' do
      it 'deletes the session' do
        expect {
          delete :destroy, params: { id: session.id }
        }.to change(Session, :count).by(-1)
        expect(response).to have_http_status(:no_content)
      end
    end

    context 'when user is not authorized' do
      let(:other_coach) { FactoryBot.create(:user, role: 'coach') }
      let(:other_token) { JsonWebToken.encode(user_id: other_coach.id) }

      before do
        request.headers['Authorization'] = "Bearer #{other_token}"
      end

      it 'returns forbidden status' do
        delete :destroy, params: { id: session.id }
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  private

  def json_response
    JSON.parse(response.body)
  end
end 
