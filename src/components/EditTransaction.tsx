import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import { Transaction } from '../types/Transaction';
import { updateTransaction } from '../services/api';

interface Props {
  transaction: Transaction;
  onCancel: () => void;
  onSuccess: () => void;
}

const EditTransaction: React.FC<Props> = ({
  transaction,
  onCancel,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<Transaction>(transaction);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setFormData(transaction);
  }, [transaction]);

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
        await updateTransaction(formData);
        onSuccess();
      } catch (err) {
        setError('Error updating transaction.');
      }
    } else {
      setError('Please fill in all required fields.');
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Edit Transaction
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box display="flex" flexDirection="column" maxWidth={400}>
        <TextField
          margin="dense"
          label="ID"
          name="id"
          value={formData.id}
          disabled
        />
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
            Update
          </Button>
          <Button onClick={onCancel} style={{ marginLeft: '8px' }}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EditTransaction;
