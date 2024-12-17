import React, { useEffect, useState } from 'react';
import { getPatients, deletePatient, updatePatient } from '../api/patients';
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
} from '@mui/material';

import LogoutButton from '../components/LogoutButton';

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [open, setOpen] = useState(false); // Modal visibility
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
  });
  const [selectedPatientId, setSelectedPatientId] = useState(null); // ID of the patient to update
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // Fetch patients on component load
  useEffect(() => {
    const fetchPatients = async () => {
      const data = await getPatients();
      setPatients(data);
    };
    fetchPatients();
  }, []);

  // Delete a patient
  const handleDelete = async (id) => {
    await deletePatient(id);
    setPatients((prev) => prev.filter((patient) => patient.id !== id));
  };

  // Open the update modal and pre-fill patient data
  const handleOpenUpdateModal = (patient) => {
    setSelectedPatientId(patient.id);
    setFormData({
      first_name: patient.first_name,
      last_name: patient.last_name,
      date_of_birth: patient.date_of_birth,
    });
    setOpen(true);
  };

  // Close the modal
  const handleClose = () => {
    setOpen(false);
    setSelectedPatientId(null);
  };

  // Handle updating a patient
  const handleUpdate = async () => {
    await updatePatient(selectedPatientId, formData);
    const updatedPatients = await getPatients();
    setPatients(updatedPatients);
    handleClose();
  };

  return (
    <div>
      <h1>Doctor Dashboard</h1>
      <h2>Welcome Dr. {user.last_name}!</h2>
      <LogoutButton />
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
              onClick={() => navigate(`/patients/${patient.id}`)} // Navigate to detail page
              style={{ cursor: 'pointer' }}
            >
              <TableCell>{patient.first_name}</TableCell>
              <TableCell>{patient.last_name}</TableCell>
              <TableCell>{patient.date_of_birth}</TableCell>
              <TableCell>
                <Button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent row click navigation
                    handleOpenUpdateModal(patient);
                  }}
                  color="primary"
                >
                  Update
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent row click navigation
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

      {/* Update Patient Modal */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update Patient</DialogTitle>
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DoctorDashboard;
