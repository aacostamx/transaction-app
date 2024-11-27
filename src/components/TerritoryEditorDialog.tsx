import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { Territory } from '../types/Territory';
import { yupResolver } from '@hookform/resolvers/yup';
import { territoryValidationSchema } from '../validationSchemas';

interface TerritoryEditorDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Territory) => void;
  initialData: Territory | null;
}

const TerritoryEditorDialog: React.FC<TerritoryEditorDialogProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Territory>({
    defaultValues: initialData || {
      id: 0,
      territoryName: '',
      region: '',
      isActive: true,
    },
    resolver: yupResolver(territoryValidationSchema),
  });

  useEffect(() => {
    if (open) {
      reset(initialData || {
        id: 0,
        territoryName: '',
        region: '',
        isActive: true,
      });
    }
  }, [open, initialData, reset]);

  const onSubmit = (data: Territory) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData ? 'Edit Territory' : 'Add Territory'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Territory Name */}
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
                    helperText={errors.territoryName?.message}
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
                    helperText={errors.region?.message}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            Save Territory
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TerritoryEditorDialog;
