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
  Button,
  CircularProgress, // For loading state
  TextField,
} from "@mui/material";
import { useSelector } from "react-redux";
import { API_END_POINT_IMG } from "../../constants/ApiConstant";

export default function ReportTable() {
  const [rows, setRows] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [availableRoles, setAvailableRoles] = useState([]);
  const [areaFilter, setAreaFilter] = useState("");
  const [areas, setAreas] = useState([]);
  const { users } = useSelector((state) => state.users);
  const userId = users?.id;
  const userRole = users?.role_name;
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [nameFilter, setNameFilter] = useState("");
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;
  const [showNoDataMessage, setShowNoDataMessage] = useState(false);

  useEffect(() => {
    // Fetch areas dynamically from API based on user data
    const fetchAreas = async () => {
      try {
        const response = await fetch(`${API_END_POINT}/user/${userId}`);
        const data = await response.json();
        const userAreas = [
          ...(data.mdUsers || []).map((user) =>
            user.district.trim().toLowerCase()
          ),
          ...(data.sdUsers || []).map((user) =>
            user.district.trim().toLowerCase()
          ),
          ...(data.distributorUsers || []).map((user) =>
            user.district.trim().toLowerCase()
          ),
          ...(data.adoUsers || []).map((user) =>
            user.district.trim().toLowerCase()
          ),
        ];
        setAreas([...new Set(userAreas)]);
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
      setRoleFilter("");
    }
  }, [userRole]);

  const fetchUserCounts = async () => {
    try {
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
      fetchUserCounts();
    }
  }, [userId]);

  useEffect(() => {
    const fetchSalesDataForFilteredRoleAndArea = async () => {
      setIsLoading(true);

      const filteredRows = rows.filter(
        (user) =>
          (roleFilter === "" || user.role_name === roleFilter) &&
          (areaFilter === "" ||
            user.district.trim().toLowerCase() ===
              areaFilter.trim().toLowerCase()) &&
          (nameFilter === "" ||
            user.full_name.toLowerCase().includes(nameFilter.toLowerCase()))
      );

      const enrichedRows = await Promise.all(
        filteredRows.map(async (user) => {
          const salesAchievement = await fetchSalesAchievement(
            user.role_name,
            user.id
          );
          return { ...user, salesAchievement: salesAchievement || null };
        })
      );

      setSalesData(enrichedRows);
      setIsLoading(false);
    };

    if (rows.length > 0) {
      fetchSalesDataForFilteredRoleAndArea();
    }
  }, [roleFilter, areaFilter, nameFilter, rows]);

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

  const handleFilterChange = () => {
    console.log("Filters applied with:", roleFilter, areaFilter);
    // Reset page to 0 (first page) when filters are applied
    setPage(0);
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    if (name === "role") {
      setRoleFilter(value);
      setPage(0);
    } else if (name === "area") {
      setAreaFilter(value);
      setPage(0);
    }
  };

  const handleSearchChangeName = (e) => {
    const { value } = e.target;
    setNameFilter(value);
  };

  const renderPagination = (page, setPage, totalRows) => (
    <div
      style={{
        display: "flex",
        justifyContent: "right",
        alignItems: "center",
        gap: "15px",
      }}
    >
      <Button
        onClick={() => setPage(page - 1)}
        disabled={page === 0}
        variant="outlined"
      >
        Previous
      </Button>
      <Typography
        variant="body1"
        style={{ minWidth: "60px", textAlign: "center" }}
      >
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
  const renderLoadingState = () => (
    <TableRow>
      <TableCell colSpan={6} align="center">
        <CircularProgress />
      </TableCell>
    </TableRow>
  );

  useEffect(() => {
    if (paginatedData && paginatedData.length === 0) {
      const timer = setTimeout(() => {
        setShowNoDataMessage(true);
      }, 2000); // 2-second delay

      return () => clearTimeout(timer); // Cleanup the timer
    } else {
      setShowNoDataMessage(false); // Reset message if data comes in
    }
  }, [paginatedData]);
  // const renderCircularProgress = (percent) => {
  //   const color = getColor(percent);

  //   return (
  //     <Box position="relative" display="inline-flex" mr={2}>
  //       <CircularProgress
  //         variant="determinate"
  //         value={100}
  //         size={80}
  //         thickness={5}
  //         style={{ color: "#e0e0e0" }}
  //       />
  //       <CircularProgress
  //         variant="determinate"
  //         value={percent}
  //         size={80}
  //         thickness={5}
  //         style={{
  //           position: "absolute",
  //           color: color,
  //         }}
  //       />
  //       <Box
  //         position="absolute"
  //         top="50%"
  //         left="50%"
  //         sx={{ transform: "translate(-50%, -50%)" }}
  //       >
  //         <Typography variant="h6" fontWeight="bold" sx={{ fontSize: "1.08rem !important", color: "primary" }}>
  //           {`${(parseFloat(percent) || 0).toFixed(2)}%`}
  //         </Typography>
  //       </Box>
  //     </Box>
  //   );
  // };

  // const getColor = (percent) => {
  //   if (percent >= 75) return 'green';
  //   if (percent >= 50) return 'orange';
  //   return 'red';
  // };

  return (
    <Box p={3}>
      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        All Reports
      </Typography>

      <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
        <TextField
          label="Search Name"
          variant="outlined"
          name="name"
          value={nameFilter}
          onChange={handleSearchChangeName}
          sx={{
            borderRadius: "20px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
            },
          }}
        />
      </Box>
      <Box display="flex" flexDirection="column" gap="20px" mb={3}>
        <Box display="flex" gap="20px" position="relative">
          <Select
            value={roleFilter}
            onChange={(e) => handleSearchChange(e)}
            displayEmpty
            name="role"
            sx={{
              borderColor: "white",
              borderRadius: "20px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
              },
            }}
          >
            <MenuItem value="">Select All Role</MenuItem>
            {availableRoles.map((role, index) => (
              <MenuItem key={index} value={role}>
                {role}
              </MenuItem>
            ))}
          </Select>

          <Select
            value={areaFilter}
            onChange={(e) => handleSearchChange(e)}
            displayEmpty
            name="area"
            sx={{
              minWidth: 150,
              borderRadius: "20px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
              },
            }}
          >
            <MenuItem value="">All Areas</MenuItem>
            {areas
              .slice() // Create a copy to avoid mutating the original array
              .sort((a, b) => a.localeCompare(b)) // Sort alphabetically
              .map((area) => (
                <MenuItem key={area} value={area}>
                  {area.charAt(0).toUpperCase() + area.slice(1)}{" "}
                  {/* Capitalize first letter */}
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

      <TableContainer
        component={Paper}
        sx={{ maxHeight: 500, overflowY: "auto" }}
      >
        <Table>
          <TableHead
            sx={{
              backgroundColor: "#DCDCDC",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            <TableRow style={{ whiteSpace: "nowrap" }}>
              <TableCell>No.</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>District</TableCell>
              {/* <TableCell>Target/Stock(%)</TableCell> */}
              <TableCell>Sales Target / Achievement (Rs)</TableCell>
              <TableCell>Stock Target / Achievement (Rs)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData && paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                  <TableCell>{row.username}</TableCell>
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
                  <TableCell>{row.district}</TableCell>

                  {/* <TableCell>
                    <Box display="flex" alignItems="center" justifyContent="center">
                      {renderCircularProgress(
                        row.salesAchievement?.monthlyDetails?.[0]?.achievementAmountPercent || 0
                      )}
                      {renderCircularProgress(
                        row.salesAchievement?.monthlyDetails?.[0]?.StockAchievementPercent || 0
                      )}
                    </Box>
                  </TableCell> */}

                  {/* Sales Target / Achievement */}
                  <TableCell>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {new Intl.NumberFormat("en-IN").format(
                        row.salesAchievement?.monthlyDetails?.[0]
                          ?.MonthlyTargetAmount || 0
                      )}
                      <span style={{ fontSize: "1.5em", margin: "0 3px" }}>
                        /
                      </span>
                      {new Intl.NumberFormat("en-IN").format(
                        row.salesAchievement?.monthlyDetails?.[0]
                          ?.AchievementAmount || 0
                      )}
                    </div>
                  </TableCell>

                  {/* Stock QTY / Achievement QTY */}
                  <TableCell>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {new Intl.NumberFormat("en-IN").format(
                        row.salesAchievement?.monthlyDetails?.[0]
                          ?.StockTarget || 0
                      )}
                      <span style={{ fontSize: "1.5em", margin: "0 3px" }}>
                        /
                      </span>
                      {new Intl.NumberFormat("en-IN").format(
                        row.salesAchievement?.monthlyDetails?.[0]
                          ?.StockAchievement || 0
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : showNoDataMessage ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  🚫 No Members Available
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ marginTop: "10px" }}>
        {renderPagination(page, setPage, salesData.length)}
      </div>
    </Box>
  );
}
