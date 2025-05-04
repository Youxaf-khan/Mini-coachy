import React, { useState, useMemo, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AdminDashboard from './components/AdminDashboard';
import UserList from './components/UserList';

// Components
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import SessionList from './components/SessionList';
import SessionForm from './components/SessionForm';
import Navbar from './components/Navbar';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

function App() {
  const [mode, setMode] = useState('light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light' ? {
            primary: {
              main: '#2563eb',
              light: '#60a5fa',
              dark: '#1d4ed8',
            },
            secondary: {
              main: '#7c3aed',
              light: '#a78bfa',
              dark: '#5b21b6',
            },
            background: {
              default: '#f8fafc',
              paper: '#ffffff',
            },
            text: {
              primary: '#1e293b',
              secondary: '#64748b',
            }
          } : {
            // Dark mode colors
            primary: {
              main: '#60a5fa',
              light: '#93c5fd',
              dark: '#3b82f6',
            },
            secondary: {
              main: '#a78bfa',
              light: '#c4b5fd',
              dark: '#8b5cf6',
            },
            background: {
              default: '#0f172a',
              paper: '#1e293b',
            },
            text: {
              primary: '#f1f5f9',
              secondary: '#94a3b8',
            }
          }),
          success: {
            main: '#10b981',
            light: '#34d399',
            dark: '#059669',
          },
          error: {
            main: '#ef4444',
            light: '#f87171',
            dark: '#dc2626',
          },
          warning: {
            main: '#f59e0b',
            light: '#fbbf24',
            dark: '#d97706',
          },
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: { fontWeight: 600 },
          h2: { fontWeight: 600 },
          h3: { fontWeight: 600 },
          h4: { fontWeight: 600 },
          h5: { fontWeight: 600 },
          h6: { fontWeight: 600 },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 500,
                padding: '8px 16px',
                borderRadius: '8px',
              },
              contained: {
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                background: mode === 'light' 
                  ? 'linear-gradient(145deg, #2563eb, #7c3aed)'
                  : 'linear-gradient(145deg, #3b82f6, #8b5cf6)',
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              },
            },
          },
          MuiSelect: {
            styleOverrides: {
              root: {
                borderRadius: '8px',
              },
            },
          },
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserList />
                  </AdminRoute>
                }
              />
              <Route
                path="/sessions"
                element={
                  <PrivateRoute>
                    <SessionList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/sessions/new"
                element={
                  <PrivateRoute>
                    <SessionForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/sessions/:id/edit"
                element={
                  <PrivateRoute>
                    <SessionForm />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

const PrivateRoute = ({ children }) => {
  const { token, user } = useAuth();
  const location = useLocation();
  
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Redirect admin users to admin dashboard only if they are on the root path
  if (user.role === 'admin' && location.pathname === '/') {
    return <Navigate to="/admin" replace />;
  }

  // Allow both coaches and admins to access /sessions/new and /sessions/:id/edit
  if ((location.pathname === '/sessions/new' || location.pathname.match(/^\/sessions\/\d+\/edit$/)) && !['coach', 'admin'].includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default App;
