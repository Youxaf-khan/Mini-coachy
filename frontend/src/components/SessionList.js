import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  MenuItem,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

function SessionList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/sessions');
      setSessions(response.data);
    } catch (err) {
      setError('Failed to fetch sessions');
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (session) => {
    setSessionToDelete(session);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/sessions/${sessionToDelete.id}`);
      setSessions(sessions.filter(s => s.id !== sessionToDelete.id));
      setDeleteDialogOpen(false);
      setSessionToDelete(null);
    } catch (err) {
      setError('Failed to delete session');
      console.error('Error deleting session:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredSessions = sessions
    .filter(session => {
      if (filter === 'all') return true;
      if (filter === 'upcoming') return new Date(session.start_time) > new Date();
      if (filter === 'past') return new Date(session.end_time) < new Date();
      return session.status === filter;
    })
    .filter(session =>
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

  if (loading) return <Typography>Loading sessions...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Sessions</Typography>
        {user?.role === 'coach' && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/sessions/new')}
          >
            Create New Session
          </Button>
        )}
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Search sessions"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            select
            label="Filter by"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <MenuItem value="all">All Sessions</MenuItem>
            <MenuItem value="upcoming">Upcoming</MenuItem>
            <MenuItem value="past">Past</MenuItem>
            <MenuItem value="scheduled">Scheduled</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Coach</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell>{session.title}</TableCell>
                <TableCell>
                  {new Date(session.start_time).toLocaleString()}
                </TableCell>
                <TableCell>
                  {Math.round((new Date(session.end_time) - new Date(session.start_time)) / 60000)} min
                </TableCell>
                <TableCell>
                  <Chip
                    label={session.status}
                    color={getStatusColor(session.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{session.coach?.name}</TableCell>
                <TableCell>{session.client?.name}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/sessions/${session.id}/edit`)}
                  >
                    <EditIcon />
                  </IconButton>
                  {(user?.role === 'coach' || user?.role === 'admin') && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(session)}
                      sx={{
                        '&:hover': {
                          bgcolor: 'error.light',
                          '& .MuiSvgIcon-root': {
                            color: 'white'
                          }
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the session "{sessionToDelete?.title}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant="contained"
            color="error"
            sx={{
              '&:hover': {
                bgcolor: 'error.dark',
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default SessionList; 
