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

export default function SalesTargetTable() {
  const [salesData, setSalesData] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSalesTargets();
  }, []);

  const fetchSalesTargets = async () => {
    try {
      const response = await axios.get("http://88.222.245.236:3002/salestarget");
      setSalesData(response.data.data);
    } catch (error) {
      console.error("Error fetching sales targets:", error);
    }
  };

  const handleAddClick = () => {
    navigate("add-sales-target");
  };

  const handleEditClick = (row) => {
    navigate("edit-sales-target", { state: { row } });
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://88.222.245.236:3002/salestarget/${deleteId}`);
      setSalesData(salesData.filter((item) => item.id !== deleteId));
      setOpenDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting sales target:", error);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteModal(false);
    setDeleteId(null);
  };

  const itemToDelete = salesData.find((item) => item.id === deleteId);

  return (
    <div style={{ padding: "20px" }}>
      <Typography
        variant="h6"
        component="div"
        sx={{ flexGrow: 1, color: "#989FA9", marginBottom: "20px" }}
      >
        Sales Targets
      </Typography>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
          sx={{ minWidth: "200px", borderRadius: "20px", padding: "10px" }}
        >
          Add Sales Target
        </Button>
      </Box>
      <h2 style={{ color: "#646464" }}>Target</h2>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Virgin Coconut Oil</TableCell>
              <TableCell>Virgin Coconut Hair Oil</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salesData.map((row, index) => (
              <TableRow key={row.id}> {/* Use a unique identifier as the key */}
                <TableCell>{index + 1}</TableCell>
                <TableCell style={{ color: "#007FFF" }}>{row.role}</TableCell>
                <TableCell>
                  {row.productData.find(p => p.productType === "Virgin Coconut Oil")?.target || "-"}
                </TableCell>
                <TableCell>
                  {row.productData.find(p => p.productType === "Virgin Coconut Hair Oil")?.target || "-"}
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
                Are you sure you want to delete the sales target for <strong>{itemToDelete.role}</strong>?
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
