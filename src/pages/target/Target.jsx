import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  LinearProgress,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const TargetPage = () => {
  const [targetData, setTargetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const navigate = useNavigate();
  const { users } = useSelector((state) => state.users);
  const userId = users?.id;
  const roleName = users?.role_name;
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  const getMonthYear = (date) => ({
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  });

  // Fetch target data whenever user, role, or the selected month/year changes.
  const fetchTargetData = async (month, year) => {
    setLoading(true);
    setErrorMsg("");
    const token = localStorage.getItem("token");

    if (!token) {
      setErrorMsg("Token not found");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${API_END_POINT}/user_sales_detail/sales_achievementWeb/${roleName}/${userId}?month=${month}&year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { success, monthlyDetails } = response.data;
      if (success && monthlyDetails) {
        setTargetData(monthlyDetails);
      } else {
        setErrorMsg("No data available");
      }
    } catch (error) {
      console.error("Error fetching target data", error);
      setErrorMsg("Error fetching target data");
    } finally {
      setLoading(false);
    }
  };
  // Trigger data fetch when user/role or selectedMonth/selectedYear changes.
  useEffect(() => {
    if (userId && roleName && selectedDate) {
      const { month, year } = getMonthYear(selectedDate);
      fetchTargetData(month, year);
    }
  }, [userId, roleName, selectedDate]);

  // List of months and years for dropdowns
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  // If loading or error
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (errorMsg) {
    return (
      <Typography color="error" sx={{ textAlign: "center", mt: 4 }}>
        {errorMsg}
      </Typography>
    );
  }

  if (!targetData) {
    return <Typography>No data available</Typography>;
  }

  // Data from API (assuming a single object for the given month)
  const data = targetData;

  // Sales Doughnut Data
  const achievementPercentage = parseFloat(data.achievementAmountPercent);
  const doughnutData = {
    labels: ["Achieved", "Pending"],
    datasets: [
      {
        data: [achievementPercentage, 100 - achievementPercentage],
        backgroundColor: [
          achievementPercentage >= 75
            ? "#4CAF50" // Green
            : achievementPercentage >= 50
            ? "#FFC107" // Amber
            : "#FF7043", // Red
          "#E0E0E0", // Light grey for pending
        ],
        hoverBackgroundColor: [
          achievementPercentage >= 75
            ? "#388E3C"
            : achievementPercentage >= 50
            ? "#FFB300"
            : "#E64A19",
          "#BDBDBD",
        ],
      },
    ],
  };

  const doughnutOptions = {
    cutout: "70%",
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}%`;
          },
        },
      },
    },
  };

  // Stock Doughnut Data
  const stockAchievementPercentage = parseFloat(data.StockAchievementPercent);
  const stockDoughnutData = {
    labels: ["Achieved", "Pending"],
    datasets: [
      {
        data: [stockAchievementPercentage, 100 - stockAchievementPercentage],
        backgroundColor: [
          stockAchievementPercentage >= 75
            ? "#4CAF50"
            : stockAchievementPercentage >= 50
            ? "#FFC107"
            : "#FF7043",
          "#E0E0E0",
        ],
        hoverBackgroundColor: [
          stockAchievementPercentage >= 75
            ? "#388E3C"
            : stockAchievementPercentage >= 50
            ? "#FFB300"
            : "#E64A19",
          "#BDBDBD",
        ],
      },
    ],
  };

  const stockDoughnutOption = {
    cutout: "70%",
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}%`;
          },
        },
      },
    },
  };

  const handleViewMembersTarget = () => {
    navigate("view-member-targets");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h6"
        sx={{ mb: 3, color: "#989FA9", fontSize: "1rem" }}
      >
        Sales-Target Report
      </Typography>

      {/* {users?.role_name !== "Distributor" && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleViewMembersTarget}
            style={{
              backgroundColor: "#28a745",
              color: "white",
              fontWeight: "bold",
              borderRadius: "5px",
            }}
          >
            View Members Target
            </Button>
        </Box>
      )} */}

      {/* Dropdown Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="MMMM yyyy"
          showMonthYearPicker
          className="date-picker-input"
        />
      </Box>

      {/* Main Card */}
      <Card elevation={3} sx={{ p: 2 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              alignItems: "stretch",
            }}
          >
            {/* Left Side: Sales Target */}
            <Box sx={{ flex: 1, p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontSize: "20px",
                      fontFamily: '"Inter500", "Roboto", sans-serif',
                      color: "#232428",
                      marginBottom: "10px",
                    }}
                  >
                    Sales Target Amount
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ color: "black", fontSize: "1.2rem" }}
                  >
                    Rs.{" "}
                    {new Intl.NumberFormat("en-IN").format(
                      Number(data.MonthlyTargetAmount) || 0
                    )}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    ● Achieved: Rs.{" "}
                    {new Intl.NumberFormat("en-IN").format(
                      Number(data.AchievementAmount) || 0
                    )}
                  </Typography>
                  <Typography variant="body2" color="error.main">
                    ● Pending: Rs.{" "}
                    {new Intl.NumberFormat("en-IN").format(
                      Number(data.pendingAmount) || 0
                    )}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ width: 140, height: 140 }}>
                    <Doughnut data={doughnutData} options={doughnutOptions} />
                  </Box>
                </Grid>
              </Grid>
              {/* Sales Progress */}
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{
                    fontSize: "0.85rem",
                    fontFamily: '"Inter500", "Roboto", sans-serif',
                    color: "#232428",
                    marginBottom: "10px",
                  }}
                >
                  {months.find((m) => m.value === Number(selectedMonth))?.label}{" "}
                  {selectedYear} Sales Progress
                </Typography>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
                    {data.achievementAmountPercent}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={parseFloat(data.achievementAmountPercent)}
                  sx={{
                    height: 8,
                    backgroundColor: "#f5f5f5",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor:
                        parseFloat(data.achievementAmountPercent) >= 75
                          ? "#4CAF50"
                          : parseFloat(data.achievementAmountPercent) >= 50
                          ? "#FFC107"
                          : "#FF7043",
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Divider Between Sales and Stock */}
            <Divider
              orientation="vertical"
              flexItem
              sx={{ display: { xs: "none", md: "block" } }}
            />

            {/* Right Side: Stock Target */}
            <Box sx={{ flex: 1, p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontSize: "20px",
                      fontFamily: '"Inter500", "Roboto", sans-serif',
                      color: "#232428",
                      marginBottom: "10px",
                    }}
                  >
                    Stock Target Amount
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ color: "black", fontSize: "1.2rem" }}
                  >
                    Rs.{" "}
                    {new Intl.NumberFormat("en-IN").format(
                      Number(data.StockTarget) || 0
                    )}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    ● Achieved:{" "}
                    {new Intl.NumberFormat("en-IN").format(
                      Number(data.StockAchievement) || 0
                    )}
                  </Typography>
                  <Typography variant="body2" color="error.main">
                    ● Pending:{" "}
                    {new Intl.NumberFormat("en-IN").format(
                      Number(data.PendingStockTarget) || 0
                    )}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ width: 140, height: 140 }}>
                    <Doughnut
                      data={stockDoughnutData}
                      options={stockDoughnutOption}
                    />
                  </Box>
                </Grid>
              </Grid>
              {/* Stock Progress */}
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{
                    fontSize: "0.85rem",
                    fontFamily: '"Inter500", "Roboto", sans-serif',
                    color: "#232428",
                    marginBottom: "10px",
                  }}
                >
                  {months.find((m) => m.value === Number(selectedMonth))?.label}{" "}
                  {selectedYear} Stock Progress
                </Typography>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
                    {data.StockAchievementPercent}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={parseFloat(data.StockAchievementPercent)}
                  sx={{
                    height: 8,
                    backgroundColor: "#f5f5f5",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor:
                        parseFloat(data.StockAchievementPercent) >= 75
                          ? "#4CAF50"
                          : parseFloat(data.StockAchievementPercent) >= 50
                          ? "#FFC107"
                          : "#FF7043",
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TargetPage;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Typography,
//   Box,
//   Grid,
//   Card,
//   CardContent,
//   Button,
//   LinearProgress,
//   CircularProgress,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
// } from "@mui/material";
// import { Doughnut } from "react-chartjs-2";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// const TargetPage = () => {
//   const [targetData, setTargetData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedMonth, setSelectedMonth] = useState("");
//   const [selectedYear, setSelectedYear] = useState("");
//   const [errorMsg, setErrorMsg] = useState("");

//   const navigate = useNavigate();

//   const { users } = useSelector((state) => state.users);
//   const userId = users?.id;
//   const roleName = users?.role_name;
//   const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

//   // Helper to get current month and year if none is selected.
//   const getCurrentMonthYear = () => {
//     const now = new Date();
//     return {
//       month: now.getMonth() + 1, // JavaScript months are 0-indexed
//       year: now.getFullYear(),
//     };
//   };

//   // When component mounts, set the dropdowns to current month and year if they are empty.
//   useEffect(() => {
//     if (!selectedMonth || !selectedYear) {
//       const { month, year } = getCurrentMonthYear();
//       setSelectedMonth(month);
//       setSelectedYear(year);
//     }
//   }, []);

//   // Fetch target data whenever user, role, or the selected month/year changes.
//   const fetchTargetData = async (month, year) => {
//     setLoading(true);
//     setErrorMsg("");
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setErrorMsg("Token not found");
//       setLoading(false);
//       return;
//     }

//     try {
//       // Pass the month and year as query parameters.
//       const response = await axios.get(
//         `${API_END_POINT}/user_sales_detail/sales_achievementWeb/${roleName}/${userId}?month=${month}&year=${year}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const { success, monthlyDetails } = response.data;
//       if (success && monthlyDetails) {
//         setTargetData(monthlyDetails);
//       } else {
//         setErrorMsg("No data available");
//       }
//     } catch (error) {
//       console.error("Error fetching target data", error);
//       setErrorMsg("Error fetching target data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Trigger data fetch when user/role or selectedMonth/selectedYear changes.
//   useEffect(() => {
//     if (userId && roleName && selectedMonth && selectedYear) {
//       fetchTargetData(selectedMonth, selectedYear);
//     }
//   }, [userId, roleName, selectedMonth, selectedYear]);

//   // Dropdown change handlers.
//   const handleMonthChange = (event) => {
//     setSelectedMonth(event.target.value);
//   };

//   const handleYearChange = (event) => {
//     setSelectedYear(event.target.value);
//   };

//   // If loading or error
//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (errorMsg) {
//     return (
//       <Typography color="error" sx={{ textAlign: "center", mt: 4 }}>
//         {errorMsg}
//       </Typography>
//     );
//   }

//   if (!targetData) {
//     return <Typography>No data available</Typography>;
//   }

//   // Convert the target data if necessary.
//   // (Assuming your API now returns a single object for the given month)
//   const data = targetData;

//   // Sales Doughnut Data
//   const achievementPercentage = parseFloat(data.achievementAmountPercent);
//   const doughnutData = {
//     labels: ["Achieved", "Pending"],
//     datasets: [
//       {
//         data: [achievementPercentage, 100 - achievementPercentage],
//         backgroundColor: [
//           achievementPercentage >= 75
//             ? "#4CAF50" // Green
//             : achievementPercentage >= 50
//             ? "#FFC107" // Amber
//             : "#FF7043", // Red
//           "#E0E0E0", // Light grey for pending
//         ],
//         hoverBackgroundColor: [
//           achievementPercentage >= 75
//             ? "#388E3C"
//             : achievementPercentage >= 50
//             ? "#FFB300"
//             : "#E64A19",
//           "#BDBDBD",
//         ],
//       },
//     ],
//   };

//   const doughnutOptions = {
//     cutout: "70%",
//     plugins: {
//       tooltip: {
//         callbacks: {
//           label: function (tooltipItem) {
//             return `${tooltipItem.label}: ${tooltipItem.raw}%`;
//           },
//         },
//       },
//     },
//   };

//   // Stock Doughnut Data
//   const stockAchievementPercentage = parseFloat(data.StockAchievementPercent);
//   const stockDoughnutData = {
//     labels: ["Achieved", "Pending"],
//     datasets: [
//       {
//         data: [stockAchievementPercentage, 100 - stockAchievementPercentage],
//         backgroundColor: [
//           stockAchievementPercentage >= 75
//             ? "#4CAF50"
//             : stockAchievementPercentage >= 50
//             ? "#FFC107"
//             : "#FF7043",
//           "#E0E0E0",
//         ],
//         hoverBackgroundColor: [
//           stockAchievementPercentage >= 75
//             ? "#388E3C"
//             : stockAchievementPercentage >= 50
//             ? "#FFB300"
//             : "#E64A19",
//           "#BDBDBD",
//         ],
//       },
//     ],
//   };

//   const stockDoughnutOption = {
//     cutout: "70%",
//     plugins: {
//       tooltip: {
//         callbacks: {
//           label: function (tooltipItem) {
//             return `${tooltipItem.label}: ${tooltipItem.raw}%`;
//           },
//         },
//       },
//     },
//   };

//   const handleViewMembersTarget = () => {
//     navigate("view-member-targets");
//   };

//   // List of months and years (for the dropdowns)
//   const months = [
//     { value: 1, label: "January" },
//     { value: 2, label: "February" },
//     { value: 3, label: "March" },
//     { value: 4, label: "April" },
//     { value: 5, label: "May" },
//     { value: 6, label: "June" },
//     { value: 7, label: "July" },
//     { value: 8, label: "August" },
//     { value: 9, label: "September" },
//     { value: 10, label: "October" },
//     { value: 11, label: "November" },
//     { value: 12, label: "December" },
//   ];

//   // You can build a list of years as needed. For example, this creates an array from 2022 to current year + 1.
//   const currentYear = new Date().getFullYear();
//   const years = [];
//   for (let y = 2022; y <= currentYear + 1; y++) {
//     years.push(y);
//   }

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h6" sx={{ mb: 3, color: "#989FA9" }}>
//         Sales-Target Report
//       </Typography>

//       {users?.role_name !== "Distributor" && (
//         <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
//           <Button
//             variant="contained"
//             onClick={handleViewMembersTarget}
//             style={{ backgroundColor: "#28a745", color: "white" }}
//           >
//             View Members Target
//           </Button>
//         </Box>
//       )}

//       {/* Dropdown Filters */}
//       <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
//         <FormControl sx={{ minWidth: 120 }}>
//           <InputLabel id="select-month-label">Month</InputLabel>
//           <Select
//             labelId="select-month-label"
//             value={selectedMonth}
//             label="Month"
//             onChange={handleMonthChange}
//           >
//             {months.map((m) => (
//               <MenuItem key={m.value} value={m.value}>
//                 {m.label}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//         <FormControl sx={{ minWidth: 120 }}>
//           <InputLabel id="select-year-label">Year</InputLabel>
//           <Select
//             labelId="select-year-label"
//             value={selectedYear}
//             label="Year"
//             onChange={handleYearChange}
//           >
//             {years.map((yr) => (
//               <MenuItem key={yr} value={yr}>
//                 {yr}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </Box>

//       {/* Main Card */}
//       <Card elevation={3} sx={{ p: 3 }}>
//         <CardContent>
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: { xs: "column", md: "row" },
//               gap: 3,
//               justifyContent: "space-between",
//               alignItems: "flex-start",
//             }}
//           >
//             {/* Left Side: Sales Target */}
//             <Box sx={{ flex: 1, p: 2 }}>
//               <Grid container spacing={2}>
//                 <Grid item xs={12} sm={6}>
//                   <Typography variant="h5" gutterBottom>
//                     Sales Target Amount - Sold
//                   </Typography>
//                   <Typography variant="h4" sx={{ color: "black" }}>
//                     Rs.{" "}
//                     {new Intl.NumberFormat("en-IN").format(
//                       Number(data.MonthlyTargetAmount) || 0
//                     )}
//                   </Typography>
//                   <Typography variant="body1" color="success.main">
//                     ● Target Achieved: Rs.{" "}
//                     {new Intl.NumberFormat("en-IN").format(
//                       Number(data.AchievementAmount) || 0
//                     )}
//                   </Typography>
//                   <Typography variant="body1" color="error.main">
//                     ● Target Pending: Rs.{" "}
//                     {new Intl.NumberFormat("en-IN").format(
//                       Number(data.pendingAmount) || 0
//                     )}
//                   </Typography>
//                 </Grid>
//                 <Grid
//                   item
//                   xs={12}
//                   sm={6}
//                   sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
//                 >
//                   <Box sx={{ width: 150, height: 150 }}>
//                     <Doughnut data={doughnutData} options={doughnutOptions} />
//                   </Box>
//                 </Grid>
//                 {/*  */}
//                           {/* Progress Bars Section */}
//           <Box sx={{ mt: 3 }}>
//             <Typography variant="h5" gutterBottom>
//               Sales Target Achievement Progress
//             </Typography>
//             <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
//               <Typography variant="body2">
//                 {months.find((m) => m.value === Number(selectedMonth))?.label} {selectedYear}
//               </Typography>
//               <Typography variant="body2">
//                 {data.achievementAmountPercent}%
//               </Typography>
//             </Box>
//             <LinearProgress
//               variant="determinate"
//               value={parseFloat(data.achievementAmountPercent)}
//               sx={{
//                 height: 8,
//                 backgroundColor: "#f5f5f5",
//                 "& .MuiLinearProgress-bar": {
//                   backgroundColor:
//                     parseFloat(data.achievementAmountPercent) >= 75
//                       ? "#4CAF50"
//                       : parseFloat(data.achievementAmountPercent) >= 50
//                       ? "#FFC107"
//                       : "#FF7043",
//                 },
//               }}
//             />
//           </Box>
//               </Grid>
//             </Box>

//             {/* Right Side: Stock Target */}
//             <Box sx={{ flex: 1, p: 2 }}>
//               <Grid container spacing={2}>
//                 <Grid item xs={12} sm={6}>
//                   <Typography variant="h5" gutterBottom>
//                   Stock Target Amount - Recived
//                   </Typography>
//                   <Typography variant="h4" sx={{ color: "black" }}>
//                     Rs.{" "}
//                     {new Intl.NumberFormat("en-IN").format(
//                       Number(data.StockTarget) || 0
//                     )}
//                   </Typography>
//                   <Typography variant="body1" color="success.main">
//                     ● Stock Achieved:{" "}
//                     {new Intl.NumberFormat("en-IN").format(
//                       Number(data.StockAchievement) || 0
//                     )}
//                   </Typography>
//                   <Typography variant="body1" color="error.main">
//                     ● Stock Pending:{" "}
//                     {new Intl.NumberFormat("en-IN").format(
//                       Number(data.PendingStockTarget) || 0
//                     )}
//                   </Typography>
//                 </Grid>
//                 <Grid
//                   item
//                   xs={12}
//                   sm={6}
//                   sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
//                 >
//                   <Box sx={{ width: 150, height: 150 }}>
//                     <Doughnut data={stockDoughnutData} options={stockDoughnutOption} />
//                   </Box>
//                 </Grid>
//                 {/*  */}
//                 <Box sx={{ mt: 3 }}>
//             <Typography variant="h5" gutterBottom>
//               Stock Target Achievement Progress
//             </Typography>
//             <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
//               <Typography variant="body2">
//                 {months.find((m) => m.value === Number(selectedMonth))?.label} {selectedYear}
//               </Typography>
//               <Typography variant="body2">
//                 {data.StockAchievementPercent}%
//               </Typography>
//             </Box>
//             <LinearProgress
//               variant="determinate"
//               value={parseFloat(data.StockAchievementPercent)}
//               sx={{
//                 height: 8,
//                 backgroundColor: "#f5f5f5",
//                 "& .MuiLinearProgress-bar": {
//                   backgroundColor:
//                     parseFloat(data.StockAchievementPercent) >= 75
//                       ? "#4CAF50"
//                       : parseFloat(data.StockAchievementPercent) >= 50
//                       ? "#FFC107"
//                       : "#FF7043",
//                 },
//               }}
//             />
//           </Box>
//               </Grid>
//             </Box>
//           </Box>

//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default TargetPage;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Typography,
//   Box,
//   Grid,
//   Card,
//   CardContent,
//   Button,
//   LinearProgress,
//   CircularProgress,
// } from "@mui/material";
// import { Doughnut } from "react-chartjs-2";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// const TargetPage = () => {
//   const [targetData, setTargetData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const { users } = useSelector((state) => state.users);
//   const userId = users?.id;
//   const roleName = users?.role_name;
//   const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

//   const fetchTargetData = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       console.error("Token not found");
//       return;
//     }

//     try {
//       const response = await axios.get(
//         `${API_END_POINT}/user_sales_detail/sales_achievementWeb/${roleName}/${userId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const { success, monthlyDetails } = response.data;
//       if (success && monthlyDetails.length > 0) {
//         setTargetData(monthlyDetails[0]);
//       } else {
//         console.error("No data available");
//       }
//     } catch (error) {
//       console.error("Error fetching target data", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (userId && roleName) {
//       fetchTargetData();
//     }
//   }, [userId, roleName]);

//   if (loading) {
//     return <CircularProgress />;
//   }

//   if (!targetData) {
//     return <Typography>No data available</Typography>;
//   }

//   // Calculate the achievement percentage
//   const achievementPercentage = parseFloat(targetData.achievementAmountPercent);

//   // Calculate the total (AchievementAmountPercent + UnachievementAmountPercent should be 100%)
//   const achievementAmountPercent = targetData.achievementAmountPercent;
//   const unachievementAmountPercent = targetData.unachievementAmountPercent;

//   const doughnutData = {
//     labels: ["Achieved", "Pending"],
//     datasets: [
//       {
//         data: [achievementAmountPercent, unachievementAmountPercent],  // Use percentages for the chart
//         backgroundColor: [
//           // Set color based on achievement percentage
//           achievementPercentage >= 75
//             ? "#4CAF50" // Green if >= 75%
//             : achievementPercentage >= 50
//               ? "#FFC107" // Amber if between 50% and 74%
//               : "#FF7043", // Red if < 50%

//           // Set pending color as light grey
//           "#E0E0E0",  // Light grey for pending stock
//         ],
//         hoverBackgroundColor: [
//           // Set hover color for achievement portion
//           achievementPercentage >= 75
//             ? "#388E3C" // Darker green for hover
//             : achievementPercentage >= 50
//               ? "#FFB300" // Darker amber for hover
//               : "#E64A19", // Darker red for hover

//           // Set hover color for pending portion (always light grey hover)
//           "#BDBDBD",  // Darker grey for hover
//         ],
//       },
//     ],
//   };

//   const doughnutOptions = {
//     cutout: "70%",
//     plugins: {
//       tooltip: {
//         callbacks: {
//           label: function (tooltipItem) {
//             return `${tooltipItem.label}: ${tooltipItem.raw}%`;
//           },
//         },
//       },
//     },
//   };

//   /////

//   const stockachievementPercentage = parseFloat(targetData.StockAchievementPercent);
//   const StockAchievementPercent = parseFloat(targetData.StockAchievementPercent);
//   const StockUnachievementPercent = parseFloat(targetData.StockUnachievementPercent);

//   // Doughnut chart data
//   const stockDoughnutData = {
//     labels: ["Achieved", "Pending"],
//     datasets: [
//       {
//         data: [StockAchievementPercent, StockUnachievementPercent],
//         backgroundColor: [
//           // Achieved portion color based on percentage
//           stockachievementPercentage >= 75
//             ? "#4CAF50" // Green for >= 75%
//             : stockachievementPercentage >= 50
//               ? "#FFC107" // Amber for 50%-74%
//               : "#FF7043", // Red for < 50%,

//           // Pending portion is always grey
//           "#E0E0E0",
//         ],
//         hoverBackgroundColor: [
//           // Hover color for achieved portion
//           stockachievementPercentage >= 75
//             ? "#388E3C" // Dark green for >= 75%
//             : stockachievementPercentage >= 50
//               ? "#FFB300" // Dark amber for 50%-74%
//               : "#E64A19", // Dark red for < 50%,

//           // Hover color for pending portion
//           "#BDBDBD", // Dark grey
//         ],
//       },
//     ],
//   };

//   // Doughnut chart options
//   const stockDoughnutOption = {
//     cutout: "70%", // Doughnut appearance
//     plugins: {
//       tooltip: {
//         callbacks: {
//           label: function (tooltipItem) {
//             return `${tooltipItem.label}: ${tooltipItem.raw}%`; // Correctly using backticks for string interpolation
//           },
//         },
//       },
//     },
//   };

//   const handleViewMembersTarget = () => {
//     navigate("view-member-targets");
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h6" sx={{ mb: 3, color: "#989FA9" }}>
//         Sales-Target Report
//       </Typography>

//       {users?.role_name !== "Distributor" && (
//         <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
//           <Button
//             variant="contained"
//             onClick={handleViewMembersTarget}
//             style={{ backgroundColor: "#28a745", color: "white" }}
//           >
//             View Members Target
//           </Button>
//         </Box>
//       )}

//       {/* Main Card */}
//       <Card elevation={3} sx={{ p: 3 }}>
//         <CardContent>
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: { xs: "column", md: "row" },
//               gap: 3,
//               justifyContent: "space-between",
//               alignItems: "flex-start",
//             }}
//           >
//             {/* Left Side: This Month */}
//             <Box
//               sx={{
//                 flex: 1,
//                 borderRadius: "8px",
//                 padding: "16px",
//               }}
//             >
//               <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
//                 {/* First Section */}
//                 <Grid sx={{ display: "flex", flex: 1, gap: 2 }}>
//                   <Box>
//                     <Typography variant="h5" gutterBottom>
//                       This Month
//                     </Typography>
//                     <Typography variant="subtitle1" gutterBottom>
//                       Sales Target Amount
//                     </Typography>
//                     <Typography variant="h4" sx={{ color: "black" }}>
//                       Rs. {new Intl.NumberFormat('en-IN').format(Number(targetData.MonthlyTargetAmount) || 0)}
//                     </Typography>
//                     <Typography variant="body1" color="success.main">
//                       ● Target Achieved: Rs. {new Intl.NumberFormat('en-IN').format(Number(targetData.AchievementAmount) || 0)}
//                     </Typography>
//                     <Typography variant="body1" color="error.main">
//                       ● Target Pending: Rs. {new Intl.NumberFormat('en-IN').format(Number(targetData.pendingAmount) || 0)}
//                     </Typography>
//                   </Box>

//                   <Box sx={{ width: 150, height: 150, mx: "auto", mt: 2 }}>
//                     <Doughnut data={doughnutData} options={doughnutOptions} />
//                   </Box>
//                 </Grid>

//                 {/* Second Section */}
//                 <Grid sx={{ display: "flex", flex: 1, gap: 2 }}>
//                   <Box>

//                     <Typography variant="subtitle1" gutterBottom>
//                       Stock Target
//                     </Typography>
//                     <Typography variant="h4" sx={{ color: "black" }}>
//                       Qty. {new Intl.NumberFormat('en-IN').format(Number(targetData.StockTarget) || 0)}
//                     </Typography>
//                     <Typography variant="body1" color="success.main">
//                       ● Stock Achieved: {new Intl.NumberFormat('en-IN').format(Number(targetData.StockAchievement) || 0)}
//                     </Typography>
//                     <Typography variant="body1" color="error.main">
//                       ● Stock Pending:  {new Intl.NumberFormat('en-IN').format(Number(targetData.PendingStockTarget) || 0)}
//                     </Typography>
//                   </Box>

//                   <Box sx={{ width: 150, height: 150, mx: "auto", mt: 2 }}>
//                     <Doughnut data={stockDoughnutData} options={stockDoughnutOption} />
//                   </Box>
//                 </Grid>
//               </Box>
//               <Box mt={5}>
//                 <Typography variant="caption">
//                   <Box component="span" color="success.main">
//                     ● Done 100%
//                   </Box>{" "}
//                   &nbsp;
//                   <Box component="span" color="warning.main">
//                     ● 75%-50%
//                   </Box>{" "}
//                   &nbsp;
//                   <Box component="span" color="error.main">
//                     ● 50%-0%
//                   </Box>
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Right Side: Target History */}
//             <Box
//               sx={{
//                 flex: 1,
//                 borderRadius: "8px",
//                 padding: "16px",
//                 gap: "20px",
//               }}
//             >
//               <Typography variant="h5" gutterBottom>
//                 Sales Target Achievement
//               </Typography>
//               <Box sx={{ mt: 2 }}>
//                 {/* Target Achievement Progress */}
//                 <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
//                   <Typography variant="body2">
//                     {targetData.month} {targetData.year}
//                   </Typography>
//                   <Typography variant="body2">
//                     {targetData.achievementAmountPercent}%
//                   </Typography>
//                 </Box>
//                 <LinearProgress
//                   variant="determinate"
//                   value={achievementPercentage}
//                   sx={{
//                     height: 8,
//                     backgroundColor: "#f5f5f5",
//                     "& .MuiLinearProgress-bar": {
//                       backgroundColor:
//                         achievementPercentage >= 75
//                           ? "#4CAF50"
//                           : achievementPercentage >= 50
//                             ? "#FFC107"
//                             : "#FF7043",
//                     },
//                   }}
//                 />
//               </Box>

//               {/* Add a gap or margin to visually separate the two sections */}
//               <Box sx={{ mt: 3 }}>
//                 <Typography variant="h5" gutterBottom>
//                   Stock Target Achievement
//                 </Typography>
//                 <Box sx={{ mt: 2 }}>
//                   {/* Target Achievement Progress */}
//                   <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
//                     <Typography variant="body2">
//                       {targetData.month} {targetData.year}
//                     </Typography>
//                     <Typography variant="body2">
//                       {targetData.StockAchievementPercent}%
//                     </Typography>
//                   </Box>
//                   <LinearProgress
//                     variant="determinate"
//                     value={stockachievementPercentage}
//                     sx={{
//                       height: 8,
//                       backgroundColor: "#f5f5f5",
//                       "& .MuiLinearProgress-bar": {
//                         backgroundColor:
//                           stockachievementPercentage >= 75
//                             ? "#4CAF50"
//                             : stockachievementPercentage >= 50
//                               ? "#FFC107"
//                               : "#FF7043",
//                       },
//                     }}
//                   />
//                 </Box>
//               </Box>
//             </Box>
//           </Box>
//         </CardContent>
//       </Card>
//     </Box>

//   );
// };

// export default TargetPage;

// //
