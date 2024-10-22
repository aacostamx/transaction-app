// StepThree.tsx
import React from 'react';
import { Grid, TextField, FormControlLabel, Switch } from '@mui/material';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { Transaction } from '../types/Transaction';

interface StepProps {
    control: Control<Transaction>;
    errors: FieldErrors<Transaction>;
  }

const StepThree: React.FC<StepProps> = ({ control, errors }) => (
  <Grid container spacing={2}>
    {/* Repeat this block for 24 inputs */}
    <Grid item xs={12} sm={6}>
      <Controller
        name="description"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Description"
            multiline
            rows={3}
          />
        )}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <Controller
        name="isActive"
        control={control}
        defaultValue={false}
        render={({ field }) => (
          <FormControlLabel
            control={<Switch {...field} color="primary" checked={field.value} />}
            label="Active"
          />
        )}
      />
    </Grid>
    {/* ... Add 22 more inputs with different types */}
  </Grid>
);

export default StepThree;
