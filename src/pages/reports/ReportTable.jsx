// import React, { useState, useEffect } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Select,
//   MenuItem,
//   Box,
//   Avatar,
//   Typography,
//   Button,
//   CircularProgress,
//   TextField,
//   Checkbox,
//   FormControlLabel,
//   FormGroup,
// } from "@mui/material";
// import { useSelector } from "react-redux";
// import { API_END_POINT_IMG } from "../../constants/ApiConstant";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { format } from "date-fns";

// export default function ReportTable() {
//   const [rows, setRows] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [roleFilter, setRoleFilter] = useState("");
//   const [availableRoles, setAvailableRoles] = useState([]);
//   const [areaFilter, setAreaFilter] = useState("");
//   const [areas, setAreas] = useState([]);
//   const { users } = useSelector((state) => state.users);
//   const userId = users?.id;
//   const userRole = users?.role_name;
//   const [page, setPage] = useState(0);
//   const [rowsPerPage] = useState(10);
//   const [isLoading, setIsLoading] = useState(true);
//   const [nameFilter, setNameFilter] = useState("");
//   const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;
//   const [showNoDataMessage, setShowNoDataMessage] = useState(false);
//   const [statusFilters, setStatusFilters] = useState({
//     active: false,
//     deleted: false,
//   });
//   const [selectedDate, setSelectedDate] = useState(new Date());

//   const handleStatusFilterChange = (event) => {
//     setStatusFilters({
//       ...statusFilters,
//       [event.target.name]: event.target.checked,
//     });
//   };

//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//     setPage(0);
//   };

//   useEffect(() => {
//     const fetchAreas = async () => {
//       try {
//         const response = await fetch(`${API_END_POINT}/user/${userId}`);
//         const data = await response.json();
//         const userAreas = [
//           ...(data.mdUsers || []).map((user) =>
//             user.district.trim().toLowerCase()
//           ),
//           ...(data.sdUsers || []).map((user) =>
//             user.district.trim().toLowerCase()
//           ),
//           ...(data.distributorUsers || []).map((user) =>
//             user.district.trim().toLowerCase()
//           ),
//           ...(data.adoUsers || []).map((user) =>
//             user.district.trim().toLowerCase()
//           ),
//         ];
//         setAreas([...new Set(userAreas)]);
//       } catch (error) {
//         console.error("Error fetching area data:", error);
//       }
//     };

//     if (userId) {
//       fetchAreas();
//     }
//   }, [userId]);

//   useEffect(() => {
//     if (userRole) {
//       switch (userRole) {
//         case "Admin":
//           setAvailableRoles([
//             "Area Development Officer",
//             "Master Distributor",
//             "Super Distributor",
//             "Distributor",
//           ]);
//           break;
//         case "Area Development Officer":
//           setAvailableRoles([
//             "Master Distributor",
//             "Super Distributor",
//             "Distributor",
//           ]);
//           break;
//         case "Master Distributor":
//           setAvailableRoles(["Super Distributor", "Distributor"]);
//           break;
//         case "Super Distributor":
//           setAvailableRoles(["Distributor"]);
//           break;
//         default:
//           setAvailableRoles([]);
//           break;
//       }
//       setRoleFilter("");
//     }
//   }, [userRole]);

//   const fetchSalesAchievement = async (roleId, userId) => {
//     try {
//       const response = await fetch(
//         `${API_END_POINT}/user_sales_detail/sales_achievement/${roleId}/${userId}`
//       );
//       const data = await response.json();
      
//       // Ensure we always return an object with monthlyDetails array
//       return {
//         ...data,
//         monthlyDetails: data.monthlyDetails || []
//       };
//     } catch (error) {
//       console.error("Error fetching sales achievement data:", error);
//       // Return empty structure when there's an error
//       return {
//         success: false,
//         monthlyDetails: []
//       };
//     }
//   };

//   const getMonthlyDataForSelectedDate = (monthlyDetails, selectedDate) => {
//     if (!monthlyDetails || monthlyDetails.length === 0) {
//       // Return default values when no data exists
//       return {
//         MonthlyTargetAmount: 0,
//         AchievementAmount: 0,
//         pendingAmount: 0,
//         achievementAmountPercent: "0",
//         unachievementAmountPercent: "100",
//         StockTarget: 0,
//         StockAchievement: 0,
//         PendingStockTarget: 0,
//         StockAchievementPercent: "0",
//         StockUnachievementPercent: "100",
//         month: format(selectedDate, 'MMMM'),
//         year: selectedDate.getFullYear()
//       };
//     }

//     // Find data for the selected month/year
//     const selectedMonth = format(selectedDate, 'MMMM');
//     const selectedYear = selectedDate.getFullYear();
    
//     const matchingData = monthlyDetails.find(
//       detail => detail.month === selectedMonth && detail.year === selectedYear
//     );

//     // Return matching data or default values
//     return matchingData || {
//       MonthlyTargetAmount: 0,
//       AchievementAmount: 0,
//       pendingAmount: 0,
//       achievementAmountPercent: "0",
//       unachievementAmountPercent: "100",
//       StockTarget: 0,
//       StockAchievement: 0,
//       PendingStockTarget: 0,
//       StockAchievementPercent: "0",
//       StockUnachievementPercent: "100",
//       month: selectedMonth,
//       year: selectedYear
//     };
//   };

