import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MobileStepper,
} from "@mui/material";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { Transaction } from "../types/Transaction";

interface TransactionFormDialogProps {
  model: Transaction;
  open: boolean; // Controls the dialog open/close state
  onCancel: () => void; // Triggered when cancel button is clicked
  onSuccess: (data: Transaction) => void; // Triggered when form is successfully submitted
}

const TransactionFormDialog: React.FC<TransactionFormDialogProps> = ({
  model,
  open,
  onCancel,
  onSuccess,
}) => {
  const { control, handleSubmit, reset } = useForm<Transaction>({
    defaultValues: model, // Default values for the form are provided from the model
  });

  const [activeStep, setActiveStep] = useState(0); // Track the active step
  const fieldsPerPage = 8; // Number of fields per step

  const inputKeys = Object.keys(model); // Get the list of input field keys from the model
  const steps = Math.ceil(inputKeys.length / fieldsPerPage); // Determine how many steps we need

  const handleNext = () => setActiveStep((prevStep) => prevStep + 1); // Move to the next step
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1); // Move to the previous step

  // Reset form values whenever model or open state changes
  useEffect(() => {
    if (open) {
      reset(model); // Reset form to the current model values
      setActiveStep(0); // Reset to the first step
    }
  }, [model, open, reset]);

  // Function to handle form submission
  const onSubmit = (data: Transaction) => {
    console.log("Form Data Submitted:", data);
    onSuccess(data); // Call the onSuccess function for further processing (e.g., sending via Axios)
  };

  const fieldsForStep = inputKeys.slice(
    activeStep * fieldsPerPage,
    activeStep * fieldsPerPage + fieldsPerPage
  ); // Determine the fields to show for the current step

  // Render the inputs dynamically based on the model
  const renderInput = (key: string, value: any) => {
    if (typeof value === "string" && key === "date") {
      return (
        <Controller
          key={key}
          name={key as keyof Transaction}
          control={control}
          render={({ field }) => (
            <DatePicker
              {...field}
              label={key}
              value={field.value ? dayjs(field.value as string) : null}
              onChange={(date: Dayjs | null) => {
                field.onChange(date ? date.format("YYYY-MM-DD") : undefined);
              }}
              slots={{ textField: TextField }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "normal",
                  variant: "outlined",
                },
              }}
            />
          )}
        />
      );
    }

    if (typeof value === "string" && key === "createdDate") {
      return (
        <Controller
          key={key}
          name={key as keyof Transaction}
          control={control}
          render={({ field }) => (
            <DateTimePicker
              {...field}
              label={key}
              value={field.value ? dayjs(field.value as string) : null}
              onChange={(date: Dayjs | null) => {
                field.onChange(
                  date ? date.format("YYYY-MM-DDTHH:mm") : undefined
                );
              }}
              slots={{ textField: TextField }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "normal",
                  variant: "outlined",
                },
              }}
            />
          )}
        />
      );
    }

    if (
      key === "transactionType" ||
      key === "status" ||
      key === "currency" ||
      key === "type" ||
      key === "category"
    ) {
      const options = {
        transactionType: ["Online", "Offline", "Bank Transfer", "Credit Card"],
        status: ["Completed", "Pending", "Failed"],
        currency: ["USD", "EUR", "GBP"],
        type: ["Credit", "Debit"],
        category: ["Invoice", "Payment", "Subscription"],
      };

      return (
        <Controller
          key={key}
          name={key as keyof Transaction}
          control={control}
          render={({ field }) => (
            <FormControl fullWidth margin="normal">
              <InputLabel>{key}</InputLabel>
              <Select {...field} label={key}>
                {options[key as keyof typeof options].map((option: string) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      );
    }

    if (typeof value === "boolean") {
      return (
        <Controller
          key={key}
          name={key as keyof Transaction}
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Switch {...field} checked={!!field.value} />}
              label={key}
            />
          )}
        />
      );
    }

    if (typeof value === "string" || typeof value === "number") {
      return (
        <Controller
          key={key}
          name={key as keyof Transaction}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={key}
              fullWidth
              margin="normal"
              variant="outlined"
              type={typeof value === "number" ? "number" : "text"}
            />
          )}
        />
      );
    }

    return null;
  };

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="md">
      <DialogTitle>Transaction Form</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {/* Render the fields for the current step */}
          <Grid container spacing={2}>
            {fieldsForStep.map((key) => (
              <Grid item xs={12} sm={6} key={key}>
                {renderInput(key, model[key as keyof Transaction])}
              </Grid>
            ))}
          </Grid>

          {/* MobileStepper for navigation */}
          <MobileStepper
            variant="dots"
            steps={steps}
            position="static"
            activeStep={activeStep}
            sx={{ mt: 2 }}
            nextButton={
              <Button
                size="small"
                onClick={handleNext}
                disabled={activeStep === steps - 1}
              >
                Next
                <KeyboardArrowRight />
              </Button>
            }
            backButton={
              <Button
                size="small"
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                <KeyboardArrowLeft />
                Back
              </Button>
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TransactionFormDialog;
