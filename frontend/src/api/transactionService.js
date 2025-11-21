import axiosClient from './axiosClient';

export const transactionService = {
  createTransaction: async (transactionData) => {
    const response = await axiosClient.post('/payments/add-transaction', transactionData);
    return response.data;
  },

  getUserTransactions: async () => {
    const response = await axiosClient.get('/payments/user-transactions');
    return response.data;
  },

  getAllTransactions: async () => {
    const response = await axiosClient.get('/payments/all-transactions');
    return response.data;
  },

  editTransaction: async (id, transactionData) => {
    const response = await axiosClient.put(`/payments/edit-transaction/${id}`, transactionData);
    return response.data;
  },

  deleteTransaction: async (id) => {
    const response = await axiosClient.delete(`/payments/delete-transaction/${id}`);
    return response.data;
  },

  verifyTransaction: async (id) => {
    const response = await axiosClient.post(`/payments/verify-transaction/${id}`);
    return response.data;
  },

  filterByDate: async (startDate, endDate) => {
    const response = await axiosClient.post('/payments/filter-by-date', { startDate, endDate });
    return response.data;
  },

  getCategorySummary: async () => {
    const response = await axiosClient.get('/payments/category-summary');
    return response.data;
  },

  getGraphData: async () => {
    const response = await axiosClient.get('/payments/graph-data');
    return response.data;
  },
};