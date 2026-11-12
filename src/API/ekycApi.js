import { API_BASE_URL } from "./config.js";
import axios from "axios";


export const initiateSetuEkyc = async (redirectURL) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/candidate/ekyc/initiate`, {
      redirectURL
    });
    return response.data;
  } catch (error) {
    console.error("Initiate Setu eKYC Error:", error);
    throw error;
  }
};

export const fetchSetuEkycStatus = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/candidate/ekyc/status?id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Fetch Setu eKYC Status Error:", error);
    throw error;
  }
};
