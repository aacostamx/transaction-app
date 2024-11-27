// CompensationFields.tsx

import React from "react";
import {
  Grid,
  TextField,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";

const CompensationFields: React.FC = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const compensationTypes = ["Bonus", "Commission", "Salary"];

  return (
    <Grid container spacing={2}>
      <Controller
        name="id"
        control={control}
        render={({ field }) => <input type="hidden" {...field} />}
      />
      <Grid item xs={12}>
        <Controller
          name="compensationAmount"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Compensation Amount"
              type="number"
              fullWidth
              variant="outlined"
              error={!!errors.compensationAmount}
            />
          )}
        />
      </Grid>
      {/* Compensation Type */}
      <Grid item xs={12}>
        <Controller
          name="compensationType"
          control={control}
          render={({ field }) => (
            <FormControl
              fullWidth
              variant="outlined"
              error={!!errors.compensationType}
            >
              <InputLabel>Compensation Type</InputLabel>
              <Select {...field} label="Compensation Type">
                {compensationTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>
      {/* Is Active */}
      <Grid item xs={12}>
        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Switch {...field} checked={field.value} />}
              label="Is Active"
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default CompensationFields;
