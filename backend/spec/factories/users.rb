FactoryBot.define do
  factory :user do
    email { Faker::Internet.unique.email }
    password { 'password123' }
    name { Faker::Name.name }
    role { 'client' }

    trait :coach do
      role { 'coach' }
    end

    trait :admin do
      role { 'admin' }
    end
  end
end
