import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Stack,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function SessionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clients, setClients] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_time: new Date(),
    end_time: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hour later
    status: 'scheduled',
    client_id: '',
    coach_id: '',
  });
  const [touched, setTouched] = useState({
    title: false,
    client_id: false,
    coach_id: false,
    start_time: false,
    end_time: false,
  });

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/sessions/${id}`);
        const session = response.data;
        setFormData({
          ...session,
          start_time: new Date(session.start_time),
          end_time: new Date(session.end_time),
        });
      } catch (err) {
        setError('Failed to fetch session details');
        console.error('Error fetching session:', err);
      }
    };

    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/users?role=client');
        setClients(response.data);
        if (response.data.length === 0) {
          setError('No clients available. Please add clients before creating a session.');
        }
      } catch (err) {
        console.error('Error fetching clients:', err);
        setError('Failed to load clients. Please try again later.');
      }
    };

    const fetchCoaches = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/users?role=coach');
        setCoaches(response.data);
      } catch (err) {
        console.error('Error fetching coaches:', err);
      }
    };

    if (id) {
      fetchSession();
    }
    fetchClients();
    if (user.role === 'admin') {
      fetchCoaches();
    }
  }, [id, user.role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleDateChange = (name) => (date) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.title.trim()) errors.push('Title is required');
    if (!formData.client_id) errors.push('Client is required');
    if (user.role === 'admin' && !formData.coach_id) errors.push('Coach is required');
    if (!formData.start_time) errors.push('Start time is required');
    if (!formData.end_time) errors.push('End time is required');
    if (formData.end_time <= formData.start_time) {
      errors.push('End time must be after start time');
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      setLoading(false);
      return;
    }

    try {
      const sessionData = {
        ...formData,
        start_time: formData.start_time.toISOString(),
        end_time: formData.end_time.toISOString(),
      };
      if (user.role !== 'admin') {
        delete sessionData.coach_id;
      }
      if (id) {
        await axios.put(`http://localhost:3000/api/v1/sessions/${id}`, { session: sessionData });
      } else {
        await axios.post('http://localhost:3000/api/v1/sessions', { session: sessionData });
      }
      navigate('/sessions');
    } catch (err) {
      setError(err.response?.data?.errors || 'Failed to save session');
      console.error('Error saving session:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="md">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4, color: 'primary.main' }}>
              {id ? 'Edit Session' : 'Create New Session'}
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  error={touched.title && !formData.title.trim()}
                  helperText={touched.title && !formData.title.trim() ? 'Title is required' : ''}
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  variant="outlined"
                />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <DateTimePicker
                      label="Start Time"
                      value={formData.start_time}
                      onChange={handleDateChange('start_time')}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                          error: touched.start_time && !formData.start_time,
                          helperText: touched.start_time && !formData.start_time ? 'Start time is required' : ''
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <DateTimePicker
                      label="End Time"
                      value={formData.end_time}
                      onChange={handleDateChange('end_time')}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                          error: touched.end_time && !formData.end_time,
                          helperText: touched.end_time && !formData.end_time ? 'End time is required' : ''
                        }
                      }}
                    />
                  </Grid>
                </Grid>

                {user.role === 'admin' && (
                  <Box sx={{ width: '40%' }}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="coach-select-label">Coach *</InputLabel>
                      <Select
                        labelId="coach-select-label"
                        name="coach_id"
                        value={formData.coach_id}
                        onChange={handleChange}
                        label="Coach *"
                        required
                        error={touched.coach_id && !formData.coach_id}
                        sx={{
                          height: '56px',
                          '& .MuiSelect-select': {
                            height: '56px !important',
                            display: 'flex',
                            alignItems: 'center',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }
                        }}
                      >
                        {coaches.map((coach) => (
                          <MenuItem key={coach.id} value={coach.id}>
                            <Box>
                              <Typography variant="subtitle1" component="div" sx={{ fontWeight: 500 }}>
                                {coach.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                                {coach.email}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.coach_id && !formData.coach_id && (
                        <FormHelperText error>Please select a coach</FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                )}

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Box sx={{ width: '40%' }}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="client-select-label">Client *</InputLabel>
                      <Select
                        labelId="client-select-label"
                        name="client_id"
                        value={formData.client_id}
                        onChange={handleChange}
                        label="Client *"
                        required
                        error={touched.client_id && !formData.client_id}
                        sx={{
                          height: '56px',
                          '& .MuiSelect-select': {
                            height: '56px !important',
                            display: 'flex',
                            alignItems: 'center',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }
                        }}
                      >
                        {clients.map((client) => (
                          <MenuItem key={client.id} value={client.id}>
                            <Box>
                              <Typography variant="subtitle1" component="div" sx={{ fontWeight: 500 }}>
                                {client.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                                {client.email}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.client_id && !formData.client_id && (
                        <FormHelperText error>Please select a client</FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ width: '40%' }}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="status-select-label">Status</InputLabel>
                      <Select
                        labelId="status-select-label"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        label="Status"
                      >
                        <MenuItem value="scheduled">Scheduled</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/sessions')}
                    sx={{ minWidth: 100 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    sx={{ minWidth: 100 }}
                  >
                    {loading ? 'Saving...' : id ? 'Update Session' : 'Create Session'}
                  </Button>
                </Box>
              </Stack>
            </form>
          </Paper>
        </Box>
      </Container>
    </LocalizationProvider>
  );
}

export default SessionForm; 
