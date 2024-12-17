import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Get CSRF token from cookies
const getCSRFToken = () => {
    const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith('csrftoken='))
      ?.split('=')[1];
    return cookieValue;
  };

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true, // Send cookies with requests
});

apiClient.interceptors.request.use((config) => {
    const csrftoken = getCSRFToken();
    if (csrftoken) {
      config.headers['X-CSRFToken'] = csrftoken;
    }
    return config;
  });


  // Axios interceptor for error handling
apiClient.interceptors.response.use(
    response => response,  // Allow normal responses
    error => {
      if (error.response && error.response.status === 403) {
        // Redirect to login page on 403 Forbidden error
        const navigate = useNavigate(); // To navigate programmatically
        navigate('/'); // Redirect to the login page
      }
      return Promise.reject(error);
    }
  );

export default apiClient;
