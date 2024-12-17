import React, { useEffect, useState } from 'react';
import { getPatients, deletePatient, updatePatient, createPatient } from '../api/patients';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Box,
  Typography,
  IconButton,
} from '@mui/material';

import HomeButton from '../components/HomeButton';
import LogoutButton from '../components/LogoutButton';
import { styled } from '@mui/system';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

// Styled teal container
const Container = styled(Box)({
  backgroundColor: '#008080', // Teal background
  minHeight: '100vh',
  color: '#fff',
  padding: '20px',
});

// Styled table container
const TableContainer = styled(Box)({
  margin: '20px auto',
  padding: '20px',
  maxWidth: '90%',
  backgroundColor: '#fff',
  borderRadius: '10px',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
  overflowX: 'auto',
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

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // Fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      const data = await getPatients();
      setPatients(data);
    };
    fetchPatients();
  }, []);

  // Delete patient
  const handleDelete = async (id) => {
    await deletePatient(id);
    setPatients((prev) => prev.filter((patient) => patient.id !== id));
  };

  // Open Add Patient modal
  const handleOpenAddModal = () => {
    setEditMode(false);
    setFormData({ first_name: '', last_name: '', date_of_birth: '' });
    setOpen(true);
  };

  // Open Update Patient modal
  const handleOpenUpdateModal = (patient) => {
    setEditMode(true);
    setSelectedPatientId(patient.id);
    setFormData({
      first_name: patient.first_name,
      last_name: patient.last_name,
      date_of_birth: patient.date_of_birth,
    });
    setOpen(true);
  };

  // Close modal
  const handleClose = () => {
    setOpen(false);
    setSelectedPatientId(null);
  };

  // Submit Add or Update form
  const handleSubmit = async () => {
    if (editMode) {
      await updatePatient(selectedPatientId, formData);
    } else {
      await createPatient(formData);
    }
    const updatedPatients = await getPatients();
    setPatients(updatedPatients);
    handleClose();
  };

  return (
    <Container>
      {/* Top Bar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">
          HeartTrack
        </Typography>
        <Box>
          <CircularButton onClick={handleOpenAddModal} title="Add Patient">
            <PersonAddIcon />
          </CircularButton>
          <HomeButton />
          <LogoutButton />
        </Box>
      </Box>

      {/* Welcome Section */}
      <Box mb={4}>
        <Typography variant="h6">Welcome</Typography>
        <Typography variant="h4" fontWeight="bold">
          Dr. {user.last_name}
        </Typography>
      </Box>

      {/* Patients Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient) => (
              <TableRow
                key={patient.id}
                onClick={() => navigate(`/patients/${patient.id}`)} // Navigate to details
                style={{ cursor: 'pointer' }}
              >
                <TableCell>{patient.first_name}</TableCell>
                <TableCell>{patient.last_name}</TableCell>
                <TableCell>{patient.date_of_birth}</TableCell>
                <TableCell>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenUpdateModal(patient);
                    }}
                    color="primary"
                  >
                    Update
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(patient.id);
                    }}
                    color="error"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Update Patient Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? 'Update Patient' : 'Add Patient'}</DialogTitle>
        <DialogContent>
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
          <TextField
            label="Date of Birth"
            type="date"
            fullWidth
            margin="dense"
            value={formData.date_of_birth}
            onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {editMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DoctorDashboard;