//   const fetchUserCounts = async () => {
//     try {
//       const response = await fetch(`${API_END_POINT}/user/reports/${userId}`);
//       const data = await response.json();
//       const users = [
//         ...(data.mdUsers || []),
//         ...(data.sdUsers || []),
//         ...(data.distributorUsers || []),
//         ...(data.adoUsers || []),
//       ];
//       setRows(users);
//       setFilteredData(users);
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     }
//   };

//   useEffect(() => {
//     if (userId) {
//       fetchUserCounts();
//     }
//   }, [userId]);

//   useEffect(() => {
//     const applyFilters = async () => {
//       setIsLoading(true);

//       // Show all data when neither checkbox is selected
//       let statusFiltered = rows;

//       // Apply status filters only if at least one checkbox is selected
//       if (statusFilters.active || statusFilters.deleted) {
//         statusFiltered = rows.filter((user) => {
//           if (statusFilters.active && statusFilters.deleted) {
//             return user.status === "Active" || user.status === "Deleted";
//           }
//           if (statusFilters.active) {
//             return user.status === "Active";
//           }
//           if (statusFilters.deleted) {
//             return user.status === "Deleted";
//           }
//           return false;
//         });
//       }

//       const filteredRows = statusFiltered.filter(
//         (user) =>
//           (roleFilter === "" || user.role_name === roleFilter) &&
//           (areaFilter === "" ||
//             user.district.trim().toLowerCase() ===
//               areaFilter.trim().toLowerCase()) &&
//           (nameFilter === "" ||
//             user.full_name.toLowerCase().includes(nameFilter.toLowerCase()))
//       );

//       const enrichedRows = await Promise.all(
//         filteredRows.map(async (user) => {
//           const salesAchievement = await fetchSalesAchievement(
//             user.role_name,
//             user.id
//           );

//           return {
//             ...user,
//             salesAchievement,
//           };
//         })
//       );

//       setFilteredData(enrichedRows);
//       setIsLoading(false);
//     };

//     if (rows.length > 0) {
//       applyFilters();
//     }
//   }, [statusFilters, roleFilter, areaFilter, nameFilter, rows, selectedDate]);

//   useEffect(() => {
//     fetchUserCounts();
//   }, []);

//   const handleFilterChange = () => {
//     setPage(0);
//   };

//   const handleSearchChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "role") {
//       setRoleFilter(value);
//       setPage(0);
//     } else if (name === "area") {
//       setAreaFilter(value);
//       setPage(0);
//     }
//   };

//   const handleSearchChangeName = (e) => {
//     const { value } = e.target;
//     setNameFilter(value);
//   };

//   const renderPagination = (page, setPage, totalRows) => (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "right",
//         alignItems: "center",
//         gap: "15px",
//       }}
//     >
//       <Button
//         onClick={() => setPage(page - 1)}
//         disabled={page === 0}
//         variant="outlined"
//       >
//         Previous
//       </Button>
//       <Typography
//         variant="body1"
//         style={{ minWidth: "60px", textAlign: "center" }}
//       >
//         Page {page + 1} of {Math.ceil(totalRows / rowsPerPage)}
//       </Typography>
//       <Button
//         onClick={() => setPage(page + 1)}
//         disabled={page >= Math.ceil(totalRows / rowsPerPage) - 1}
//         variant="outlined"
//       >
//         Next
//       </Button>
//     </div>
//   );

//   const paginatedData = filteredData.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage
//   );

//   const renderLoadingState = () => (
//     <TableRow>
//       <TableCell colSpan={9} align="center">
//         <CircularProgress />
//       </TableCell>
//     </TableRow>
//   );

//   useEffect(() => {
//     if (paginatedData && paginatedData.length === 0) {
//       const timer = setTimeout(() => {
//         setShowNoDataMessage(true);
//       }, 1 * 1000);

//       return () => clearTimeout(timer);
//     } else {
//       setShowNoDataMessage(false);
//     }
//   }, [paginatedData]);

//   return (
//     <Box p={3}>
//       <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
//         All Reports
//       </Typography>

//       <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
//         <TextField
//           label="Search Name"
//           variant="outlined"
//           name="name"
//           value={nameFilter}
//           onChange={handleSearchChangeName}
//           sx={{
//             borderRadius: "20px",
//             "& .MuiOutlinedInput-root": {
//               borderRadius: "20px",
//             },
//           }}
//         />
//       </Box>

//       <Box
//         display="flex"
//         alignItems="center"
//         justifyContent="space-between"
//         gap="20px"
//         mb={3}
//       >
//         {/* Left-aligned Dropdowns */}
//         <Box display="flex" gap="20px">
//           <Select
//             value={roleFilter}
//             onChange={(e) => handleSearchChange(e)}
//             displayEmpty
//             name="role"
//             sx={{
//               minWidth: 180,
//               borderColor: "white",
//               borderRadius: "20px",
//               "& .MuiOutlinedInput-root": {
//                 borderRadius: "20px",
//               },
//             }}
//           >
//             <MenuItem value="">Select All Role</MenuItem>
//             {availableRoles.map((role, index) => (
//               <MenuItem key={index} value={role}>
//                 {role}
//               </MenuItem>
//             ))}
//           </Select>

