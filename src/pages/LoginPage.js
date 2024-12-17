import React, { useState } from 'react';
import { login } from '../api/auth';  // Your axios instance
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Snackbar, Alert } from '@mui/material'; // Snackbar for alerts

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false); // Controls Snackbar visibility
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await login(username, password);  // API call
            const user = response.data.user;

            // Store user details in localStorage
            localStorage.setItem('user', JSON.stringify(user));

            // Show success message and navigate
            setSuccessMessage('Login successful!');
            setOpenSnackbar(true); // Open Snackbar for success
            setTimeout(() => {
                // Redirect based on user role
                if (user.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            }, 1500); // Delay before navigating

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

            setOpenSnackbar(true); // Open Snackbar for error
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
        setErrorMessage('');
        setSuccessMessage('');
    };

    return (
        <div>
            <form onSubmit={handleLogin}>
                <TextField
                    label="Username"
                    fullWidth
                    margin="dense"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="dense"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit" variant="contained" color="primary">
                    Login
                </Button>
            </form>

            {/* Snackbar for success or error messages */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={successMessage ? 'success' : 'error'} // Green for success, red for error
                    sx={{ width: '100%' }} // Optional: Makes the alert expand fully
                >
                    {successMessage || errorMessage}
                </Alert>
            </Snackbar>

        </div>
    );
};

export default LoginPage;
