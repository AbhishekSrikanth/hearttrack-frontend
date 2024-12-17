import apiClient from './apiClient';

export const login = async (username, password) => {
    try {
      const response = await apiClient.post('/users/login/', { username, password });
      return response;  // Returns the full response (including user data)
    } catch (error) {
      throw error;  // Propagate the error to be caught in LoginPage
    }
  };

export const logout = async () => {
  return apiClient.post('/users/logout/');
};
