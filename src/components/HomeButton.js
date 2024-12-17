import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home'; // Material-UI Home Icon
import { styled } from '@mui/system';

// Styled circular button
const CircularButton = styled(Button)({
  borderRadius: '50%', // Makes the button circular
  minWidth: '50px',
  width: '50px',
  height: '50px',
  backgroundColor: '#4caf50', // Green color
  color: '#fff', // White icon color
  '&:hover': {
    backgroundColor: '#388e3c', // Darker green on hover
  },
  boxShadow: '0px 3px 5px rgba(0,0,0,0.2)', // Optional shadow
});

const HomeButton = () => {
  const navigate = useNavigate();

  const handleHome = () => {
    // Retrieve user details from local storage
    const user = JSON.parse(localStorage.getItem('user'));

    // Navigate based on role
    if (user && user.role === 'admin') {
      navigate('/admin'); // Admin dashboard
    } else if (user && user.role === 'doctor') {
      navigate('/dashboard'); // Doctor dashboard
    } else {
      // If user details are missing, redirect to login
      navigate('/');
    }
  };

  return (
    <CircularButton onClick={handleHome} title="Home">
      <HomeIcon />
    </CircularButton>
  );
};

export default HomeButton;
