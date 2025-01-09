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
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { API_END_POINT_IMG } from "../../constants/ApiConstant";
const areas = [];

export default function ReportTable() {
  const [rows, setRows] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [roleFilter, setRoleFilter] = useState(""); // Role filter state initially empty to show all data
  const [availableRoles, setAvailableRoles] = useState([]); // Dynamically filtered roles
  const [areaFilter, setAreaFilter] = useState("");
  const [areas, setAreas] = useState([]); // State to hold areas dynamically
  const { users } = useSelector((state) => state.users);
  const userId = users?.id;
  const userRole = users?.role_name;
  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage] = useState(10); // Rows per page

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;


  const toggleDatePicker = () => {
    setShowDatePicker((prev) => !prev); // Toggle the date picker state
  };

  useEffect(() => {
    // Fetch areas dynamically from API based on user data
    const fetchAreas = async () => {
      try {
        // const response = await fetch(`${API_END_POINT}/api/user/${userId}`);
        const response = await fetch(`${API_END_POINT}/user/${userId}`);
        const data = await response.json();
        // Assuming the API response contains a list of cities or areas
        const userAreas = [
          ...(data.mdUsers || []).map(user => user.city),
          ...(data.sdUsers || []).map(user => user.city),
          ...(data.distributorUsers || []).map(user => user.city),
          ...(data.adoUsers || []).map(user => user.city),
        ];
        setAreas([...new Set(userAreas)]); // Remove duplicates
      } catch (error) {
        console.error("Error fetching area data:", error);
      }
    };

    if (userId) {
      fetchAreas();
    }
  }, [userId]);

  useEffect(() => {
    if (userRole) {
      switch (userRole) {
        case "Admin":
          setAvailableRoles([
            "Area Development Officer",
            "Master Distributor",
            "Super Distributor",
            "Distributor",
          ]);
          break;
        case "Area Development Officer":
          setAvailableRoles([
            "Master Distributor",
            "Super Distributor",
            "Distributor",
          ]);
          break;
        case "Master Distributor":
          setAvailableRoles(["Super Distributor", "Distributor"]);
          break;
        case "Super Distributor":
          setAvailableRoles(["Distributor"]);
          break;
        default:
          setAvailableRoles([]);
          break;
      }
      setRoleFilter(""); // Default to empty string to show all data initially
    }
  }, [userRole]);

  const fetchUserCounts = async () => {
    try {
      // const response = await fetch(`${API_END_POINT}/api/user/${userId}`);
      const response = await fetch(`${API_END_POINT}/user/${userId}`);
      const data = await response.json();

      const users = [
        ...(data.mdUsers || []),
        ...(data.sdUsers || []),
        ...(data.distributorUsers || []),
        ...(data.adoUsers || []),
      ];

      setRows(users);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserCounts(); // Only call when userId is defined
    }
  }, [userId]);

  const fetchSalesAchievement = async (roleId, userId) => {
    try {
      const response = await fetch(
        `${API_END_POINT}/user_sales_detail/sales_achievement/${roleId}/${userId}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching sales achievement data:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchUserCounts();
  }, []);

  useEffect(() => {
    const fetchSalesDataForFilteredRoleAndArea = async () => {
      const updatedRows = [];

      for (const user of rows) {
        if (
          (roleFilter === "" || user.role_name === roleFilter) &&
          (areaFilter === "" || user.city === areaFilter)
        ) {
          const salesAchievement = await fetchSalesAchievement(user.role_name, user.id);
          updatedRows.push({
            ...user,
            salesAchievement: salesAchievement || null,
          });
        }
      }
      setSalesData(updatedRows);
    };

    fetchSalesDataForFilteredRoleAndArea();
  }, [roleFilter, areaFilter, rows]);

  const handleFilterChange = () => {
    console.log("Filters applied with:", roleFilter, areaFilter);
  };


  const renderPagination = (page, setPage, totalRows) => (
    <div style={{ display: "flex", justifyContent: "right", alignItems: "center", gap: "15px" }}>
      <Button
        onClick={() => setPage(page - 1)}
        disabled={page === 0}
        variant="outlined"
      >
        Previous
      </Button>
      <Typography variant="body1" style={{ minWidth: "60px", textAlign: "center" }}>
        Page {page + 1} of {Math.ceil(totalRows / rowsPerPage)}
      </Typography>
      <Button
        onClick={() => setPage(page + 1)}
        disabled={page >= Math.ceil(totalRows / rowsPerPage) - 1}
        variant="outlined"
      >
        Next
      </Button>
    </div>
  );

  const paginatedData = salesData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );



  return (
    <Box p={3}>
      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        All Reports
      </Typography>
      <Box display="flex" flexDirection="column" gap="20px" mb={3}>
        <Box display="flex" gap="20px" position="relative">
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            displayEmpty
            sx={{ borderColor: "white" }}
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


          {/* <Box display="flex" alignItems="center" position="relative">
            <Box
              display="flex"
              alignItems="center"
              sx={{ cursor: "pointer" }}
              onClick={toggleDatePicker}
            >
              <IconButton size="small">
              </IconButton>
              <span>Sort by Date</span>
              {showDatePicker ? <ArrowLeftIcon /> : <ArrowRightIcon />}
            </Box>
            {showDatePicker && (
              <Box
                display="flex"
                gap="20px"
                position="absolute"
                left="100%"
                padding="10px"
              >
                <Box>
                  <span>From:</span>
                  <DatePicker
                    selected={fromDate}
                    onChange={(date) => setFromDate(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Enter From Date"
                    className="date-picker"
                  />
                </Box>

                <Box>
                  <span>To:</span>
                  <DatePicker
                    selected={toDate}
                    onChange={(date) => setToDate(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Enter To Date"
                    className="date-picker"
                  />
                </Box>
              </Box>
            )}
          </Box> */}


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
            {/* {paginatedData.map((row, index) => ( */}
            {salesData.map((row, index) => (

              <TableRow key={row.id}>
                <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar
                      alt={row.full_name}
                      src={`${API_END_POINT_IMG}/uploads/${row.image}`}
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

      <div style={{ marginTop: "10px" }}>
        {/* {renderPagination(page, setPage, salesData.length)} */}
      </div>


    </Box>
  );
}
