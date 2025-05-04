# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin Ajax requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    if Rails.env.development?
      origins "http://localhost:3001", "http://localhost:80", "http://localhost"  # Development frontend addresses
    else
      origins ENV.fetch("FRONTEND_URL", "http://localhost:80"), "http://localhost"  # Production frontend address
    end

    resource "*",
      headers: :any,
      methods: [ :get, :post, :put, :patch, :delete, :options, :head ],
      expose: [ "Authorization" ],
      credentials: true,
      max_age: 86400  # Cache preflight requests for 24 hours
  end
end