//           <Select
//             value={areaFilter}
//             onChange={(e) => handleSearchChange(e)}
//             displayEmpty
//             name="area"
//             sx={{
//               minWidth: 180,
//               borderRadius: "20px",
//               "& .MuiOutlinedInput-root": {
//                 borderRadius: "20px",
//               },
//             }}
//           >
//             <MenuItem value="">Select All Areas</MenuItem>
//             {areas
//               .slice()
//               .sort((a, b) => a.localeCompare(b))
//               .map((area) => (
//                 <MenuItem key={area} value={area}>
//                   {area.charAt(0).toUpperCase() + area.slice(1)}
//                 </MenuItem>
//               ))}
//           </Select>

//           <Box display="flex" justifyContent="center" flexGrow={1}>
//             <DatePicker
//               selected={selectedDate}
//               onChange={handleDateChange}
//               dateFormat="MMMM yyyy"
//               showMonthYearPicker
//               className="date-picker-input"
//               style={{
//                 width: "100%",
//                 maxWidth: "200px",
//                 padding: "10px",
//                 borderRadius: "20px",
//                 border: "1px solid #ced4da",
//               }}
//             />
//           </Box>
//         </Box>

//         {/* Right-aligned Checkboxes */}
//         <FormGroup row>
//           <FormControlLabel
//             control={
//               <Checkbox
//                 checked={statusFilters.active}
//                 onChange={handleStatusFilterChange}
//                 name="active"
//                 color="primary"
//               />
//             }
//             label="Active"
//           />
//           <FormControlLabel
//             control={
//               <Checkbox
//                 checked={statusFilters.deleted}
//                 onChange={handleStatusFilterChange}
//                 name="deleted"
//                 color="primary"
//               />
//             }
//             label="Dropped"
//           />
//         </FormGroup>
//       </Box>

