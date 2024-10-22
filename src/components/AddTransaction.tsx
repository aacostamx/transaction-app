import React from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  MobileStepper,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { useTheme } from '@mui/material/styles';
import { Transaction } from '../types/Transaction';
import { createTransaction } from '../services/api';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
}

const AddTransaction: React.FC<Props> = ({ onCancel, onSuccess }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Transaction>();

  const steps = ['Basic Details', 'Transaction Information', 'Additional Information'];

  const onSubmit = async (data: Transaction) => {
    try {
      // Submit the data to your API
      await createTransaction(data);
      onSuccess();
    } catch (error) {
      // Handle submission error
    }
  };

  // Handle step navigation
  const handleNext = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  // Render the form fields for each step
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <StepOne control={control} errors={errors} />;
      case 1:
        return <StepTwo control={control} errors={errors} />;
      case 2:
        return <StepThree control={control} errors={errors} />;
      default:
        return null;
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // minHeight: '100vh',
      }}
    >
      <Paper elevation={3} sx={{ padding: 3, maxWidth: 800, width: '100%' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Add Transaction
        </Typography>
        {renderStepContent(activeStep)}
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
          <Box sx={{ mt: 2, textAlign: 'right' }}>
            <Button type="submit" variant="contained" color="primary">
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
