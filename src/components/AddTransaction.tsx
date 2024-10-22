import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import { Transaction } from '../types/Transaction';
import { createTransaction } from '../services/api';

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
}

const AddTransaction: React.FC<Props> = ({ onCancel, onSuccess }) => {
  const [formData, setFormData] = useState<Transaction>({
    id: 0,
    transactionId: '',
    date: '',
    amount: 0,
    status: '',
    createdDate: ''
  });

  const [error, setError] = useState<string>('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === 'amount'
          ? parseFloat(e.target.value)
          : e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (formData.date && formData.status) {
      try {
        // Set the createdDate to current timestamp if not provided
        const newTransactionData = {
          ...formData,
          createdDate: formData.createdDate || new Date().toISOString(),
          transactionId: formData.transactionId || generateTransactionId(),
        };
        await createTransaction(newTransactionData);
        onSuccess();
      } catch (err) {
        setError('Error creating transaction.');
      }
    } else {
      setError('Please fill in all required fields.');
    }
  };

  const generateTransactionId = () => {
    return `tx-${Math.random().toString(36).substr(2, 9)}`;
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Add Transaction
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box display="flex" flexDirection="column" maxWidth={400}>
        <TextField
          margin="dense"
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          margin="dense"
          label="Amount"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          required
        />
        <TextField
          margin="dense"
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        />
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Create
          </Button>
          <Button onClick={onCancel} style={{ marginLeft: '8px' }}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddTransaction;
