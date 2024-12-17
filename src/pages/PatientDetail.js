import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPatients } from '../api/patients';
import { createPrediction, deletePrediction } from '../api/predictions';
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

import LogoutButton from '../components/LogoutButton';
import HomeButton from '../components/HomeButton'; 

const PatientDetail = () => {
  const { id } = useParams(); // Get patient ID from URL
  const [patient, setPatient] = useState({});
  const [file, setFile] = useState(null);
  

  useEffect(() => {
    const fetchPatientData = async () => {
      const patients = await getPatients();
      const currentPatient = patients.find((p) => p.id === parseInt(id));
      setPatient(currentPatient);
    };

    fetchPatientData();
  }, [id]);

  const handleFileUpload = async () => {
    if (file) {
      await createPrediction(id, file);
      const patients = await getPatients(); // Refresh data
      const updatedPatient = patients.find((p) => p.id === parseInt(id));
      setPatient(updatedPatient);
      setFile(null);
    }
  };

  const handleDeletePrediction = async (predictionId) => {
    await deletePrediction(predictionId);
    const patients = await getPatients(); // Refresh data
    const updatedPatient = patients.find((p) => p.id === parseInt(id));
    setPatient(updatedPatient);
  };

  return (
    <div>
      <h1>
        Patient: {patient.first_name} {patient.last_name}
      </h1>
      <p>Date of Birth: {patient.date_of_birth}</p>
      <HomeButton />
      <LogoutButton />
      <h2>Upload ECG Image</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <Button onClick={handleFileUpload} variant="contained" color="primary" disabled={!file}>
        Upload and Predict
      </Button>

      <h2>Predictions</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ECG Image</TableCell>
            <TableCell>Prediction Class</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patient.predictions?.map((prediction) => (
            <TableRow key={prediction.id}>
              <TableCell>
                <img src={prediction.ecg_image} alt="ECG" width="100" />
              </TableCell>
              <TableCell>{prediction.prediction_result}</TableCell>
              <TableCell>
                <Button
                  onClick={() => handleDeletePrediction(prediction.id)}
                  color="error"
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PatientDetail;
