import React, { useState, useEffect } from 'react';
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

interface Props {
  transaction: Transaction;
  onCancel: () => void;
  onSuccess: () => void;
}

const steps = [
  { label: 'Basic Details' },
  { label: 'Account Information' },
  { label: 'Transaction Details' },
];

const EditTransaction: React.FC<Props> = ({
  transaction,
  onCancel,
  onSuccess,
}) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
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

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const validateForm = () => {
    if (!formData.date || !formData.amount || !formData.originAccount || !formData.status) {
      setError('Please fill all required fields.');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSuccess();
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Transaction ID"
                name="transactionId"
                value={formData.transactionId || ''}
                onChange={handleChange}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Date"
                name="date"
                type="date"
                value={formData.date || ''}
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
                value={formData.amount || ''}
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
                label="Origin Account"
                name="originAccount"
                value={formData.originAccount || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Destination Account"
                name="destinationAccount"
                value={formData.destinationAccount || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Currency"
                name="currency"
                value={formData.currency || ''}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Status"
                name="status"
                value={formData.status || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Category"
                name="category"
                value={formData.category || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Type"
                name="type"
                value={formData.type || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                multiline
                rows={3}
              />
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
        p: 0, // Remove extra padding
        m: 0, // Remove extra margin
      }}
    >
      <Paper elevation={3} sx={{ padding: 3, maxWidth: 500, width: '100%' }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Edit Transaction
        </Typography>
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
        <Box>
          {renderStepContent(activeStep)}

          {/* Stepper */}
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
        </Box>

        {/* Save and Cancel Buttons */}
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Save
          </Button>
          <Button onClick={onCancel} sx={{ ml: 2 }}>
            Cancel
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditTransaction;
