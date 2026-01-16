import api from '../config/axios';
import { OrderState } from '../types';

export const submitOrder = async (orderData: OrderState) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};
