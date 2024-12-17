import apiClient from './apiClient';

// Get ECG predictions for a specific patient
export const getPatientPredictions = async (patientId) => {
  const response = await apiClient.get(`/predictions/?patient=${patientId}`);
  return response.data;
};

// Create a new ECG prediction (classification)
export const createPrediction = async (patientId, ecgImage) => {
  const formData = new FormData();
  formData.append('patient', patientId);
  formData.append('ecg_image', ecgImage);

  const response = await apiClient.post('/predictions/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deletePrediction = async (id) => {
    const response = await apiClient.delete(`/predictions/${id}/`);
    return response.status;
  };
