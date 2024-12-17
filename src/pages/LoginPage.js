import React, { useState } from 'react';
import { login } from '../api/auth'; // Your axios instance
import { useNavigate } from 'react-router-dom';
import {
  Button,
  TextField,
  Snackbar,
  Alert,
  Box,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material'; // Snackbar for alerts and UI components
import { styled } from '@mui/system';

// Styled outer container
const OuterContainer = styled(Box)({
  display: 'flex',
  height: '100vh',
});

// Left half styling
const LeftContainer = styled(Box)({
  backgroundColor: '#008080', // Healthcare teal
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#fff',
  width: '50%',
  padding: '20px',
});

// Right half styling
const RightContainer = styled(Box)({
  backgroundColor: '#f5f5f5',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '50%',
});

// Form container
const FormContainer = styled(Paper)({
  padding: '30px',
  borderRadius: '10px',
  boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
  maxWidth: '400px',
  width: '100%',
});

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false); // Controls Snackbar visibility
  const [loading, setLoading] = useState(false); // Controls login button state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Disable button and show loading spinner

    try {
      const response = await login(username, password); // API call
      const user = response.data.user;

      // Store user details in localStorage
      localStorage.setItem('user', JSON.stringify(user));

      // Show success message and navigate
      setSuccessMessage('Login successful!');
      setOpenSnackbar(true);

      setTimeout(() => {
        // Redirect based on user role
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }, 1500);
    } catch (error) {
      // Handle different error scenarios
      if (error.response) {
        if (error.response.status === 403) {
          setErrorMessage('User is inactive');
        } else if (error.response.status === 401) {
          setErrorMessage('Invalid username or password');
        }
      } else {
        setErrorMessage('An unexpected error occurred');
      }
      setOpenSnackbar(true);
    } finally {
      setLoading(false); // Re-enable the login button
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <OuterContainer>
      {/* Left Section */}
      <LeftContainer>
        <Typography variant="h4" gutterBottom>
          Welcome to
        </Typography>
        <Typography variant="h2" fontWeight="bold">
          HeartTrack
        </Typography>
      </LeftContainer>

      {/* Right Section */}
      <RightContainer>
        <FormContainer>
          <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
            Login
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Box mt={3}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading} // Disable button during loading
                startIcon={loading && <CircularProgress size={20} color="inherit" />}
              >
                {loading ? 'Logging In...' : 'Login'}
              </Button>
            </Box>
          </form>
        </FormContainer>
      </RightContainer>

      {/* Snackbar for success or error messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={successMessage ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {successMessage || errorMessage}
        </Alert>
      </Snackbar>
    </OuterContainer>
  );
};

export default LoginPage;
