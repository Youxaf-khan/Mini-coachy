# Use the official Ruby image as the base image
FROM ruby:3.2.2-slim

# Install required dependencies
RUN apt-get update -qq && apt-get install -y \
  build-essential \
  libpq-dev \
  nodejs \
  redis-server \
  && rm -rf /var/lib/apt/lists/*

# Set the working directory for the container
WORKDIR /app

# Install Bundler
RUN gem install bundler -v 2.5.22

# Copy the Gemfile and Gemfile.lock to install gems
COPY backend/Gemfile backend/Gemfile.lock ./

# Install the required Ruby gems
RUN bundle install

# Copy the backend application code into the container
COPY backend ./

# Set the environment variable to development
ENV RAILS_ENV=development

# Expose port 3000 for the Rails API
EXPOSE 3000

# Start the Rails server and Sidekiq processes
CMD ["sh", "-c", "bundle exec rails s -b '0.0.0.0' && bundle exec sidekiq"]
