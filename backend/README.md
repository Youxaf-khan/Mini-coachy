# Mini Coachy Backend

This is the Rails 7 API backend for the Mini Coachy app—a modern platform for managing coaching sessions between coaches and clients.

## Features
- JWT authentication
- Role-based access control (Admin, Coach, Client)
- Session management (CRUD)
- Redis caching for sessions list (5 min expiry)
- Sidekiq background jobs for notifications
- PostgreSQL database
- RSpec for testing
- Pundit for authorization

## Roles
- **Admin:** Can manage all users and sessions
- **Coach:** Can manage their own sessions
- **Client:** Can view their sessions

## Setup Instructions

### Prerequisites
- Ruby 3.2+
- PostgreSQL
- Redis

### Setup
```bash
cd backend
bundle install
rails db:create db:migrate
```

### Running the Server
```bash
rails s
```

### Running Sidekiq (for background jobs)
```bash
bundle exec sidekiq
```

### Running Tests
```bash
rspec
```

## Caching & Background Jobs
- Sessions list is cached in Redis for 5 minutes per user/role
- Cache is invalidated on session create/update/delete
- Session creation triggers Sidekiq jobs for notifications

## Security
- JWT-based authentication
- Pundit for RBAC
- Secure password hashing
- CORS enabled
- Input validation on all models

## Project Structure
- `app/models/` — User, Session, and related models
- `app/controllers/` — API controllers (namespaced under `/api/v1`)
- `app/policies/` — Pundit policies (e.g., SessionPolicy)
- `spec/` — RSpec tests (models, requests)
- `config/` — Rails and environment configuration

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
MIT
