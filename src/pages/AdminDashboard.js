import React, { useEffect, useState } from 'react';
import { getDoctors, createDoctor, updateDoctor, deleteDoctor } from '../api/users';
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Box,
    Typography,
    IconButton,
} from '@mui/material';


import LogoutButton from '../components/LogoutButton';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { styled } from '@mui/system';
import HomeButton from '../components/HomeButton';

// Styled container with background color
const Container = styled(Box)({
    backgroundColor: '#008080', // Healthcare industry teal
    minHeight: '100vh',
    color: '#fff', // White text
    padding: '20px',
});

// Styled table container
const TableContainer = styled(Box)({
    margin: '20px auto',
    padding: '0 20px',
    maxWidth: '90%',
    backgroundColor: '#fff', // White table background
    borderRadius: '10px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
    overflowX: 'auto',
    color: '#000', // Black text for table
});

// Styled circular indigo button
const CircularButton = styled(IconButton)({
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    backgroundColor: '#3f51b5', // Indigo color
    color: '#fff',
    marginRight: '10px',
    '&:hover': {
        backgroundColor: '#303f9f', // Darker indigo on hover
    },
    boxShadow: '0px 3px 5px rgba(0,0,0,0.2)',
});

const AdminDashboard = () => {
    const [doctors, setDoctors] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ username: '', email: '', first_name: '', last_name: '', role: 'doctor', password: '' });
    const [editMode, setEditMode] = useState(false);
    const [selectedDoctorId, setSelectedDoctorId] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));

    // Fetch the list of doctors
    useEffect(() => {
        const fetchDoctors = async () => {
            const doctorsData = await getDoctors();
            setDoctors(doctorsData.filter((user) => user.role === 'doctor'));
        };
        fetchDoctors();
    }, []);

    // Open the dialog for creating or editing
    const handleOpen = (doctor = null) => {
        if (doctor) {
            setEditMode(true);
            setSelectedDoctorId(doctor.id);
            setFormData(doctor);
        } else {
            setEditMode(false);
            setSelectedDoctorId(null);
            setFormData({ username: '', email: '', first_name: '', last_name: '', role: 'doctor', password: '' });
        }
        setOpen(true);
    };

    // Close the dialog
    const handleClose = () => setOpen(false);

    // Handle form submission for create or update
    const handleSubmit = async () => {
        if (editMode) {
            await updateDoctor(selectedDoctorId, formData);
        } else {
            await createDoctor(formData);
        }
        const doctorsData = await getDoctors();
        setDoctors(doctorsData.filter((user) => user.role === 'doctor'));
        handleClose();
    };

    // Handle deleting a doctor
    const handleDelete = async (id) => {
        await deleteDoctor(id);
        const doctorsData = await getDoctors();
        setDoctors(doctorsData.filter((user) => user.role === 'doctor'));
    };

    return (
        <Container>
            {/* Top Bar with Icons */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" fontWeight="bold">
                    HeartTrack
                </Typography>
                <Box>
                    <CircularButton onClick={() => handleOpen()} title="Add Doctor">
                        <PersonAddIcon />
                    </CircularButton>
                    <HomeButton /> {/* Home button */}
                    <LogoutButton /> {/* Logout button */}
                </Box>
            </Box>

            {/* Welcome Section */}
            <Box my={4}>
                <Typography variant="h6">Welcome</Typography>
                <Typography variant="h4" fontWeight="bold">
                    {user.first_name}
                </Typography>
            </Box>

            {/* Table Section */}
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {doctors.map((doctor) => (
                            <TableRow key={doctor.id}>
                                <TableCell>{doctor.username}</TableCell>
                                <TableCell>{doctor.email}</TableCell>
                                <TableCell>{doctor.first_name}</TableCell>
                                <TableCell>{doctor.last_name}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleOpen(doctor)} color="primary">
                                        Edit
                                    </Button>
                                    <Button onClick={() => handleDelete(doctor.id)} color="error">
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add/Edit Doctor Dialog */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editMode ? 'Edit Doctor' : 'Add Doctor'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Username"
                        fullWidth
                        margin="dense"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        margin="dense"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <TextField
                        label="First Name"
                        fullWidth
                        margin="dense"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    />
                    <TextField
                        label="Last Name"
                        fullWidth
                        margin="dense"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    />
                    {!editMode && (
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            margin="dense"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} color="primary">
                        {editMode ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdminDashboard;
