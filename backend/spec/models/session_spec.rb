require 'rails_helper'

RSpec.describe Session, type: :model do
  let(:coach) { FactoryBot.create(:user, :coach) }
  let(:client) { FactoryBot.create(:user) }

  it 'is valid with valid attributes' do
    session = FactoryBot.build(:session, coach: coach, client: client)
    expect(session).to be_valid
  end

  it 'is invalid without a title' do
    session = FactoryBot.build(:session, title: nil, coach: coach, client: client)
    expect(session).not_to be_valid
  end

  it 'is invalid if end_time is before start_time' do
    session = FactoryBot.build(:session, start_time: 2.days.from_now, end_time: 1.day.from_now, coach: coach, client: client)
    expect(session).not_to be_valid
  end

  it 'is invalid with an invalid status' do
    session = FactoryBot.build(:session, status: 'foo', coach: coach, client: client)
    expect(session).not_to be_valid
  end

  it 'prevents overlapping sessions for the same coach' do
    FactoryBot.create(:session, coach: coach, client: client, start_time: 1.day.from_now, end_time: 2.days.from_now)
    overlapping = FactoryBot.build(:session, coach: coach, client: client, start_time: 1.5.days.from_now, end_time: 2.5.days.from_now)
    expect(overlapping).not_to be_valid
    expect(overlapping.errors[:base]).to include('Coach has an overlapping session during this time')
  end
end
