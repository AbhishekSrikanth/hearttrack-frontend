import apiClient from './apiClient';

// Get the list of patients for the logged-in doctor
export const getPatients = async () => {
  const response = await apiClient.get('/patients/');
  return response.data;
};

// Create a new patient
export const createPatient = async (patientData) => {
  const response = await apiClient.post('/patients/', patientData);
  return response.data;
};

// Update an existing patient
export const updatePatient = async (id, patientData) => {
  const response = await apiClient.put(`/patients/${id}/`, patientData);
  return response.data;
};

// Delete a patient
export const deletePatient = async (id) => {
  const response = await apiClient.delete(`/patients/${id}/`);
  return response.status;
};
