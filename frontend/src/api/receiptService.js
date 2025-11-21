import axiosClient from './axiosClient';

export const receiptService = {
  uploadReceipt: async (file) => {
    const formData = new FormData();
    formData.append('receipt', file);
    
    const response = await axiosClient.post('/receipts/extract-receipt', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getReceiptHistory: async () => {
    const response = await axiosClient.get('/receipts/history');
    return response.data;
  },
};