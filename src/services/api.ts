import axios from 'axios';
import { Transaction } from '../types/Transaction';

const api = axios.create({
  baseURL: 'https://localhost:7039/api',
});

export const getTransactions = async (
  searchQuery: string
): Promise<{ data: Transaction[] }> => {
  const response = await api.get('/Transactions', {
    params: {
      searchQuery,
    },
  });

  return { data: response.data };
};

export const updateTransaction = async (transaction: Transaction) => {
  await api.put(`/Transactions/${transaction.id}`, transaction);
};

export const createTransaction = async (transaction: Transaction) => {
  await api.post('/Transactions', transaction);
};
