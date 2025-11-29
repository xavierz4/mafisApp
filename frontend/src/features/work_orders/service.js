import api from '../../lib/axios';

export const getUsers = async (role = null) => {
  const params = role ? { role } : {};
  const response = await api.get('/users', { params });
  return response.data;
};

export const createWorkOrder = async (data) => {
  const response = await api.post('/work-orders', data);
  return response.data;
};

export const getWorkOrders = async (status = null) => {
  const params = status ? { status } : {};
  const response = await api.get('/work-orders', { params });
  return response.data;
};

export const updateWorkOrderStatus = async (id, status) => {
  const response = await api.patch(`/work-orders/${id}/status`, { status });
  return response.data;
};
