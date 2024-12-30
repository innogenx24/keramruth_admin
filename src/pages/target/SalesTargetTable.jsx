import React, { useState, useEffect } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditButton from "../../assets/actions/EditButton.svg";

const SalesTargetTable = () => {
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate(); // Initialize navigation

  // Fetch sales targets from API
  const fetchSalesTargets = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");

      const response = await axios.get("http://88.222.245.236:3002/salestarget", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Set the fetched data into state
      setTableData(response.data.data || []);
    } catch (error) {
      console.error("Error fetching sales targets:", error);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchSalesTargets();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  const handleEditClick = (row) => {
    // Navigate to the Edit page and pass the selected row as state
    navigate("edit-sales-target", { state: { selectedRow: row } });
  };

  const handleDeleteClick = (id) => {
    const updatedData = tableData.filter((row) => row.id !== id); // Delete the selected row
    setTableData(updatedData);
  };

  return (
    <div style={{ padding: "16px" }}>
      <Typography variant="h6" sx={{ marginBottom: "20px" }}>
        Sales Targets
      </Typography>

      {/* Table Container */}
      <TableContainer component={Paper} style={{ marginBottom: "16px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell >ID</TableCell>
              <TableCell>Role Name</TableCell>
              <TableCell>Sales Target</TableCell>
              <TableCell>Stock Target</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell sx={{ color: "#009AEE" }}>{row.role_name}</TableCell>
                <TableCell>{row.target}</TableCell>
                <TableCell>{row.stock_target}</TableCell>
                <TableCell>{row.duration}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEditClick(row)}>
                    <img
                      src={EditButton}
                      alt="Edit"
                      style={{
                        width: "30px",
                        height: "30px",
                        objectFit: "contain",
                        transform: "scale(1.5)",
                      }}
                    />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default SalesTargetTable;
