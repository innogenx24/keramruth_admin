import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Box,
  Avatar,
  IconButton,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSelector } from "react-redux";

const areas = ["Bannerghatta", "Koramangala", "Indiranagar"];

export default function ReportTable() {
  const [rows, setRows] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [roleFilter, setRoleFilter] = useState(""); // Role filter state
  const [availableRoles, setAvailableRoles] = useState([]); // Dynamically filtered roles
  const [areaFilter, setAreaFilter] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { users } = useSelector((state) => state.users);
  const userId = users?.id;
  const userRole = users?.role_name;

  useEffect(() => {
    if (userRole) {
      // Set available roles based on the current user's role
      switch (userRole) {
        case "Admin":
          setAvailableRoles([
            "Area Development Officer (ADO)",
            "Master Distributor (MD)",
            "Super Distributor (SD)",
            "Distributor (D)",
            "Customer (C)",
          ]);
          break;
        case "Area Development Officer":
          setAvailableRoles([
            "Master Distributor (MD)",
            "Super Distributor (SD)",
            "Distributor (D)",
            "Customer (C)",
          ]);
          break;
        case "Master Distributor":
          setAvailableRoles([
            "Super Distributor (SD)",
            "Distributor (D)",
            "Customer (C)",
          ]);
          break;
        case "Super Distributor":
          setAvailableRoles([
            "Distributor (D)",
            "Customer (C)",
          ]);
          break;
        case "Distributor":
          setAvailableRoles(["Customer (C)"]);
          break;
        default:
          setAvailableRoles([]);
          break;
      }
      setRoleFilter(userRole); // Default role filter is the user's role
    }
  }, [userRole]);

  const fetchUserCounts = async () => {
    try {
      const response = await fetch(`http://localhost:3002/api/user/${userId}`);
      const data = await response.json();
      const users = [
        ...data.mdUsers,
        ...data.sdUsers,
        ...data.distributorUsers,
        ...data.adoUsers,
      ];
      setRows(users);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchSalesAchievement = async (roleId, userId) => {
    try {
      const response = await fetch(
        `http://88.222.245.236:3002/user_sales_detail/sales_achievement/${roleId}/${userId}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching sales achievement data:", error);
      return null;
    }
  };

  const fetchSalesDataForUsers = async () => {
    const updatedRows = [];

    for (const user of rows) {
      const salesAchievement = await fetchSalesAchievement(user.role_name, user.id);
      updatedRows.push({
        ...user,
        salesAchievement: salesAchievement ? salesAchievement : null,
      });
    }
    setSalesData(updatedRows);
  };

  useEffect(() => {
    fetchUserCounts();
  }, []);

  useEffect(() => {
    if (rows.length > 0) {
      fetchSalesDataForUsers();
    }
  }, [rows]);

  const handleFilterChange = () => {
    console.log("Filters applied with:", roleFilter, areaFilter);
  };

  return (
    <Box p={3}>
      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        All Reports
      </Typography>
      <Box display="flex" gap="20px" mb={3}>
        <Select
          value={availableRoles.includes(roleFilter) ? roleFilter : ""}
          onChange={(e) => setRoleFilter(e.target.value)}
          displayEmpty
          sx={{ borderColor: "white" }} // Set border color to white
        >
          <MenuItem value="">Select Role</MenuItem>
          {availableRoles.map((role, index) => (
            <MenuItem key={index} value={role}>
              {role}
            </MenuItem>
          ))}
        </Select>

        <Select
          value={areaFilter}
          onChange={(e) => setAreaFilter(e.target.value)}
          displayEmpty
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">Area</MenuItem>
          {areas.map((area) => (
            <MenuItem key={area} value={area}>
              {area}
            </MenuItem>
          ))}
        </Select>

        <Box display="flex" alignItems="center">
          <Box
            display="flex"
            alignItems="center"
            sx={{ cursor: "pointer" }}
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            <span>Sort by Date</span>
            <IconButton size="small">
              <ExpandMoreIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Target Amount</TableCell>
              <TableCell>Stock QTY</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salesData.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar
                      alt={row.full_name}
                      src={`http://88.222.245.236:3002/uploads/${row.image}`}
                      sx={{ width: 40, height: 40, marginRight: 2 }}
                    />
                    {row.full_name}
                  </Box>
                </TableCell>
                <TableCell>{row.role_name}</TableCell>
                <TableCell>{row.city}</TableCell>
                <TableCell>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {row.salesAchievement?.monthlyDetails?.[0]?.MonthlyTargetAmount || 0}
                    <span style={{ fontSize: "1.5em", margin: "0 3px" }}>/</span>
                    {row.salesAchievement?.monthlyDetails?.[0]?.AchievementAmount || 0}
                  </div>
                </TableCell>
                <TableCell>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {row.salesAchievement?.monthlyDetails?.[0]?.StockTarget || 0}
                    <span style={{ fontSize: "1.5em", margin: "0 3px" }}>/</span>
                    {row.salesAchievement?.monthlyDetails?.[0]?.StockAchievement || 0}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
