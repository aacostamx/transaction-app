import React, { useEffect, useState } from "react";
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
  Tabs,
  Tab,
  Box,
  Typography,
  Badge,
  IconButton,
  Tooltip,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup"; // Import Yup
import { yupResolver } from "@hookform/resolvers/yup"; // Import yupResolver
import { Transaction } from "../types/Transaction";
import { getStatuses } from "../services/api";

// Import the nested editor dialogs
import ChannelEditorDialog from "./ChannelEditorDialog";
import TerritoryEditorDialog from "./TerritoryEditorDialog";
import CompensationEditorDialog from "./CompensationEditorDialog";

// Import icons
import EditIcon from '@mui/icons-material/Edit';

interface TransactionFormDialogProps {
  model: Transaction;
  open: boolean;
  onCancel: () => void;
  onSuccess: (data: Transaction) => void;
}

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  createdDate: Yup.string().required("Created Date is required"),
  amount: Yup.number()
    .required("Amount is required")
    .typeError("Amount must be a number"),
  status: Yup.string().required("Status is required"),
  isActive: Yup.boolean().required("Is Active is required"),
  originAccount: Yup.string().required("Origin Account is required"),
  transactionType: Yup.string().required("Transaction Type is required"),
  // Add more fields and validations as needed
});

// Helper functions to determine field types
const isDateField = (key: string) => key.toLowerCase().includes("date");
const isDropdownField = (key: string) =>
  ["status", "transactionType", "currency", "type", "category"].includes(key);
const isSwitchField = (key: string) =>
  ["isActive", "isRecurring"].includes(key);

// TabPanel component for tabs
function TabPanel(props: {
  children?: React.ReactNode;
  index: number;
  value: number;
}) {
  const { children, value, index } = props;
  return value === index ? <Box sx={{ p: 3 }}>{children}</Box> : null;
}

