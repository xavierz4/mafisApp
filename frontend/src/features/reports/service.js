import api from '../../lib/axios';

export const getReports = async () => {
  const response = await api.get('/reports');
  return response.data;
};

export const getReport = async (id) => {
  const response = await api.get(`/reports/${id}`);
  return response.data;
};

export const createReport = async (reportData) => {
  const response = await api.post('/reports', reportData);
  return response.data;
};

export const updateReportStatus = async (id, status) => {
  const response = await api.put(`/reports/${id}/status`, { status });
  return response.data;
};
