#!/bin/bash
set -e

rm -f tmp/pids/server.pid

if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "Preparing the database..."
  if [ "$RAILS_ENV" == "production" ]; then
    echo "Running migrations..."
    bundle exec rails db:migrate
  fi
fi

# Start the Rails server
exec "$@"
