import axios from 'axios';
import { SCAN_URL } from './constant.js'

export const getTransactionDetail = async (hash) => {
  try {
    const response = await axios.get(`${SCAN_URL}/api/transaction/${hash}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    throw error;
  }
};
