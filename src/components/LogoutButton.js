import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout'; // Material-UI icon
import { styled } from '@mui/system';
import axios from '../api/apiClient'; // Import axios instance

// Styled circular button
const CircularButton = styled(Button)({
  borderRadius: '50%', // Makes the button circular
  minWidth: '50px',
  width: '50px',
  height: '50px',
  backgroundColor: '#f44336', // Red color
  color: '#fff', // White icon color
  '&:hover': {
    backgroundColor: '#d32f2f', // Darker red on hover
  },
  boxShadow: '0px 3px 5px rgba(0,0,0,0.2)', // Optional shadow
});

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call the logout API
      await axios.post('/users/logout/');
      
      // Clear user data from localStorage
      localStorage.removeItem('user');
      
      // Redirect to login page
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      // Optionally, display an error message to the user
    }
  };

  return (
    <CircularButton onClick={handleLogout} title="Logout">
      <LogoutIcon />
    </CircularButton>
  );
};

export default LogoutButton;
