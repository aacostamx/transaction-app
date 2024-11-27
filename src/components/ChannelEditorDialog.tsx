import React, { useEffect } from "react";
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
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { Channel } from "../types/Channel";
import { yupResolver } from "@hookform/resolvers/yup";
import { channelValidationSchema } from "../validationSchemas";

interface ChannelEditorDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Channel) => void;
  initialData: Channel | null;
}

const ChannelEditorDialog: React.FC<ChannelEditorDialogProps> = ({
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
  } = useForm<Channel>({
    defaultValues: initialData || {
      id: 0,
      channelName: "",
      description: "",
      isActive: true,
    },
    resolver: yupResolver(channelValidationSchema),
  });

  useEffect(() => {
    if (open) {
      reset(
        initialData || {
          id: 0,
          channelName: "",
          description: "",
          isActive: true,
        }
      );
    }
  }, [open, initialData, reset]);

  const onSubmit = (data: Channel) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData ? "Edit Channel" : "Add Channel"}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Channel Name */}
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
                    helperText={errors.channelName?.message}
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
                    helperText={errors.description?.message}
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
          <Button type="submit" variant="contained" color="primary">
            Save Channel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ChannelEditorDialog;
