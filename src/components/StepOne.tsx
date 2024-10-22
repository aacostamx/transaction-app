// StepOne.tsx
import React from 'react';
import { Grid, TextField, MenuItem, FormControlLabel, Switch } from '@mui/material';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { Transaction } from '../types/Transaction';

interface StepProps {
  control: Control<Transaction>;
  errors: FieldErrors<Transaction>;
}

const StepOne: React.FC<StepProps> = ({ control, errors }) => (
  <Grid container spacing={2}>
    {/* TextField Input */}
    <Grid item xs={12} sm={6}>
      <Controller
        name="transactionId"
        control={control}
        defaultValue=""
        rules={{ required: 'Transaction ID is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Transaction ID"
            error={!!errors.transactionId}
            helperText={errors.transactionId ? errors.transactionId.message : ''}
          />
        )}
      />
    </Grid>
    {/* Select Input */}
    <Grid item xs={12} sm={6}>
      <Controller
        name="transactionType"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            select
            fullWidth
            label="Transaction Type"
          >
            <MenuItem value="Credit">Credit</MenuItem>
            <MenuItem value="Debit">Debit</MenuItem>
          </TextField>
        )}
      />
    </Grid>
    {/* Date Input */}
    <Grid item xs={12} sm={6}>
      <Controller
        name="date"
        control={control}
        defaultValue=""
        rules={{ required: 'Date is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            error={!!errors.date}
            helperText={errors.date ? errors.date.message : ''}
          />
        )}
      />
    </Grid>
    {/* Number Input */}
    <Grid item xs={12} sm={6}>
      <Controller
        name="amount"
        control={control}
        // defaultValue=""
        rules={{ required: 'Amount is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Amount"
            type="number"
            error={!!errors.amount}
            helperText={errors.amount ? errors.amount.message : ''}
          />
        )}
      />
    </Grid>
    {/* Switch Input */}
    <Grid item xs={12} sm={6}>
      <Controller
        name="isRecurring"
        control={control}
        defaultValue={false}
        render={({ field }) => (
          <FormControlLabel
            control={<Switch {...field} color="primary" checked={field.value} />}
            label="Is Recurring?"
          />
        )}
      />
    </Grid>
    {/* ... Add additional inputs to reach 24 inputs */}
  </Grid>
);

export default StepOne;
