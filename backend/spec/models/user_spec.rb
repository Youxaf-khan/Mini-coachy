require 'rails_helper'

RSpec.describe User, type: :model do
  it 'is valid with valid attributes' do
    user = FactoryBot.build(:user)
    expect(user).to be_valid
  end

  it 'is invalid without an email' do
    user = FactoryBot.build(:user, email: nil)
    expect(user).not_to be_valid
  end

  it 'is invalid with a short password' do
    user = FactoryBot.build(:user, password: '123')
    expect(user).not_to be_valid
  end

  it 'is invalid without a name' do
    user = FactoryBot.build(:user, name: nil)
    expect(user).not_to be_valid
  end

  it 'is invalid with an invalid role' do
    user = FactoryBot.build(:user, role: 'invalid')
    expect(user).not_to be_valid
  end

  it 'returns true for admin? if role is admin' do
    user = FactoryBot.build(:user, role: 'admin')
    expect(user.admin?).to be true
  end

  it 'returns true for coach? if role is coach' do
    user = FactoryBot.build(:user, role: 'coach')
    expect(user.coach?).to be true
  end

  it 'returns true for client? if role is client' do
    user = FactoryBot.build(:user, role: 'client')
    expect(user.client?).to be true
  end
end
