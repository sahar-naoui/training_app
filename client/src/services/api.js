import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Formations
export const getFormations = async (params = {}) => {
  const response = await api.get('/formations', { params });
  return response.data;
};

export const getFeaturedFormations = async () => {
  const response = await api.get('/formations/featured');
  return response.data;
};

export const getFormationBySlug = async (slug) => {
  const response = await api.get(`/formations/${slug}`);
  return response.data;
};

export const getLevels = async () => {
  const response = await api.get('/formations/levels');
  return response.data;
};

// Contact
export const sendContact = async (data) => {
  const response = await api.post('/contact', data);
  return response.data;
};

// Inscriptions
export const sendInscription = async (data) => {
  const response = await api.post('/inscriptions', data);
  return response.data;
};

export default api;
