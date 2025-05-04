require "redis"

# Redis configuration
begin
  redis_config = {
    url: ENV.fetch("REDIS_URL", "redis://localhost:6379/1"),
    ssl_params: { verify_mode: OpenSSL::SSL::VERIFY_NONE },
    reconnect_attempts: 5
  }

  # Configure Sidekiq
  Sidekiq.configure_server do |config|
    config.redis = redis_config
  end

  Sidekiq.configure_client do |config|
    config.redis = redis_config
  end

  # Initialize Redis connection for Rails cache
  Rails.application.config.cache_store = :redis_cache_store, redis_config

  # Initialize Redis connection for general use
  $redis = Redis.new(redis_config)
rescue Redis::CannotConnectError => e
  Rails.logger.warn "Redis connection failed: #{e.message}. Running without Redis."
  # Fallback to memory store for caching
  Rails.application.config.cache_store = :memory_store
end