const TransactionFormDialog: React.FC<TransactionFormDialogProps> = ({
  model,
  open,
  onCancel,
  onSuccess,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Transaction>({
    defaultValues: model,
    resolver: yupResolver(validationSchema), // Use yupResolver
  });

  const [tabIndex, setTabIndex] = useState(0);
  const [statuses, setStatuses] = useState<{ id: number; name: string }[]>([]);
  const fieldsPerGroup = 8;

  // State for nested modals
  const [openChannelEditor, setOpenChannelEditor] = useState(false);
  const [openTerritoryEditor, setOpenTerritoryEditor] = useState(false);
  const [openCompensationEditor, setOpenCompensationEditor] = useState(false);

  // State to hold data from nested editors
  const [channelData, setChannelData] = useState<any>(null);
  const [territoryData, setTerritoryData] = useState<any>(null);
  const [compensationData, setCompensationData] = useState<any>(null);

  // Fetch statuses when the dialog opens
  useEffect(() => {
    if (open) {
      reset(model);
      getStatuses()
        .then((response) => setStatuses(response.data))
        .catch((error) => console.error("Error fetching statuses:", error));
    }
  }, [model, open, reset]);

  // Prepare input fields, excluding read-only fields if adding a new transaction
  const readOnlyFields: Array<keyof Transaction> = ["id", "transactionId"];

  const inputFields = Object.keys(model) as Array<keyof Transaction>;
  const filteredFields = inputFields.filter(
    (key) => model.id !== 0 || !readOnlyFields.includes(key)
  );

  // Group fields for tabs
  const fieldGroups: Array<Array<keyof Transaction>> = [];
  for (let i = 0; i < filteredFields.length; i += fieldsPerGroup) {
    fieldGroups.push(filteredFields.slice(i, i + fieldsPerGroup));
  }

  // Map fields to their respective tabs
  const fieldTabMap: Record<string, number> = {};
  fieldGroups.forEach((group, index) => {
    group.forEach((field) => {
      fieldTabMap[field as string] = index;
    });
  });

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  // Submit handler
  const onSubmit = (data: Transaction) => {
    console.log("Form Data Submitted:", data);

    // Include the data from nested editors
    const combinedData = {
      ...data,
      channel: channelData,
      territory: territoryData,
      compensation: compensationData,
    };

    onSuccess(combinedData);
  };

  // Function to check which tabs have errors
  const getTabsWithErrors = (): number[] => {
    const tabsWithErrors = new Set<number>();
    Object.keys(errors).forEach((field) => {
      const tabIndex = fieldTabMap[field];
      if (tabIndex !== undefined) {
        tabsWithErrors.add(tabIndex);
      }
    });
    return Array.from(tabsWithErrors);
  };

  // Options for dropdown fields
  const optionsMap: Record<string, string[]> = {
    status: statuses.map((status) => status.name),
    transactionType: ["Online", "Offline", "Bank Transfer", "Credit Card"],
    currency: ["USD", "EUR", "GBP"],
    type: ["Credit", "Debit"],
    category: ["Invoice", "Payment", "Subscription"],
  };

  // Render input fields based on their type
  const renderInput = (key: keyof Transaction) => {
    const label = key.charAt(0).toUpperCase() + key.slice(1);
    const error = errors[key]?.message;

    if (readOnlyFields.includes(key)) {
      return (
        <Controller
          key={key}
          name={key}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={label}
              fullWidth
              margin="normal"
              variant="outlined"
              disabled
            />
          )}
        />
      );
    }

    if (isDateField(key)) {
      return (
        <Controller
          key={key}
          name={key}
          control={control}
          render={({ field }) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label={label}
                value={field.value ? dayjs(field.value as string) : null}
                onChange={(date) => {
                  field.onChange(date ? date.format("YYYY-MM-DD") : null);
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: "normal",
                    variant: "outlined",
                    error: !!error,
                    helperText: error,
                  },
                }}
              />
            </LocalizationProvider>
          )}
        />
      );
    }

    if (isDropdownField(key)) {
      const options = optionsMap[key] || [];
      return (
        <Controller
          key={key}
          name={key}
          control={control}
          render={({ field }) => (
            <FormControl
              fullWidth
              margin="normal"
              variant="outlined"
              error={!!error}
            >
              <InputLabel>{label}</InputLabel>
              <Select {...field} label={label}>
                {options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              {error && (
                <Typography variant="caption" color="error">
                  {error}
                </Typography>
              )}
            </FormControl>
          )}
        />
      );
    }

    if (isSwitchField(key)) {
      return (
        <Controller
          key={key}
          name={key}
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Switch {...field} checked={!!field.value} />}
              label={label}
            />
          )}
        />
      );
    }

    return (
      <Controller
        key={key}
        name={key}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={label}
            fullWidth
            margin="normal"
            variant="outlined"
            type={typeof model[key] === "number" ? "number" : "text"}
            error={!!error}
            helperText={error}
          />
        )}
      />
    );
  };

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="lg">
      <DialogTitle>
        {model.id === 0 ? "Add Transaction" : "Edit Transaction"}
      </DialogTitle>
      <form
        onSubmit={handleSubmit(onSubmit, () => {
          // On validation failure, find tabs with errors and switch to the first one
          const tabsWithErrors = getTabsWithErrors();
          if (tabsWithErrors.length > 0) {
            setTabIndex(tabsWithErrors[0]);
          }
        })}
      >
        <DialogContent>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {fieldGroups.map((_, index) => {
              const tabsWithErrors = getTabsWithErrors();
              const hasError = tabsWithErrors.includes(index);

              return (
                <Tab
                  key={index}
                  label={
                    hasError ? (
                      <Badge color="error" variant="dot">
                        {`Group ${index + 1}`}
                      </Badge>
                    ) : (
                      `Group ${index + 1}`
                    )
                  }
                />
              );
            })}
          </Tabs>
          {/* Render transaction field groups */}
          {fieldGroups.map((group, index) => (
            <TabPanel key={index} value={tabIndex} index={index}>
              <Grid container spacing={2}>
                {group.map((key) => (
                  <Grid item xs={12} sm={6} key={key}>
                    {renderInput(key)}
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
          ))}
        </DialogContent>
        <DialogActions>
          {/* Buttons for Editing Related Data */}
          <Box flexGrow={1} display="flex" alignItems="center">
            <Tooltip title="Edit Channel">
              <IconButton
                onClick={() => setOpenChannelEditor(true)}
                color="primary"
              >
                <EditIcon />
                <Typography variant="body2" style={{ marginLeft: 4 }}>
                  Channel
                </Typography>
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Territory">
              <IconButton
                onClick={() => setOpenTerritoryEditor(true)}
                color="primary"
              >
                <EditIcon />
                <Typography variant="body2" style={{ marginLeft: 4 }}>
                  Territory
                </Typography>
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Compensation">
              <IconButton
                onClick={() => setOpenCompensationEditor(true)}
                color="primary"
              >
                <EditIcon />
                <Typography variant="body2" style={{ marginLeft: 4 }}>
                  Compensation
                </Typography>
              </IconButton>
            </Tooltip>
          </Box>
          {/* Action Buttons */}
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </form>

      {/* Nested Editor Dialogs */}
      <ChannelEditorDialog
        open={openChannelEditor}
        onClose={() => setOpenChannelEditor(false)}
        onSave={(data) => {
          setChannelData(data);
          setOpenChannelEditor(false);
        }}
        initialData={channelData}
      />

      <TerritoryEditorDialog
        open={openTerritoryEditor}
        onClose={() => setOpenTerritoryEditor(false)}
        onSave={(data) => {
          setTerritoryData(data);
          setOpenTerritoryEditor(false);
        }}
        initialData={territoryData}
      />

      <CompensationEditorDialog
        open={openCompensationEditor}
        onClose={() => setOpenCompensationEditor(false)}
        onSave={(data) => {
          setCompensationData(data);
          setOpenCompensationEditor(false);
        }}
        initialData={compensationData}
      />
    </Dialog>
  );
};

export default TransactionFormDialog;
