# Mini Coachy

A full-stack application for managing coaching sessions between coaches and clients.

## Features

- User authentication (JWT-based)
- Role-based access control (Coach/Client/Admin)
- Session management
- Real-time notifications
- Email notifications
- Redis-backed caching
- Background job processing

## Architecture

### Backend (Rails)
- RESTful API
- JWT authentication
- Redis caching
- Sidekiq background jobs
- PostgreSQL database

### Frontend (React)
- Material-UI components
- Context-based state management
- Protected routes
- Responsive design

## Setup Instructions

### Prerequisites
- Ruby 3.2.0
- Node.js 18+
- PostgreSQL
- Redis
- Docker (optional)

### Backend Setup
```bash
cd backend
bundle install
rails db:create db:migrate db:seed
rails s
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Docker setup
```bash
docker compose build --no-cache
docker compose up
```
- Access frontend on localhost:80
- Admin role:
- Email: adminomar@example.com
- password: password123

## Development

### Running Tests
```bash
# Backend tests
cd backend
rspec

# Frontend tests
cd frontend
npm test
```

### Code Quality
```bash
# Backend
cd backend
rubocop

# Frontend
cd frontend
npm run lint
```

## Security Features

- JWT token-based authentication
- Role-based access control
- Secure password hashing
- CORS configuration
- Input validation

## Caching Strategy

- Redis-backed caching for sessions list
- 5-minute cache expiration
- Automatic cache invalidation on updates
- Cache keys based on user role and ID

## Background Jobs

- Session notification emails
- Session reminder emails
- Redis-backed job queue
- Job retry mechanism

## API Documentation

### Authentication
- POST /api/v1/register
- POST /api/v1/login

### Sessions
- GET /api/v1/sessions
- POST /api/v1/sessions
- GET /api/v1/sessions/:id
- PUT /api/v1/sessions/:id
- DELETE /api/v1/sessions/:id

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT 
