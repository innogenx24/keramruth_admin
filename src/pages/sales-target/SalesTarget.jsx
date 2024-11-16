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
  const navigate = useNavigate();

  useEffect(() => {
    fetchSalesTargets();
  }, []);

  const fetchSalesTargets = async () => {
    try {
      const response = await axios.get("http://88.222.245.236:3002/salestarget");
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
      const response = await axios.delete(`http://88.222.245.236:3002/salestarget/${productName}`);
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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {uniqueProducts.map((product, index) => {
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
                            <TableHead>
                              <TableRow>
                                <TableCell>Role</TableCell>
                                <TableCell>Target</TableCell>
                                <TableCell>Duration</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {productTargets.map((target, idx) => (
                                <TableRow key={idx}>
                                  <TableCell>{target.product_data[0].role}</TableCell>
                                  <TableCell>{target.product_data[0].target}</TableCell>
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
    </div>
  );
}
