FactoryBot.define do
  factory :session do
    title { Faker::Lorem.sentence }
    description { Faker::Lorem.paragraph }
    start_time { 1.day.from_now }
    end_time { 2.days.from_now }
    status { 'scheduled' }

    association :coach, factory: :user
    association :client, factory: :user
  end
end
