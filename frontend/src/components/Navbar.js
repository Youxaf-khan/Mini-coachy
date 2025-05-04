import React, { useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAuth } from '../contexts/AuthContext';
import { ColorModeContext } from '../App';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NavMenu from './NavMenu';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuOpen = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleMenuNavigate = (to) => {
    navigate(to);
    handleMenuClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'coach':
        return '#7c3aed'; // Purple
      case 'client':
        return '#2563eb'; // Blue
      case 'admin':
        return '#dc2626'; // Red
      default:
        return '#64748b'; // Gray
    }
  };

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar sx={{ gap: 2 }}>
          {/* Logo: Mini Coachy SVG (white, smaller, centered) */}
          <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexGrow: 1, height: 48 }}>
            <svg width="140" height="40" viewBox="0 0 180 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
              <text x="0" y="22" fontFamily="Pacifico, cursive" fontSize="16" fill="#fff">Mini</text>
              <text x="0" y="50" fontFamily="Montserrat, Arial, sans-serif" fontSize="28" fontWeight="bold" fill="#fff">COACHY</text>
              <circle cx="110" cy="15" r="4" fill="#fff" />
            </svg>
          </Box>
          
          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton 
                onClick={colorMode.toggleColorMode} 
                color="inherit"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                  }
                }}
              >
                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: getRoleColor(user.role),
                    width: 35,
                    height: 35,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                  }}
                >
                  {getInitials(user.name)}
                </Avatar>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'white' }}>
                    {user.name}
                  </Typography>
                  <Chip
                    label={user.role}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '0.75rem',
                      height: '20px',
                      '& .MuiChip-label': {
                        px: 1,
                      },
                    }}
                  />
                </Box>
              </Box>
              <NavMenu user={user} navigate={navigate} />
              {/* Logout button remains visible */}
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                Logout
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                onClick={colorMode.toggleColorMode} 
                color="inherit"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                  }
                }}
              >
                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                Login
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/register"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                Register
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar; 
