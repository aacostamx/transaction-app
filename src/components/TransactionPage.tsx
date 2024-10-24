import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Snackbar,
  Alert,
  IconButton,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import TransactionTable from "./TransactionTable";
import { Transaction } from "../types/Transaction";
import TransactionFormDialog from "./TransactionFormDialog";
import { createTransaction, updateTransaction } from "../services/api";

const TransactionPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchTrigger, setSearchTrigger] = useState<boolean>(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(
    null
  );
  const [adding, setAdding] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const [refreshData, setRefreshData] = useState<boolean>(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setSearchTrigger((prev) => !prev);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleEditClick = (transaction: Transaction) => {
    setEditTransaction(transaction);
    setAdding(false);
  };

  const handleAddClick = () => {
    setAdding(true);
    setEditTransaction(null);
  };

  const handleCancel = () => {
    setAdding(false);
    setEditTransaction(null);
  };

  const handleSuccess = async (transaction: Transaction) => {
    try {
      if (editTransaction) {
        await updateTransaction(transaction);
        setSnackbar({
          open: true,
          message: "Transaction updated successfully",
          severity: "success",
        });
      } else {
        await createTransaction(transaction);
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
    setRefreshData((prev) => !prev);
  };

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
            <Box display="flex" alignItems="center">
              <TextField
                size="small"
                style={{ width: 300 }}
                label="Search Transactions"
                variant="outlined"
                value={searchInput}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
              />
              <IconButton
                color="primary"
                onClick={handleSearch}
                aria-label="search"
              >
                <SearchIcon />
              </IconButton>
            </Box>
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
            searchTrigger={searchTrigger}
            onEdit={handleEditClick}
            refresh={refreshData}
          />
        </>
      )}

      <TransactionFormDialog
        model={{
          id: 0,
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

      {editTransaction && (
        <TransactionFormDialog
          model={editTransaction}
          open={Boolean(editTransaction)}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      )}

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
