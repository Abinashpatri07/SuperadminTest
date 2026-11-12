import { API_BASE_URL } from "./config.js";
import axios from "axios";


export const uploadOCR = async (file, docType) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("docType", docType);

  try {
    const response = await axios.post(`${API_BASE_URL}/api/ocr/extract`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("OCR Universal API Error:", error);
    throw error;
  }
};

export const generateAadhaarOtp = async (aadhaarNumber) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/ocr/aadhaar/generate-otp`, {
      aadhaarNumber
    });
    return response.data;
  } catch (error) {
    console.error("Aadhaar Generate OTP Error:", error);
    throw error;
  }
};

export const verifyAadhaarOtp = async (otp, taskId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/ocr/aadhaar/verify-otp`, {
      otp,
      taskId
    });
    return response.data;
  } catch (error) {
    console.error("Aadhaar Verify OTP Error:", error);
    throw error;
  }
};

export const pollTaskStatus = async (request_id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/ocr/status/${request_id}`
    );
    return response.data;
  } catch (error) {
    console.error("Polling Error:", error);
    throw error;
  }
};

// ============================================
// CANDIDATE SUBMISSION APIs
// ============================================

export const submitCandidateIdDocuments = async (payload) => {
  try {
    const token = localStorage.getItem("candidateToken") || localStorage.getItem("accessToken");
    const config = {};
    if (token) {
      config.headers = { Authorization: `Bearer ${token}` };
    }
    const response = await axios.post(`${API_BASE_URL}/api/candidate/submit/id-documents`, payload, config);
    return response.data;
  } catch (error) {
    console.error("Submit ID docs error:", error);
    throw error.response?.data || { error: error.message || "Failed to submit documents" };
  }
};

export const verifyPanSource = async (panNumber, fullName, dob) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/ocr/verify-pan`, {
      panNumber,
      fullName,
      dob
    });
    return response.data;
  } catch (error) {
    console.error("PAN Verification Error:", error);
    throw error;
  }
};

export const verifyDlSource = async (dlNumber, dob) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/ocr/verify-dl`, {
      dlNumber, dob
    });
    return response.data;
  } catch (error) {
    console.error("DL Verification Error:", error);
    throw error;
  }
};

export const verifyVoterSource = async (epicNumber) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/ocr/verify-voter`, {
      epicNumber
    });
    return response.data;
  } catch (error) {
    console.error("Voter ID Verification Error:", error);
    throw error;
  }
};

export const verifyPassportSource = async (fileNumber, dob, name) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/ocr/verify-passport`, {
      fileNumber, dob, name
    });
    return response.data;
  } catch (error) {
    console.error("Passport Verification Error:", error);
    throw error;
  }
};
