# Mini Coachy Frontend

This is the React SPA frontend for the Mini Coachy app—a modern platform for managing coaching sessions between coaches and clients.

## Features
- Login, registration, and JWT-based authentication
- Role-based dashboards (Admin, Coach, Client)
- Session management (view, create, edit, delete)
- Search and filter sessions
- Responsive, modern UI with Material-UI
- Route protection for authenticated users
- Axios for API communication

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
cd frontend
npm install
```

### Running the App
```bash
npm start
```
The app will be available at [http://localhost:3000](http://localhost:3000)

### Running Tests
```bash
npm test
```

## Project Structure
- `src/components/` — React components (Navbar, Dashboard, SessionList, etc.)
- `src/contexts/` — Auth context for JWT and user state
- `src/App.js` — Main app and routing
- `public/` — Static files, index.html, favicon, logo

## Security
- JWT stored in memory (not localStorage) for security
- Protected routes for authenticated users
- Input validation on all forms

## Cleaned Up For Mini Coachy
- All branding updated to "Mini Coachy"
- Modern, clean UI
- No unused files or boilerplate

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
MIT