//       <TableContainer
//         component={Paper}
//         sx={{ maxHeight: 500, overflowY: "auto" }}
//       >
//         <Table sx={{ minWidth: 650 }} aria-label="simple table">
//           <TableHead
//             sx={{ backgroundColor: "#DCDCDC", position: "sticky", top: 0 }}
//           >
//             <TableRow>
//               <TableCell sx={{ fontWeight: "bold" }}>No.</TableCell>
//               <TableCell sx={{ fontWeight: "bold" }}>Username</TableCell>
//               <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
//               <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
//               <TableCell sx={{ fontWeight: "bold" }}>District</TableCell>
//               <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
//               <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
//                 Sales Target/Achievement (Rs)
//               </TableCell>
//               <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
//                 Stock Target/Achievement (Rs)
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {isLoading ? (
//               renderLoadingState()
//             ) : paginatedData && paginatedData.length > 0 ? (
//               paginatedData.map((row, index) => {
//                 const monthlyData = getMonthlyDataForSelectedDate(
//                   row.salesAchievement?.monthlyDetails,
//                   selectedDate
//                 );

//                 return (
//                   <TableRow key={row.id} hover>
//                     <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
//                     <TableCell>
//                       <Box display="flex" alignItems="center">
//                         <Avatar
//                           alt={row.full_name}
//                           src={`${API_END_POINT_IMG}/uploads/${row.image}`}
//                           sx={{ width: 40, height: 40, marginRight: 2 }}
//                         />
//                         {row.username}
//                       </Box>
//                     </TableCell>
//                     <TableCell sx={{ whiteSpace: "nowrap" }}>
//                       {row.full_name}
//                     </TableCell>
//                     <TableCell sx={{ whiteSpace: "nowrap" }}>
//                       {row.role_name}
//                     </TableCell>
//                     <TableCell sx={{ whiteSpace: "nowrap" }}>
//                       {row.district}
//                     </TableCell>
//                     <TableCell>
//                       <Typography
//                         color={
//                           row.status === "Active"
//                             ? "success.main"
//                             : "error.main"
//                         }
//                         sx={{ fontWeight: "bold" }}
//                       >
//                         {row.status === "Deleted" ? "Dropped" : "Active"}
//                       </Typography>
//                     </TableCell>
//                     <TableCell sx={{ whiteSpace: "nowrap" }}>
//                       {new Intl.NumberFormat("en-IN").format(
//                         monthlyData.MonthlyTargetAmount || 0
//                       )}
//                       <span style={{ margin: "0 4px" }}>/</span>
//                       {new Intl.NumberFormat("en-IN").format(
//                         monthlyData.AchievementAmount || 0
//                       )}
                      
//                     </TableCell>
//                     <TableCell sx={{ whiteSpace: "nowrap" }}>
//                       {new Intl.NumberFormat("en-IN").format(
//                         monthlyData.StockTarget || 0
//                       )}
//                       <span style={{ margin: "0 4px" }}>/</span>
//                       {new Intl.NumberFormat("en-IN").format(
//                         monthlyData.StockAchievement || 0
//                       )}
                     
//                     </TableCell>
//                   </TableRow>
//                 );
//               })
//             ) : showNoDataMessage ? (
//               <TableRow>
//                 <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
//                   <Typography variant="body1" color="textSecondary">
//                     No data available
//                   </Typography>
//                 </TableCell>
//               </TableRow>
//             ) : null}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {filteredData.length > 0 && (
//         <Box mt={2}>{renderPagination(page, setPage, filteredData.length)}</Box>
//       )}
//     </Box>
//   );
// }






// import React, { useState, useEffect } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Select,
//   MenuItem,
//   Box,
//   Avatar,
//   Typography,
//   Button,
//   CircularProgress,
//   TextField,
//   Checkbox,
//   FormControlLabel,
//   FormGroup,
// } from "@mui/material";
// import { useSelector } from "react-redux";
// import { API_END_POINT_IMG } from "../../constants/ApiConstant";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { format } from "date-fns";

// export default function ReportTable() {
//   const [rows, setRows] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [roleFilter, setRoleFilter] = useState("");
//   const [availableRoles, setAvailableRoles] = useState([]);
//   const [areaFilter, setAreaFilter] = useState("");
//   const [areas, setAreas] = useState([]);
//   const { users } = useSelector((state) => state.users);
//   const userId = users?.id;
//   const userRole = users?.role_name;
//   const [page, setPage] = useState(0);
//   const [rowsPerPage] = useState(10);
//   const [isLoading, setIsLoading] = useState(true);
//   const [nameFilter, setNameFilter] = useState("");
//   const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;
//   const [statusFilters, setStatusFilters] = useState({
//     active: false,
//     deleted: false,
//   });
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [dataLoaded, setDataLoaded] = useState(false); // Track if initial data load is complete
//   const [fetchError, setFetchError] = useState(null); // Track fetch errors

//   const handleStatusFilterChange = (event) => {
//     setStatusFilters({
//       ...statusFilters,
//       [event.target.name]: event.target.checked,
//     });
//   };

//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//     setPage(0);
//   };

//   useEffect(() => {
//     const fetchAreas = async () => {
//       try {
//         const response = await fetch(`${API_END_POINT}/user/${userId}`);
//         const data = await response.json();
//         const userAreas = [
//           ...(data.mdUsers || []).map((user) =>
//             user.district.trim().toLowerCase()
//           ),
//           ...(data.sdUsers || []).map((user) =>
//             user.district.trim().toLowerCase()
//           ),
//           ...(data.distributorUsers || []).map((user) =>
//             user.district.trim().toLowerCase()
//           ),
//           ...(data.adoUsers || []).map((user) =>
//             user.district.trim().toLowerCase()
//           ),
//         ];
//         setAreas([...new Set(userAreas)]);
//       } catch (error) {
//         console.error("Error fetching area data:", error);
//       }
//     };

//     if (userId) {
//       fetchAreas();
//     }
//   }, [userId]);

//   useEffect(() => {
//     if (userRole) {
//       switch (userRole) {
//         case "Admin":
//           setAvailableRoles([
//             "Area Development Officer",
//             "Master Distributor",
//             "Super Distributor",
//             "Distributor",
//           ]);
//           break;
//         case "Area Development Officer":
//           setAvailableRoles([
//             "Master Distributor",
//             "Super Distributor",
//             "Distributor",
//           ]);
//           break;
//         case "Master Distributor":
//           setAvailableRoles(["Super Distributor", "Distributor"]);
//           break;
//         case "Super Distributor":
//           setAvailableRoles(["Distributor"]);
//           break;
//         default:
//           setAvailableRoles([]);
//           break;
//       }
//       setRoleFilter("");
//     }
//   }, [userRole]);

//   const fetchSalesAchievement = async (roleId, userId) => {
//     try {
//       const response = await fetch(
//         `${API_END_POINT}/user_sales_detail/sales_achievement/${roleId}/${userId}`
//       );
//       const data = await response.json();
      
//       return {
//         ...data,
//         monthlyDetails: data.monthlyDetails || []
//       };
//     } catch (error) {
//       console.error("Error fetching sales achievement data:", error);
//       return {
//         success: false,
//         monthlyDetails: []
//       };
//     }
//   };

//   const getMonthlyDataForSelectedDate = (monthlyDetails, selectedDate) => {
//     if (!monthlyDetails || monthlyDetails.length === 0) {
//       return {
//         MonthlyTargetAmount: 0,
//         AchievementAmount: 0,
//         pendingAmount: 0,
//         achievementAmountPercent: "0",
//         unachievementAmountPercent: "100",
//         StockTarget: 0,
//         StockAchievement: 0,
//         PendingStockTarget: 0,
//         StockAchievementPercent: "0",
//         StockUnachievementPercent: "100",
//         month: format(selectedDate, 'MMMM'),
//         year: selectedDate.getFullYear()
//       };
//     }

//     const selectedMonth = format(selectedDate, 'MMMM');
//     const selectedYear = selectedDate.getFullYear();
    
//     const matchingData = monthlyDetails.find(
//       detail => detail.month === selectedMonth && detail.year === selectedYear
//     );

//     return matchingData || {
//       MonthlyTargetAmount: 0,
//       AchievementAmount: 0,
//       pendingAmount: 0,
//       achievementAmountPercent: "0",
//       unachievementAmountPercent: "100",
//       StockTarget: 0,
//       StockAchievement: 0,
//       PendingStockTarget: 0,
//       StockAchievementPercent: "0",
//       StockUnachievementPercent: "100",
//       month: selectedMonth,
//       year: selectedYear
//     };
//   };

//   const fetchUserCounts = async () => {
//     setIsLoading(true);
//     setFetchError(null);
//     try {
//       const response = await fetch(`${API_END_POINT}/user/reports/${userId}`);
//       const data = await response.json();
      
//       // Check if any data exists in any of the user arrays
//       const hasData = data.mdUsers?.length > 0 || 
//                      data.sdUsers?.length > 0 || 
//                      data.distributorUsers?.length > 0 || 
//                      data.adoUsers?.length > 0;
      
//       if (!hasData) {
//         setRows([]);
//         setFilteredData([]);
//       } else {
//         const users = [
//           ...(data.mdUsers || []),
//           ...(data.sdUsers || []),
//           ...(data.distributorUsers || []),
//           ...(data.adoUsers || []),
//         ];
//         setRows(users);
//         setFilteredData(users);
//       }
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//       setFetchError("Failed to load data. Please try again later.");
//     } finally {
//       setIsLoading(false);
//       setDataLoaded(true);
//     }
//   };

//   useEffect(() => {
//     if (userId) {
//       fetchUserCounts();
//     }
//   }, [userId]);

//   useEffect(() => {
//     const applyFilters = async () => {
//       setIsLoading(true);

//       let statusFiltered = rows;

//       if (statusFilters.active || statusFilters.deleted) {
//         statusFiltered = rows.filter((user) => {
//           if (statusFilters.active && statusFilters.deleted) {
//             return user.status === "Active" || user.status === "Deleted";
//           }
//           if (statusFilters.active) {
//             return user.status === "Active";
//           }
//           if (statusFilters.deleted) {
//             return user.status === "Deleted";
//           }
//           return false;
//         });
//       }

//       const filteredRows = statusFiltered.filter(
//         (user) =>
//           (roleFilter === "" || user.role_name === roleFilter) &&
//           (areaFilter === "" ||
//             user.district.trim().toLowerCase() ===
//               areaFilter.trim().toLowerCase()) &&
//           (nameFilter === "" ||
//             user.full_name.toLowerCase().includes(nameFilter.toLowerCase()))
//       );

//       const enrichedRows = await Promise.all(
//         filteredRows.map(async (user) => {
//           const salesAchievement = await fetchSalesAchievement(
//             user.role_name,
//             user.id
//           );
//           return {
//             ...user,
//             salesAchievement,
//           };
//         })
//       );

//       setFilteredData(enrichedRows);
//       setIsLoading(false);
//     };

//     if (rows.length > 0) {
//       applyFilters();
//     } else if (dataLoaded) {
//       // If data load is complete and no rows, ensure loading is false
//       setIsLoading(false);
//     }
//   }, [statusFilters, roleFilter, areaFilter, nameFilter, rows, selectedDate, dataLoaded]);

//   const handleFilterChange = () => {
//     setPage(0);
//   };

//   const handleSearchChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "role") {
//       setRoleFilter(value);
//       setPage(0);
//     } else if (name === "area") {
//       setAreaFilter(value);
//       setPage(0);
//     }
//   };

//   const handleSearchChangeName = (e) => {
//     const { value } = e.target;
//     setNameFilter(value);
//   };

//   const renderPagination = (page, setPage, totalRows) => (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "right",
//         alignItems: "center",
//         gap: "15px",
//       }}
//     >
//       <Button
//         onClick={() => setPage(page - 1)}
//         disabled={page === 0}
//         variant="outlined"
//       >
//         Previous
//       </Button>
//       <Typography
//         variant="body1"
//         style={{ minWidth: "60px", textAlign: "center" }}
//       >
//         Page {page + 1} of {Math.ceil(totalRows / rowsPerPage)}
//       </Typography>
//       <Button
//         onClick={() => setPage(page + 1)}
//         disabled={page >= Math.ceil(totalRows / rowsPerPage) - 1}
//         variant="outlined"
//       >
//         Next
//       </Button>
//     </div>
//   );

//   const paginatedData = filteredData.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage
//   );

//   const renderLoadingState = () => (
//     <TableRow>
//       <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
//         <CircularProgress />
//         <Typography variant="body2" sx={{ mt: 1 }}>
//           Loading data...
//         </Typography>
//       </TableCell>
//     </TableRow>
//   );

//   const renderNoDataState = () => (
//     <TableRow>
//       <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
//         <Typography variant="body1" color="textSecondary">
//           {fetchError || "No data available for the selected criteria"}
//         </Typography>
//         {fetchError && (
//           <Button 
//             variant="outlined" 
//             sx={{ mt: 2 }}
//             onClick={fetchUserCounts}
//           >
//             Retry
//           </Button>
//         )}
//       </TableCell>
//     </TableRow>
//   );

//   return (
//     <Box p={3}>
//       <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
//         All Reports
//       </Typography>

//       <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
//         <TextField
//           label="Search Name"
//           variant="outlined"
//           name="name"
//           value={nameFilter}
//           onChange={handleSearchChangeName}
//           sx={{
//             borderRadius: "20px",
//             "& .MuiOutlinedInput-root": {
//               borderRadius: "20px",
//             },
//           }}
//         />
//       </Box>

//       <Box
//         display="flex"
//         alignItems="center"
//         justifyContent="space-between"
//         gap="20px"
//         mb={3}
//       >
//         {/* Left-aligned Dropdowns */}
//         <Box display="flex" gap="20px">
//           <Select
//             value={roleFilter}
//             onChange={(e) => handleSearchChange(e)}
//             displayEmpty
//             name="role"
//             sx={{
//               minWidth: 180,
//               borderColor: "white",
//               borderRadius: "20px",
//               "& .MuiOutlinedInput-root": {
//                 borderRadius: "20px",
//               },
//             }}
//           >
//             <MenuItem value="">Select All Role</MenuItem>
//             {availableRoles.map((role, index) => (
//               <MenuItem key={index} value={role}>
//                 {role}
//               </MenuItem>
//             ))}
//           </Select>

//           <Select
//             value={areaFilter}
//             onChange={(e) => handleSearchChange(e)}
//             displayEmpty
//             name="area"
//             sx={{
//               minWidth: 180,
//               borderRadius: "20px",
//               "& .MuiOutlinedInput-root": {
//                 borderRadius: "20px",
//               },
//             }}
//           >
//             <MenuItem value="">Select All Areas</MenuItem>
//             {areas
//               .slice()
//               .sort((a, b) => a.localeCompare(b))
//               .map((area) => (
//                 <MenuItem key={area} value={area}>
//                   {area.charAt(0).toUpperCase() + area.slice(1)}
//                 </MenuItem>
//               ))}
//           </Select>

//           <Box display="flex" justifyContent="center" flexGrow={1}>
//             <DatePicker
//               selected={selectedDate}
//               onChange={handleDateChange}
//               dateFormat="MMMM yyyy"
//               showMonthYearPicker
//               className="date-picker-input"
//               style={{
//                 width: "100%",
//                 maxWidth: "200px",
//                 padding: "10px",
//                 borderRadius: "20px",
//                 border: "1px solid #ced4da",
//               }}
//             />
//           </Box>
//         </Box>

//         {/* Right-aligned Checkboxes */}
//         <FormGroup row>
//           <FormControlLabel
//             control={
//               <Checkbox
//                 checked={statusFilters.active}
//                 onChange={handleStatusFilterChange}
//                 name="active"
//                 color="primary"
//               />
//             }
//             label="Active"
//           />
//           <FormControlLabel
//             control={
//               <Checkbox
//                 checked={statusFilters.deleted}
//                 onChange={handleStatusFilterChange}
//                 name="deleted"
//                 color="primary"
//               />
//             }
//             label="Dropped"
//           />
//         </FormGroup>
//       </Box>

//       <TableContainer
//         component={Paper}
//         sx={{ maxHeight: 500, overflowY: "auto" }}
//       >
//         <Table sx={{ minWidth: 650 }} aria-label="simple table">
//           <TableHead
//             sx={{ backgroundColor: "#DCDCDC", position: "sticky", top: 0 }}
//           >
//             <TableRow>
//               <TableCell sx={{ fontWeight: "bold" }}>No.</TableCell>
//               <TableCell sx={{ fontWeight: "bold" }}>Username</TableCell>
//               <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
//               <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
//               <TableCell sx={{ fontWeight: "bold" }}>District</TableCell>
//               <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
//               <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
//                 Sales Target/Achievement (Rs)
//               </TableCell>
//               <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
//                 Stock Target/Achievement (Rs)
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {isLoading ? (
//               renderLoadingState()
//             ) : filteredData.length === 0 ? (
//               renderNoDataState()
//             ) : (
//               paginatedData.map((row, index) => {
//                 const monthlyData = getMonthlyDataForSelectedDate(
//                   row.salesAchievement?.monthlyDetails,
//                   selectedDate
//                 );

//                 return (
//                   <TableRow key={row.id} hover>
//                     <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
//                     <TableCell>
//                       <Box display="flex" alignItems="center">
//                         <Avatar
//                           alt={row.full_name}
//                           src={`${API_END_POINT_IMG}/uploads/${row.image}`}
//                           sx={{ width: 40, height: 40, marginRight: 2 }}
//                         />
//                         {row.username}
//                       </Box>
//                     </TableCell>
//                     <TableCell sx={{ whiteSpace: "nowrap" }}>
//                       {row.full_name}
//                     </TableCell>
//                     <TableCell sx={{ whiteSpace: "nowrap" }}>
//                       {row.role_name}
//                     </TableCell>
//                     <TableCell sx={{ whiteSpace: "nowrap" }}>
//                       {row.district}
//                     </TableCell>
//                     <TableCell>
//                       <Typography
//                         color={
//                           row.status === "Active"
//                             ? "success.main"
//                             : "error.main"
//                         }
//                         sx={{ fontWeight: "bold" }}
//                       >
//                         {row.status === "Deleted" ? "Dropped" : "Active"}
//                       </Typography>
//                     </TableCell>
//                     <TableCell sx={{ whiteSpace: "nowrap" }}>
//                       {new Intl.NumberFormat("en-IN").format(
//                         monthlyData.MonthlyTargetAmount || 0
//                       )}
//                       <span style={{ margin: "0 4px" }}>/</span>
//                       {new Intl.NumberFormat("en-IN").format(
//                         monthlyData.AchievementAmount || 0
//                       )}
//                     </TableCell>
//                     <TableCell sx={{ whiteSpace: "nowrap" }}>
//                       {new Intl.NumberFormat("en-IN").format(
//                         monthlyData.StockTarget || 0
//                       )}
//                       <span style={{ margin: "0 4px" }}>/</span>
//                       {new Intl.NumberFormat("en-IN").format(
//                         monthlyData.StockAchievement || 0
//                       )}
//                     </TableCell>
//                   </TableRow>
//                 );
//               })
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {filteredData.length > 0 && (
//         <Box mt={2}>{renderPagination(page, setPage, filteredData.length)}</Box>
//       )}
//     </Box>
//   );
// }





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
  CircularProgress,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Collapse,
  IconButton,
} from "@mui/material";
import { useSelector } from "react-redux";
import { API_END_POINT_IMG } from "../../constants/ApiConstant";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse, isWithinInterval, eachMonthOfInterval } from "date-fns";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function ReportTable() {
  const [rows, setRows] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
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
  const [statusFilters, setStatusFilters] = useState({
    active: false,
    deleted: false,
  });
  const [startDate, setStartDate] = useState(new Date());

  const [endDate, setEndDate] = useState(new Date());
  const [dataLoaded, setDataLoaded] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});

  const handleStatusFilterChange = (event) => {
    setStatusFilters({
      ...statusFilters,
      [event.target.name]: event.target.checked,
    });
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (date > endDate) {
      setEndDate(date);
    }
    setPage(0);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    setPage(0);
  };

  const handleRowExpand = (userId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await fetch(`${API_END_POINT}/user/${userId}`);
        const data = await response.json();
        const userAreas = [
          ...(data.mdUsers || []).map((user) =>
            user.district?.trim().toLowerCase()
          ),
          ...(data.sdUsers || []).map((user) =>
            user.district?.trim().toLowerCase()
          ),
          ...(data.distributorUsers || []).map((user) =>
            user.district?.trim().toLowerCase()
          ),
          ...(data.adoUsers || []).map((user) =>
            user.district?.trim().toLowerCase()
          ),
        ].filter(Boolean);
        setAreas([...new Set(userAreas)]);
      } catch (error) {
        console.error("Error fetching area data:", error);
      }
    };

    if (userId) {
      fetchAreas();
    }
  }, [userId, API_END_POINT]);

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

  const fetchSalesAchievement = async (roleId, userId) => {
    try {
      const response = await fetch(
        `${API_END_POINT}/user_sales_detail/sales_achievement/${roleId}/${userId}`
      );
      const data = await response.json();
      return {
        ...data,
        monthlyDetails: data.monthlyDetails || [],
      };
    } catch (error) {
      console.error("Error fetching sales achievement data:", error);
      return {
        success: false,
        monthlyDetails: [],
      };
    }
  };

  const getMonthsInRange = (start, end) => {
    return eachMonthOfInterval({
      start: start,
      end: end,
    }).map((date) => ({
      month: format(date, "MMMM"),
      year: format(date, "yyyy"),
    }));
  };

  const getMonthlyDataForRange = (monthlyDetails, start, end) => {
    const monthsInRange = getMonthsInRange(start, end);

    return monthsInRange.map(({ month, year }) => {
      const foundData = monthlyDetails.find(
        (d) => d.month === month && d.year.toString() === year
      );

      return (
        foundData || {
          month,
          year: parseInt(year),
          MonthlyTargetAmount: 0,
          AchievementAmount: 0,
          pendingAmount: 0,
          achievementAmountPercent: "0",
          unachievementAmountPercent: "100",
          StockTarget: 0,
          StockAchievement: 0,
          PendingStockTarget: 0,
          StockAchievementPercent: "0",
          StockUnachievementPercent: "100",
          isEmpty: true,
        }
      );
    });
  };

  const fetchUserCounts = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const response = await fetch(`${API_END_POINT}/user/reports/${userId}`);
      const data = await response.json();

      const hasData =
        data.mdUsers?.length > 0 ||
        data.sdUsers?.length > 0 ||
        data.distributorUsers?.length > 0 ||
        data.adoUsers?.length > 0;

      if (!hasData) {
        setRows([]);
        setFilteredData([]);
      } else {
        const users = [
          ...(data.mdUsers || []),
          ...(data.sdUsers || []),
          ...(data.distributorUsers || []),
          ...(data.adoUsers || []),
        ];
        setRows(users);
        setFilteredData(users);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setFetchError("Failed to load data. Please try again later.");
    } finally {
      setIsLoading(false);
      setDataLoaded(true);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserCounts();
    }
  }, [userId, API_END_POINT]);

  useEffect(() => {
    const applyFilters = async () => {
      setIsLoading(true);

      let statusFiltered = rows;

      if (statusFilters.active || statusFilters.deleted) {
        statusFiltered = rows.filter((user) => {
          if (statusFilters.active && statusFilters.deleted) {
            return user.status === "Active" || user.status === "Deleted";
          }
          if (statusFilters.active) {
            return user.status === "Active";
          }
          if (statusFilters.deleted) {
            return user.status === "Deleted";
          }
          return false;
        });
      }

      const filteredRows = statusFiltered.filter(
        (user) =>
          (roleFilter === "" || user.role_name === roleFilter) &&
          (areaFilter === "" ||
            user.district?.trim().toLowerCase() ===
              areaFilter.trim().toLowerCase()) &&
          (nameFilter === "" ||
            user.full_name?.toLowerCase().includes(nameFilter.toLowerCase()))
      );

      const enrichedRows = await Promise.all(
        filteredRows.map(async (user) => {
          const salesAchievement = await fetchSalesAchievement(
            user.role_name,
            user.id
          );

          const monthlyData = getMonthlyDataForRange(
            salesAchievement.monthlyDetails,
            startDate,
            endDate
          );

          return {
            ...user,
            salesAchievement: {
              ...salesAchievement,
              monthlyData,
            },
          };
        })
      );

      setFilteredData(enrichedRows);
      setIsLoading(false);
    };

    if (rows.length > 0) {
      applyFilters();
    } else if (dataLoaded) {
      setIsLoading(false);
    }
  }, [
    statusFilters,
    roleFilter,
    areaFilter,
    nameFilter,
    rows,
    startDate,
    endDate,
    dataLoaded,
  ]);

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

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const renderLoadingState = () => (
    <TableRow>
      <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 1 }}>
          Loading data...
        </Typography>
      </TableCell>
    </TableRow>
  );

  const renderNoDataState = () => (
    <TableRow>
      <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
        <Typography variant="body1" color="textSecondary">
          {fetchError || "No data available for the selected criteria"}
        </Typography>
        {fetchError && (
          <Button variant="outlined" sx={{ mt: 2 }} onClick={fetchUserCounts}>
            Retry
          </Button>
        )}
      </TableCell>
    </TableRow>
  );

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

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap="20px"
        mb={3}
      >
        <Box display="flex" gap="20px" flexWrap="wrap">
          <Box display="flex" gap="20px" mt="18px">
            {/* Select Role */}
            <Select
              value={roleFilter}
              onChange={(e) => handleSearchChange(e)}
              displayEmpty
              name="role"
              sx={{
                minWidth: 180,
                height: 50,
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

            {/* Select Area */}
            <Select
              value={areaFilter}
              onChange={(e) => handleSearchChange(e)}
              displayEmpty
              name="area"
              sx={{
                minWidth: 180,
                height: 50,
                borderRadius: "20px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                  padding: "8px 12px",
                },
              }}
            >
              <MenuItem value="">Select All Areas</MenuItem>
              {areas
                .slice()
                .sort((a, b) => a.localeCompare(b))
                .map((area) => (
                  <MenuItem key={area} value={area}>
                    {area.charAt(0).toUpperCase() + area.slice(1)}
                  </MenuItem>
                ))}
            </Select>
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            gap={0.5}
            sx={{ minWidth: "150px", maxWidth: "300px" }}
          >
            <Typography
              variant="body2"
              sx={{ fontSize: "0.675rem", color: "#989FA9" }}
            >
              From Month
            </Typography>
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              dateFormat="MMMM yyyy"
              showMonthYearPicker
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className="date-picker-input"
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "4px",
                border: "1px solid #ced4da",
              }}
            />
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            gap={0.5}
            sx={{ minWidth: "150px", maxWidth: "300px" }}
          >
            <Typography
              variant="body2"
              sx={{ fontSize: "0.675rem", color: "#989FA9" }}
            >
              To Month
            </Typography>
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              dateFormat="MMMM yyyy"
              showMonthYearPicker
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              className="date-picker-input"
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "4px",
                border: "1px solid #ced4da",
              }}
            />
          </Box>
        </Box>

        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                checked={statusFilters.active}
                onChange={handleStatusFilterChange}
                name="active"
                color="primary"
              />
            }
            label="Active"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={statusFilters.deleted}
                onChange={handleStatusFilterChange}
                name="deleted"
                color="primary"
              />
            }
            label="Dropped"
          />
        </FormGroup>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ maxHeight: 500, overflowY: "auto" }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead
            sx={{ backgroundColor: "#DCDCDC", position: "sticky", top: 0 }}
          >
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>No.</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Username</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>District</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                Sales Target/Achievement (Rs)
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                Stock Target/Achievement (Rs)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? renderLoadingState()
              : filteredData.length === 0
              ? renderNoDataState()
              : paginatedData.map((row, index) => {
                  const monthlyData = row.salesAchievement?.monthlyData || [];
                  const isExpanded = expandedRows[row.id] || false;

                  // Calculate totals
                  const totals = monthlyData.reduce(
                    (acc, monthData) => ({
                      MonthlyTargetAmount:
                        acc.MonthlyTargetAmount +
                        (monthData.MonthlyTargetAmount || 0),
                      AchievementAmount:
                        acc.AchievementAmount +
                        (monthData.AchievementAmount || 0),
                      StockTarget:
                        acc.StockTarget + (monthData.StockTarget || 0),
                      StockAchievement:
                        acc.StockAchievement +
                        (monthData.StockAchievement || 0),
                    }),
                    {
                      MonthlyTargetAmount: 0,
                      AchievementAmount: 0,
                      StockTarget: 0,
                      StockAchievement: 0,
                    }
                  );

                  return (
                    <React.Fragment key={row.id}>
                      <TableRow hover>
                       
                        <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar
                              alt={row.full_name}
                              src={`${API_END_POINT_IMG}/uploads/${row.image}`}
                              sx={{ width: 40, height: 40, marginRight: 2 }}
                            />
                            {row.username}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          {row.full_name}
                        </TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          {row.role_name}
                        </TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          {row.district}
                        </TableCell>
                        <TableCell>
                          <Typography
                            color={
                              row.status === "Active"
                                ? "success.main"
                                : "error.main"
                            }
                            sx={{ fontWeight: "bold" }}
                          >
                            {row.status === "Deleted" ? "Dropped" : "Active"}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          {new Intl.NumberFormat("en-IN").format(
                            totals.MonthlyTargetAmount
                          )}
                          <span style={{ margin: "0 4px" }}>/</span>
                          {new Intl.NumberFormat("en-IN").format(
                            totals.AchievementAmount
                          )}
                        </TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          {new Intl.NumberFormat("en-IN").format(
                            totals.StockTarget
                          )}
                          <span style={{ margin: "0 4px" }}>/</span>
                          {new Intl.NumberFormat("en-IN").format(
                            totals.StockAchievement
                          )}
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredData.length > 0 && (
        <Box mt={2}>{renderPagination(page, setPage, filteredData.length)}</Box>
      )}
    </Box>
  );
}
