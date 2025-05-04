import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
} from '@mui/material';
import axios from 'axios';

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_users: 0,
    total_sessions: 0,
    active_coaches: 0,
    active_clients: 0,
  });
  const [recentSessions, setRecentSessions] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, sessionsResponse, usersResponse] = await Promise.all([
        axios.get('http://localhost:3000/api/v1/users/stats'),
        axios.get('http://localhost:3000/api/v1/users/recent_sessions'),
        axios.get('http://localhost:3000/api/v1/users/recent_users'),
      ]);

      setStats(statsResponse.data);
      setRecentSessions(sessionsResponse.data);
      setRecentUsers(usersResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
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
        return '#7c3aed';
      case 'client':
        return '#2563eb';
      case 'admin':
        return '#dc2626';
      default:
        return '#64748b';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Total Users
            </Typography>
            <Typography variant="h3" color="primary">
              {stats.total_users}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Total Sessions
            </Typography>
            <Typography variant="h3" color="primary">
              {stats.total_sessions}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Active Coaches
            </Typography>
            <Typography variant="h3" color="primary">
              {stats.active_coaches}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Active Clients
            </Typography>
            <Typography variant="h3" color="primary">
              {stats.active_clients}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        {/* Recent Sessions */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Sessions
              </Typography>
              <List>
                {recentSessions.map((session) => (
                  <React.Fragment key={session.id}>
                    <ListItem>
                      <ListItemText
                        primary={session.title}
                        secondary={`${new Date(session.start_time).toLocaleString()} - ${session.coach?.name} with ${session.client?.name}`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate('/sessions')}>
                View All Sessions
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Recent Users */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Users
              </Typography>
              <List>
                {recentUsers.map((user) => (
                  <React.Fragment key={user.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: getRoleColor(user.role) }}>
                          {getInitials(user.name)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={user.name}
                        secondary={`${user.email} - ${user.role}`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate('/admin/users')}>
                View All Users
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default AdminDashboard; 
