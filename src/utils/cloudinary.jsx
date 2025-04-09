import axios from "axios";
import { db } from "../config/firebaseConfig"; // Adjust according to your Firebase setup
import crypto from "crypto";

// Environment variables configuration
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ;
const API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY ;
const API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET ; 

const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;
const CLOUDINARY_DELETE_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`;

// File upload function
export const uploadFileToCloudinary = async (file) => {
  try {
    const validation = validateFile(file, {
      maxSizeMB: 15,
      allowedTypes: ["image/*", "application/pdf", "text/plain"]
    });
    
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", "unihub_resources");
    
    const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 60000,
    });

    if (!response.data?.secure_url) {
      throw new Error("Invalid Cloudinary response structure");
    }

    return response.data.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", {
      fileName: file?.name,
      status: error.response?.status,
      errorData: error.response?.data,
      message: error.message
    });
    
    throw new Error(
      error.response?.data?.error?.message || 
      `Upload failed: ${error.message}`
    );
  }
};

// Enhanced validation helper
export const validateFile = (file, options = {}) => {
  const { 
    maxSizeMB = 10,
    allowedTypes = ["image/*", "application/pdf", "text/plain"]
  } = options;

  if (!file || !(file instanceof File)) {
    return { valid: false, error: "Invalid file object" };
  }

  const fileExt = file.name.split('.').pop().toLowerCase();
  const mimeType = file.type.toLowerCase();
  
  const isTypeValid = allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      return mimeType.startsWith(type.split('/')[0] + '/');
    }
    return mimeType === type || `.${fileExt}` === type;
  });

  if (!isTypeValid) {
    return {
      valid: false,
      error: `Unsupported file type. Allowed: ${allowedTypes.join(', ')}` 
    };
  }

  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `File exceeds size limit (max ${maxSizeMB}MB)`
    };
  }

  return { valid: true };
};

// Cloudinary file deletion

