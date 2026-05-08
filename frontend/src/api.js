import axios from 'axios';

const api = axios.create({
  baseURL: 'https://internship-portal-egbg.onrender.com',
});

export default api;