import apiClient from './apiClient';

// Get the list of all doctors
export const getDoctors = async () => {
  const response = await apiClient.get('/users/');
  return response.data; // List of users
};

// Create a new doctor
export const createDoctor = async (doctorData) => {
  const response = await apiClient.post('/users/create/', doctorData);
  return response.data;
};

// Update an existing doctor
export const updateDoctor = async (id, doctorData) => {
  const response = await apiClient.put(`/users/${id}/`, doctorData);
  return response.data;
};

// Delete a doctor
export const deleteDoctor = async (id) => {
  const response = await apiClient.delete(`/users/${id}/`);
  return response.status; // 204 for success
};
