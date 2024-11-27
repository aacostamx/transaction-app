// ChannelFields.tsx

import React from 'react';
import { Grid, TextField, FormControlLabel, Switch } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';

const ChannelFields: React.FC = () => {
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
          name="channelName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Channel Name"
              fullWidth
              variant="outlined"
              error={!!errors.channelName}
            />
          )}
        />
      </Grid>
      {/* Description */}
      <Grid item xs={12}>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Description"
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              error={!!errors.description}
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

export default ChannelFields;
