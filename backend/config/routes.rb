Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  namespace :api do
    namespace :v1 do
      post "login", to: "authentication#login"
      post "register", to: "authentication#register"
      get "me", to: "authentication#me"

      resources :users do
        collection do
          get "stats"
          get "recent_sessions"
          get "recent_users"
        end
      end

      resources :sessions
    end
  end
end
