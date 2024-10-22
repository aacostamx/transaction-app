import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Snackbar,
  Alert,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TransactionTable from './TransactionTable';
import AddTransaction from './AddTransaction';
import EditTransaction from './EditTransaction';
import { Transaction } from '../types/Transaction';

const TransactionPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(
    null
  );
  const [adding, setAdding] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  const handleEditClick = (transaction: Transaction) => {
    setEditTransaction(transaction);
  };

  const handleAddClick = () => {
    setAdding(true);
  };

  const handleCancel = () => {
    setAdding(false);
    setEditTransaction(null);
  };

  const [refreshData, setRefreshData] = useState<boolean>(false);

  const handleSuccess = () => {
    setSnackbar({
      open: true,
      message: editTransaction
        ? 'Transaction updated successfully'
        : 'Transaction created successfully',
      severity: 'success',
    });
    setAdding(false);
    setEditTransaction(null);
    setRefreshData((prev) => !prev); // Toggle refreshData to trigger data reload
  };

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Transactions
      </Typography>
      {!adding && !editTransaction && (
        <>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <TextField
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
      {adding && (
        <AddTransaction onCancel={handleCancel} onSuccess={handleSuccess} />
      )}
      {editTransaction && (
        <EditTransaction
          transaction={editTransaction}
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
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TransactionPage;
