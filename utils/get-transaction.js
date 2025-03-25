import axios from 'axios';

export const getTransactionDetail = async (hash) => {
  try {
    const response = await axios.get(`https://www.vicscan.xyz/api/transaction/${hash}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    throw error;
  }
};
