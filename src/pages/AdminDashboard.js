import React, { useEffect, useState } from 'react';
import { getDoctors, createDoctor, updateDoctor, deleteDoctor } from '../api/users';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

import LogoutButton from '../components/LogoutButton';

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
            setFormData(doctor); // Pre-fill the form for editing
        } else {
            setEditMode(false);
            setSelectedDoctorId(null);
            setFormData({ username: '', email: '', first_name: '', last_name: '', role: 'doctor', password: '' });
        }
        setOpen(true);
    };

    // Close the dialog
    const handleClose = () => {
        setOpen(false);
    };

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
        <div>
            <h1>Admin Dashboard</h1>
            <h2>Welcome {user.first_name}!</h2>
            <Button variant="contained" color="primary" onClick={() => handleOpen()}>
                Add Doctor
            </Button>
            <LogoutButton />
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
                                <Button onClick={() => handleOpen(doctor)}>Edit</Button>
                                <Button onClick={() => handleDelete(doctor.id)} color="error">
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

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
        </div>
    );
};

export default AdminDashboard;
