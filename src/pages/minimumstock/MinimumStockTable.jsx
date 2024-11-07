import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function MinimumStockTable() {
  const [stockData, setStockData] = useState([]); // Changed to stockData
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMinimumStocks(); // Updated function name
  }, []);

  const fetchMinimumStocks = async () => {
    try {
      const response = await axios.get("http://88.222.245.236:3002/minimumstock"); // Adjusted endpoint
      setStockData(response.data.data);
    } catch (error) {
      console.error("Error fetching minimum stocks:", error);
    }
  };

  const handleAddClick = () => {
    navigate("add-minimum-stock"); // Updated navigation
  };

  const handleEditClick = (row) => {
    navigate("edit-minimum-stock", { state: { row } }); // Updated navigation
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://88.222.245.236:3002/minimumstock/${deleteId}`); // Updated endpoint
      setStockData(stockData.filter((item) => item.id !== deleteId));
      setOpenDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting minimum stock:", error);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteModal(false);
    setDeleteId(null);
  };

  const itemToDelete = stockData.find((item) => item.id === deleteId);

  return (
    <div style={{ padding: "20px" }}>
      <Typography
        variant="h6"
        component="div"
        sx={{ flexGrow: 1, color: "#989FA9", marginBottom: "20px" }}
      >
        Minimum Stock Levels
      </Typography>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
          sx={{ minWidth: "200px", borderRadius: "20px", padding: "10px" }}
        >
          Add Minimum Stock
        </Button>
      </Box>
      <h2 style={{ color: "#646464" }}>Stock Levels</h2>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Virgin Coconut Oil Minimum Stock</TableCell>
              <TableCell>Virgin Coconut Hair Oil Minimum Stock</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stockData.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell style={{ color: "#007FFF" }}>{row.role}</TableCell>
                <TableCell>
                  {row.productData.find(p => p.productType === "Virgin Coconut Oil")?.stock || "-"}
                </TableCell>
                <TableCell>
                  {row.productData.find(p => p.productType === "Virgin Coconut Hair Oil")?.stock || "-"}
                </TableCell>
                <TableCell>
                  {row.productData.find(p => p.productType === "Virgin Coconut Oil")?.duration || "-"}
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEditClick(row)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteClick(row.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDeleteModal} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {itemToDelete && (
              <span>
                Are you sure you want to delete the minimum stock for <strong>{itemToDelete.role}</strong>?
              </span>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
