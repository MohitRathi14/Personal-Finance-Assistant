import axiosClient from './axiosClient';

export const userService = {
  getUserProfile: async () => {
    const response = await axiosClient.get('/users/profile');
    return response.data;
  },

  updateUserProfile: async (userData) => {
    const response = await axiosClient.put('/users/profile', userData);
    return response.data;
  },

  getAllUsers: async () => {
    const response = await axiosClient.get('/users');
    return response.data;
  },

  getSingleUser: async (id) => {
    const response = await axiosClient.get(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await axiosClient.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await axiosClient.delete(`/users/${id}`);
    return response.data;
  },
};