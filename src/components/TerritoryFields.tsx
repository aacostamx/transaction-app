// TerritoryFields.tsx

import React from "react";
import { Grid, TextField, FormControlLabel, Switch } from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";

const TerritoryFields: React.FC = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Grid container spacing={2}>
      <Controller
        name="id"
        control={control}
        render={({ field }) => <input type="hidden" {...field} />}
      />
      <Grid item xs={12}>
        <Controller
          name="territoryName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Territory Name"
              fullWidth
              variant="outlined"
              error={!!errors.territoryName}
            />
          )}
        />
      </Grid>
      {/* Region */}
      <Grid item xs={12}>
        <Controller
          name="region"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Region"
              fullWidth
              variant="outlined"
              error={!!errors.region}
            />
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

export default TerritoryFields;
