import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Avatar,
  Box,
  CircularProgress,
} from "@mui/material";
import { useSelector } from "react-redux";
import SearchBox from "../../search-box/SearchUser";
import { API_END_POINT_IMG } from "../../constants/ApiConstant";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TargetTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date()); // Default to current month
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  const imageBaseURL = `${API_END_POINT_IMG}/uploads/`;
  const { users } = useSelector((state) => state.users);
  const userId = users?.id;

  // Generate selectedMonthYear format (e.g., "2024-07")
  const selectedMonthYear = `${selectedDate.getFullYear()}-${String(
    selectedDate.getMonth() + 1
  ).padStart(2, "0")}`;

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return console.error("Token not found");

      try {
        const response = await axios.get(
          `${API_END_POINT}/user_sales_detail/getLowHierarchySalesDetails/${userId}/${selectedMonthYear}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("API Response:", response.data); // Debugging
        if (response.data.success) {
          setData(response.data.result);
          const filtered = response.data.result.filter(
            (item) =>
              parseFloat(item.monthlyDetails.achievementAmountPercent) >= 50
          );

          setFilteredData(filtered);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, selectedMonthYear]);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredData(
      data.filter((item) => item.full_name.toLowerCase().includes(query))
    );
  };

  const filterAchieved = () => {
    const filtered = data.filter(
      (item) => parseFloat(item.monthlyDetails.achievementAmountPercent) >= 50
    );
    setFilteredData(filtered);
  };

  const filterNotAchieved = () => {
    const filtered = data.filter(
      (item) => parseFloat(item.monthlyDetails.achievementAmountPercent) < 50
    );
    setFilteredData(filtered);
  };

  const formatNumber = (number) =>
    new Intl.NumberFormat("en-IN").format(number);

  if (loading) return <CircularProgress />;

  const renderCircularProgress = (percent) => {
    const color = getColor(percent);

    return (
      <Box position="relative" display="inline-flex" mr={2}>
        <CircularProgress
          variant="determinate"
          value={100}
          size={80}
          thickness={5}
          style={{ color: "#e0e0e0" }}
        />
        <CircularProgress
          variant="determinate"
          value={percent}
          size={80}
          thickness={5}
          style={{ position: "absolute", color: color }}
        />
        <Box
          position="absolute"
          top="50%"
          left="50%"
          sx={{ transform: "translate(-50%, -50%)" }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ fontSize: "1.08rem !important", color: "primary" }}
          >
            {`${(parseFloat(percent) || 0).toFixed(2)}%`}
          </Typography>
        </Box>
      </Box>
    );
  };

  const getColor = (percent) => {
    if (percent >= 75) return "green";
    if (percent >= 50) return "orange";
    return "red";
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        Current Month Sales Target
      </Typography>

      {/* Search Box */}
      <Box sx={{ width: "100%", marginBottom: 2 }}>
        <SearchBox value={searchQuery} onSearchChange={handleSearchChange} />
      </Box>

      {/* Buttons & Date Picker */}
      <Box
        sx={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Buttons on the Left */}
        <Box>
          <Button
            variant="contained"
            color="success"
            onClick={filterAchieved}
            sx={{ marginRight: "10px" }}
          >
            Target Achieved (50% & Above)
          </Button>
          <Button variant="contained" color="error" onClick={filterNotAchieved}>
            Target Not Achieved (50% & Below)
          </Button>
        </Box>

        {/* DatePicker on the Right */}
        <Box>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            className="date-picker-input"
            style={{ width: "100%", maxWidth: "200px" }}
          />
        </Box>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#DCDCDC" }}>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>Role</TableCell>
              {/* <TableCell>Month/Year</TableCell> */}
              <TableCell>Total Monthly Target</TableCell>
              <TableCell>Achievement Amount</TableCell>
              <TableCell>Pending Amount</TableCell>
              <TableCell>Sales Achievement(%)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <TableRow key={item.user_id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar
                        src={
                          item?.image
                            ? `${imageBaseURL}${item.image}`
                            : "/path/to/default-image.jpg"
                        }
                        sx={{ width: 40, height: 40 }}
                      />
                      <Typography sx={{ marginLeft: "10px" }}>
                        {item.full_name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {item.monthlyDetails?.roleName || "N/A"}
                  </TableCell>
                  {/* <TableCell>
                    {item.monthlyDetails?.month && item.monthlyDetails?.year
                      ? `${item.monthlyDetails.month} ${item.monthlyDetails.year}`
                      : "N/A"}
                  </TableCell> */}

                  <TableCell>
                    {formatNumber(item.monthlyDetails?.totalMonthlyTarget || 0)}
                  </TableCell>
                  <TableCell>
                    {formatNumber(
                      item.monthlyDetails?.totalAchievementAmount || 0
                    )}
                  </TableCell>
                  <TableCell>
                    {formatNumber(item.monthlyDetails?.pendingAmount || 0)}
                  </TableCell>
                  <TableCell>
                    {renderCircularProgress(
                      item.monthlyDetails?.achievementAmountPercent || 0
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TargetTable;
