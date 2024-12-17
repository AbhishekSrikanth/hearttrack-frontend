import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPatients } from '../api/patients';
import { createPrediction, deletePrediction } from '../api/predictions';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import CircularProgress from '@mui/material/CircularProgress';

import HomeButton from '../components/HomeButton';
import LogoutButton from '../components/LogoutButton';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/HighlightOff';
import CakeIcon from '@mui/icons-material/Cake';

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
});

// Styled circular indigo button
const CircularButton = styled(IconButton)({
  borderRadius: '50%',
  width: '50px',
  height: '50px',
  backgroundColor: '#3f51b5', // Indigo color
  color: '#fff',
  '&:hover': {
    backgroundColor: '#303f9f', // Darker indigo on hover
  },
  boxShadow: '0px 3px 5px rgba(0,0,0,0.2)',
});

// Prediction Class Mapping
const CLASSES = {
  N: 'Normal',
  S: 'Supraventricular',
  V: 'Ventricular',
  F: 'Fusion',
  Q: 'Unknown',
};

const PatientDetail = () => {
  const { id } = useParams(); // Get patient ID from URL
  const [patient, setPatient] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch patient data
  useEffect(() => {
    const fetchPatientData = async () => {
      const patients = await getPatients();
      const currentPatient = patients.find((p) => p.id === parseInt(id));
      setPatient(currentPatient);
    };
    fetchPatientData();
  }, [id]);

  // File upload handler
  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setLoading(true);
      await createPrediction(id, uploadedFile);
      const patients = await getPatients();
      const updatedPatient = patients.find((p) => p.id === parseInt(id));
      setPatient(updatedPatient);
      setLoading(false);
    }
  };

  // Handle delete prediction
  const handleDeletePrediction = async (predictionId) => {
    await deletePrediction(predictionId);
    const patients = await getPatients();
    const updatedPatient = patients.find((p) => p.id === parseInt(id));
    setPatient(updatedPatient);
  };

  return (
    <Container>
      {/* Top Bar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">
          HeartTrack
        </Typography>
        <Box>
          <CircularButton component="label">
            <input type="file" hidden onChange={handleFileUpload} />
            <AddPhotoAlternateIcon />
          </CircularButton>
          <HomeButton />
          <LogoutButton />
        </Box>
      </Box>

      {/* Patient Details */}
      <Box mb={4}>
        <Typography variant="h6" fontWeight="bold">
          Patient
        </Typography>
        <Typography variant="h4" fontWeight="bold">
          {patient.first_name} {patient.last_name}
        </Typography>
          <Typography variant="h6"><CakeIcon />  {patient.date_of_birth}</Typography>
      </Box>

      {/* Predictions Table */}
      <TableContainer>
        <Typography variant="h6" fontWeight="bold" color="#333" mb={2}>
          ECG Predictions
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Created At</strong></TableCell>
              <TableCell><strong>Prediction</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patient.predictions?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((prediction) => (
              <TableRow key={prediction.id}>
                <TableCell>{new Date(prediction.created_at).toLocaleString()}</TableCell>
                <TableCell>{CLASSES[prediction.prediction_result] || 'Unknown'}</TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => handleDeletePrediction(prediction.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {loading && <CircularProgress />}
      </TableContainer>
    </Container>
  );
};

export default PatientDetail;
