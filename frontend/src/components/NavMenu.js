import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

function NavMenu({ user, navigate }) {
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

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleMenuClick}
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.2)',
          },
        }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {user.role === 'admin' && (
          <MenuItem onClick={() => handleMenuNavigate('/sessions')}>All Sessions</MenuItem>
        )}
        {['coach', 'client'].includes(user.role) && (
          <MenuItem onClick={() => handleMenuNavigate('/sessions')}>Sessions</MenuItem>
        )}
        {['coach', 'admin'].includes(user.role) && (
          <MenuItem onClick={() => handleMenuNavigate('/sessions/new')}>New Session</MenuItem>
        )}
        {user.role === 'admin' && (
          <MenuItem onClick={() => handleMenuNavigate('/admin/users')}>Users</MenuItem>
        )}
      </Menu>
    </>
  );
}

export default NavMenu; 
