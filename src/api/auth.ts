import api from '../config/axios';

export const sendOtp = async (phone: string) => {
  const response = await api.post('/auth/send-otp', { phone });
  return response.data;
};

export const verifyOtp = async (phone: string, otp: string) => {
  const response = await api.post('/auth/login', { phone, otp });
  return response.data;
};
