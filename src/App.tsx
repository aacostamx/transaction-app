import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TransactionPage from "./components/TransactionPage";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const App: React.FC = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Router>
        <Routes>
          <Route path="/" element={<TransactionPage />} />
        </Routes>
      </Router>
    </LocalizationProvider>
  );
};

export default App;
