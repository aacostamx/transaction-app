import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  MobileStepper,
} from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { useTheme } from '@mui/material/styles';
import { Transaction } from '../types/Transaction';
import { createTransaction } from '../services/api';

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
}

const steps = [
  { label: 'Basic Details' },
  { label: 'Transaction Information' },
  { label: 'Additional Information' },
];

const AddTransaction: React.FC<Props> = ({ onCancel, onSuccess }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<Transaction>({
    id: 0,
    transactionId: '',
    date: '',
    amount: 0,
    status: '',
    createdDate: '',
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

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const validateForm = () => {
    if (!formData.date || !formData.amount || !formData.status) {
      setError('Please fill in all required fields.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
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
    }
  };

  const generateTransactionId = () => {
    return `tx-${Math.random().toString(36).substr(2, 9)}`;
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {/* Placeholder for additional future fields */}
              <Typography variant="body1">Additional information can go here.</Typography>
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Paper elevation={3} sx={{ padding: 3, maxWidth: 500, width: '100%' }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Add Transaction
        </Typography>
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

        {/* Step Content */}
        {renderStepContent(activeStep)}

        {/* Stepper for navigation */}
        <MobileStepper
          variant="dots"
          steps={steps.length}
          position="static"
          activeStep={activeStep}
          sx={{ mt: 2 }}
          nextButton={
            <Button size="small" onClick={handleNext} disabled={activeStep === steps.length - 1}>
              Next
              {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </Button>
          }
          backButton={
            <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
              {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
              Back
            </Button>
          }
        />

        {/* Save and Cancel Buttons */}
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Create
          </Button>
          <Button onClick={onCancel} sx={{ ml: 2 }}>
            Cancel
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddTransaction;
