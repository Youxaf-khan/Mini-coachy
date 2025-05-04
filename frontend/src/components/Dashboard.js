import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/sessions');
        const now = new Date();
        const upcoming = response.data
          .filter(session => new Date(session.start_time) > now)
          .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
          .slice(0, 5); // Get only the next 5 sessions
        setUpcomingSessions(upcoming);
      } catch (err) {
        setError('Failed to fetch sessions');
        console.error('Error fetching sessions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const formatDateTime = (dateTimeStr) => {
    return new Date(dateTimeStr).toLocaleString();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* User Info Card */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Welcome, {user?.name}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Role: {user?.role}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Email: {user?.email}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/sessions')}
                fullWidth
              >
                View All Sessions
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Upcoming Sessions */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Upcoming Sessions
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {loading ? (
              <Typography>Loading sessions...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : upcomingSessions.length === 0 ? (
              <Typography>No upcoming sessions</Typography>
            ) : (
              upcomingSessions.map((session) => (
                <Card key={session.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{session.title}</Typography>
                    <Typography color="text.secondary">
                      {formatDateTime(session.start_time)} - {formatDateTime(session.end_time)}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {session.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Status: {session.status}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => navigate(`/sessions/${session.id}/edit`)}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard; 
