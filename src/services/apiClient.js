import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.github.com',
});

export default apiClient;
