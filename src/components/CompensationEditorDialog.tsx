import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { Compensation } from "../types/Compensation";
import { yupResolver } from "@hookform/resolvers/yup";
import { compensationValidationSchema } from "../validationSchemas";

interface CompensationEditorDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Compensation) => void;
  initialData: Compensation | null;
}

const CompensationEditorDialog: React.FC<CompensationEditorDialogProps> = ({
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
  } = useForm<Compensation>({
    defaultValues: initialData || {
      id: 0,
      compensationAmount: 0,
      compensationType: "",
      isActive: true,
    },
    resolver: yupResolver(compensationValidationSchema),
  });

  useEffect(() => {
    if (open) {
      reset(
        initialData || {
          id: 0,
          compensationAmount: 0,
          compensationType: "",
          isActive: true,
        }
      );
    }
  }, [open, initialData, reset]);

  const onSubmit = (data: Compensation) => {
    onSave(data);
  };

  // Options for compensation types
  const compensationTypes = ["Bonus", "Commission", "Salary"];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {initialData ? "Edit Compensation" : "Add Compensation"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Compensation Amount */}
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
                    helperText={errors.compensationAmount?.message}
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
                    <Select
                      {...field}
                      label="Compensation Type"
                      value={field.value || ""}
                    >
                      {compensationTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.compensationType && (
                      <Typography variant="caption" color="error">
                        {errors.compensationType.message}
                      </Typography>
                    )}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Save Compensation
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CompensationEditorDialog;
