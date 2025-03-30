import axios from 'axios';
import { SCAN_URL } from './constant.js';

export const getTokens = async (hash) => {
  try {
    const response = await axios.get(`${SCAN_URL}/api/token/list?offset=0&limit=20`);
    return response?.data?.data;
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    return null
  }
};
