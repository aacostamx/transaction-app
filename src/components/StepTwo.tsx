import React from 'react';
import { Grid, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { Transaction } from '../types/Transaction';

interface StepProps {
    control: Control<Transaction>;
    errors: FieldErrors<Transaction>;
  }
  
const StepTwo: React.FC<StepProps> = ({ control, errors }) => (
  <Grid container spacing={2}>
    {/* Repeat this block for 24 inputs */}
    <Grid item xs={12} sm={6}>
      <Controller
        name="status"
        control={control}
        defaultValue=""
        rules={{ required: 'Status is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Status"
            error={!!errors.status}
            helperText={errors.status ? errors.status.message : ''}
          />
        )}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <Controller
        name="currency"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <FormControl fullWidth>
            <InputLabel id="currency-label">Currency</InputLabel>
            <Select
              {...field}
              labelId="currency-label"
              label="Currency"
            >
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="EUR">EUR</MenuItem>
              <MenuItem value="GBP">GBP</MenuItem>
            </Select>
          </FormControl>
        )}
      />
    </Grid>
    {/* ... Add 22 more inputs with different types */}
  </Grid>
);

export default StepTwo;
