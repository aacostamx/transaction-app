import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TransactionTable from "./TransactionTable";
import { Transaction } from "../types/Transaction";
import TransactionFormDialog from "./TransactionFormDialog"; // Import the new dialog form
import { createTransaction, updateTransaction } from "../services/api";

const TransactionPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [adding, setAdding] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const [refreshData, setRefreshData] = useState<boolean>(false);

  // Handle Search Query
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchQuery(event.target.value);
  };

  // Handle Edit Transaction
  const handleEditClick = (transaction: Transaction) => {
    setEditTransaction(transaction);
    setAdding(false); // Close add mode when editing
  };

  // Handle Add Transaction
  const handleAddClick = () => {
    setAdding(true);
    setEditTransaction(null); // Close edit mode when adding
  };

  // Handle Cancel - Reset form and state
  const handleCancel = () => {
    setAdding(false);
    setEditTransaction(null); // Close edit or add mode and go back to table
  };

  // Handle Success - After form submit (either Add or Edit)
  const handleSuccess = async (transaction: Transaction) => {
    try {
      if (editTransaction) {
        await updateTransaction(transaction); // API call for updating a transaction
        setSnackbar({
          open: true,
          message: "Transaction updated successfully",
          severity: "success",
        });
      } else {
        await createTransaction(transaction); // API call for creating a transaction
        setSnackbar({
          open: true,
          message: "Transaction created successfully",
          severity: "success",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to save transaction",
        severity: "error",
      });
    }
    setAdding(false);
    setEditTransaction(null);
    setRefreshData((prev) => !prev); // Refresh the transaction table
  };

  // Handle Snackbar Close
  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Transactions
      </Typography>
      
      {/* Display the Transaction Table when not adding or editing */}
      {!adding && !editTransaction && (
        <>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <TextField
              size="small"
              style={{ width: 300 }}
              label="Search Transactions"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddClick}
            >
              Add Transaction
            </Button>
          </Box>
          <TransactionTable
            searchQuery={searchQuery}
            onEdit={handleEditClick}
            refresh={refreshData}
          />
        </>
      )}

      {/* Add Transaction Dialog */}
      <TransactionFormDialog
        model={{
          id: 0, // Placeholder ID for new transaction
          transactionId: "",
          date: "",
          amount: 0,
          status: "",
          createdDate: "",
          description: "",
          originAccount: "",
          destinationAccount: "",
          category: "",
          type: "",
          currency: "",
          isActive: true,
          transactionType: "",
          isRecurring: false,
        }}
        open={adding}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />

      {/* Edit Transaction Dialog */}
      {editTransaction && (
        <TransactionFormDialog
          model={editTransaction}
          open={Boolean(editTransaction)}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TransactionPage;
