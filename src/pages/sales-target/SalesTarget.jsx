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
  Collapse,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SalesTargetTable() {
  const [salesData, setSalesData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  useEffect(() => {
    fetchSalesTargets();
  }, []);

  const fetchSalesTargets = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");
  
      const response = await axios.get(`${API_END_POINT}/salestarget`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSalesData(response.data.data || []);
    } catch (error) {
      console.error("Error fetching sales targets:", error);
    }
  };
  
  const handleAddClick = () => {
    navigate("add-sales-target");
  };

  const handleEditClick = (product) => {
    navigate("edit-sales-target", { state: { product } });
  };

  const toggleRowExpansion = (rowId) => {
    setExpandedRow(expandedRow === rowId ? null : rowId);
  };

  // Delete product targets based on product name
  const deleteProductTargets = async (productName) => {
    try {
      const response = await axios.delete(`${API_END_POINT}/salestarget/${productName}`);
      alert(response.data.message); // Show success message
      fetchSalesTargets(); // Re-fetch the sales data
    } catch (error) {
      console.error("Error deleting product targets:", error);
      alert("Failed to delete product targets");
    }
  };

  const uniqueProducts = Array.from(
    new Set(salesData.map((row) => row.product_name || "N/A"))
  ).map((productName) =>
    salesData.find((row) => row.product_name === productName)
  );

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const renderPagination = () => (
    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "15px", padding: "15px" }}>
      <Button
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 0}
        variant="outlined"
      >
        Previous
      </Button>
      <Typography variant="body1" style={{ minWidth: "60px", textAlign: "center" }}>
        Page {page + 1}
      </Typography>
      <Button
        onClick={() => handlePageChange(page + 1)}
        disabled={page >= Math.ceil(salesData.length / rowsPerPage) - 1}
        variant="outlined"
      >
        Next
      </Button>
    </div>
  );

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h6" sx={{ marginBottom: "20px" }}>
        Sales Targets
      </Typography>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Add Sales Target
        </Button>
      </Box>
      <TableContainer component={Paper} style={{ maxHeight: 480, overflowY: "auto" }}>
        <Table stickyHeader aria-label="sales targets table">
          <TableHead sx={{ backgroundColor: "#DCDCDC" }}>
            <TableRow>
              <TableCell sx={{ backgroundColor: "#DCDCDC" }}>No.</TableCell>
              <TableCell sx={{ backgroundColor: "#DCDCDC" }}>Product Name</TableCell>
              <TableCell sx={{ backgroundColor: "#DCDCDC" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {uniqueProducts.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((product, index) => {
              const productTargets = salesData.filter(
                (item) => item.product_name === product.product_name
              );

              return (
                <React.Fragment key={product.id || index}>
                  <TableRow
                    onClick={() => toggleRowExpansion(product.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{product.product_name || "N/A"}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleEditClick(product)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => deleteProductTargets(product.product_name)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} style={{ padding: 0 }}>
                      <Collapse in={expandedRow === product.id} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                          <Table size="small">
                            <TableHead sx={{ backgroundColor: "#DCDCDC" }}>
                              <TableRow>
                                <TableCell >Role</TableCell>
                                <TableCell>Sales Target</TableCell>
                                <TableCell>Stock Target</TableCell>

                                <TableCell>Duration</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {productTargets.map((target, idx) => (
                                <TableRow key={idx}>
                                  <TableCell>{target.product_data[0].role}</TableCell>
                                  <TableCell>{target.product_data[0].target}</TableCell>
                                  <TableCell>{target.product_data[0].stock_target }</TableCell>

                                  <TableCell>{target.product_data[0].duration}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {renderPagination()}
    </div>
  );
}
