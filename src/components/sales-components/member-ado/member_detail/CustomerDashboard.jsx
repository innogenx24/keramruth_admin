import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { LocationOn, Phone, Mail } from "@mui/icons-material";
import { API_END_POINT_IMG } from "../../../../constants/ApiConstant";
import { date } from "yup";

const CustomerDashboard = () => {
  const { memberID } = useParams();
  const [customer, setCustomer] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalOrders, setTotalOrders] = useState(0);
  const [lastOrderDate, setLastOrderDate] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(0);

  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await fetch(
          `${API_END_POINT}/user/customer-deatils/${memberID}`
        );
        if (!response.ok) throw new Error("Failed to fetch customer data");
        const data = await response.json();
        setCustomer(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomerData();
  }, [memberID]);

  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
        const response = await fetch(
          `${API_END_POINT}/orders/get-orders/${memberID}`
        );
        if (!response.ok) throw new Error("Failed to fetch order data");
        const data = await response.json();
        if (!data.orders || data.orders.length === 0) {
          setRecentBookings([]);
          setHistory([]);
          setTotalOrders(0);
          setLastOrderDate("N/A");
          return;
        }

        setHistory(data.orders);
        setTotalOrders(data.orders.length);

        const lastOrder = data.orders[0];
        setRecentBookings(
          lastOrder.OrderItems.map((item) => ({
            product: item.product.name,
            qty: item.quantity,
            price: item.final_price,
            productImage: item.product.image,
          }))
        );

        // Format and set the last order date correctly
        const [day, month, year] = lastOrder.createdAt.split("-");
        const formattedDate = new Date(
          `${year}-${month}-${day}`
        ).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        setLastOrderDate(formattedDate);
      } catch (err) {
        setRecentBookings([]);
        setHistory([]);
        setTotalOrders(0);
        setLastOrderDate("N/A");
      } finally {
        setLoading(false);
      }
    };
    fetchOrdersData();
  }, [memberID]);

  if (loading) {
    return (
      <Box p={3} display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < recentBookings.length - 1)
      setCurrentIndex(currentIndex + 1);
  };

  const currentHistory = history.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  const renderPagination = () => (
    <div style={{ display: "flex", justifyContent: "right", gap: "15px" }}>
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
        Page {page + 1}
      </Typography>
      <Button
        onClick={() => setPage(page + 1)}
        disabled={page >= Math.ceil(history.length / rowsPerPage) - 1}
        variant="outlined"
      >
        Next
      </Button>
    </div>
  );

  return (
    <Box p={3}>
      {/* Customer Details */}
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box
                display="flex"
                alignItems="center"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  height: "100%",
                }}
              >
                <Avatar
                  src={
                    customer?.image
                      ? `${API_END_POINT_IMG}/uploads/${customer.image}`
                      : undefined
                  }
                  alt={customer?.full_name || "N/A"}
                  sx={{
                    width: { xs: 60, sm: 80, md: 100 }, // Responsive sizes
                    height: { xs: 60, sm: 80, md: 100 },
                    mr: 2,
                  }}
                />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {customer?.full_name || "N/A"}
                  </Typography>
                  <Typography color="primary">{`ID: ${customer?.username}`}</Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    Role: {customer?.role_name || "N/A"}
                  </Typography>

                  {/* Address */}
                  <Box display="flex" alignItems="center">
                    <LocationOn style={{ marginRight: "8px" }} />
                    <Typography variant="body2">
                      {`${customer?.street_name}, ${customer?.building_no_name}, ${customer?.city}, ${customer?.district}, ${customer?.state}, ${customer?.pincode}.`}
                    </Typography>
                  </Box>

                  {/* Phone */}
                  <Box display="flex" alignItems="center">
                    <Phone style={{ marginRight: "8px" }} />
                    <Typography variant="body2">
                      {customer?.mobile_number}
                    </Typography>
                  </Box>

                  {/* Email */}
                  <Box display="flex" alignItems="center">
                    <Mail style={{ marginRight: "8px" }} />
                    <Typography variant="body2">{customer?.email}</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} textAlign="right">
              <Typography color="text.secondary" style={{ color: "#1c96c5" }}>
                Date of Joining:{" "}
                {new Date(customer?.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "2-digit",
                })}{" "}
              </Typography>
              <Typography variant="body2" style={{ color: "#1c96c5" }}>
                Total No. of Booked:{" "}
                <span style={{ color: "#1c96c5" }}>{totalOrders}</span>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Recent Bookings */}
      <Card sx={{ mb: 4, backgroundColor: "#f9f9f9" }}>
        <CardContent>
          <Typography
            variant="h6"
            style={{
              textAlign: "center",
              color: "#007b55",
              fontWeight: "bold",
            }}
          >
            Recent Bookings
          </Typography>
          {lastOrderDate !== "N/A" && (
            <Typography
              style={{
                textAlign: "center",
                fontSize: "15px",
                marginTop: "4px",
              }}
            >
              {lastOrderDate} Last Booking
            </Typography>
          )}

          <Grid
            container
            spacing={2}
            style={{ marginTop: "16px" }}
            justifyContent="center"
          >
            <Grid item xs={12} sm={6} md={4}>
              {recentBookings.length > 0 && recentBookings[currentIndex] ? (
                <Card variant="outlined">
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      {/* Navigation Buttons */}
                      <Button
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                      >
                        ◀
                      </Button>

                      <img
                        src={`${API_END_POINT_IMG}/uploads/${recentBookings[currentIndex].productImage}`}
                        style={{
                          width: "80px",
                          height: "auto",
                          objectFit: "contain",
                          border: "1px solid #ccc",
                          boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
                          borderRadius: "10px",
                        }}
                        alt="Product"
                      />

                      <div style={{ textAlign: "center", marginLeft: "10px" }}>
                        <Typography
                          variant="body1"
                          style={{ fontWeight: "bold" }}
                        >
                          {recentBookings[currentIndex]?.product ||
                            "Product Name Not Available"}
                        </Typography>
                        <Typography variant="body2" style={{ color: "#555" }}>
                          Qty: {recentBookings[currentIndex]?.qty}
                        </Typography>
                        <Typography
                          variant="body2"
                          style={{ color: "#007b55", fontWeight: "bold" }}
                        >
                          ₹ {recentBookings[currentIndex]?.price}
                        </Typography>
                      </div>

                      <Button
                        onClick={handleNext}
                        disabled={currentIndex === recentBookings.length - 1}
                      >
                        ▶
                      </Button>
                    </Box>
                  </CardContent>
                  <Typography
                    mt={2}
                    variant="h6"
                    style={{
                      textAlign: "center",
                      marginTop: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Total Amount: ₹{" "}
                    {recentBookings
                      .reduce(
                        (total, item) => total + parseFloat(item.price || 0),
                        0
                      )
                      .toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </Typography>
                </Card>
              ) : (
                <Typography align="center">No recent booking available.</Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Booking History */}
      <Card>
        <CardContent>
          <Typography variant="h6">Booking History</Typography>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#DCDCDC" }}>
                <TableRow>
                  <TableCell>No.</TableCell>
                  <TableCell>Booking Date</TableCell>
                  <TableCell>Order Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentHistory.length > 0 ? (
                  currentHistory.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{entry.createdAt}</TableCell>

                      <TableCell>
                        {entry.OrderItems.map(
                          (item) =>
                            `${item.quantity} x ${item.product.name} ${
                              item.product.weight || ""
                            }`
                        )
                          .reduce((result, product, i) => {
                            if (i % 3 === 0) {
                              result.push([product]);
                            } else {
                              result[result.length - 1].push(product);
                            }
                            return result;
                          }, [])
                          .map((pair, i) => (
                            <div key={i}>
                              {pair.join(", ")}
                              <br />
                            </div>
                          ))}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No booking history available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <div style={{ marginTop: "10px" }}>{renderPagination()}</div>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CustomerDashboard;












// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Grid,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   CircularProgress,
//   Avatar,
// } from "@mui/material";
// import { useNavigate, useParams } from "react-router-dom";
// import { LocationOn, Phone, Mail } from "@mui/icons-material";
// import { API_END_POINT_IMG } from "../../../../constants/ApiConstant";
// import { date } from "yup";
// const CustomerDashboard = () => {
//   const { memberID } = useParams(); // Fetch memberID from URL
//   const [customer, setCustomer] = useState(null);
//   const [recentBookings, setRecentBookings] = useState([]);
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [totalOrders, setTotalOrders] = useState(0);
//   const [lastOrderDate, setLastOrderDate] = useState("");
//   const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;
//   const [page, setPage] = useState(0);
//   const [rowsPerPage] = useState(10); // Set the number of rows per page
//   const [totalRows, setTotalRows] = useState(0);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     // Fetch customer details using the memberID
//     const fetchCustomerData = async () => {
//       try {
//         // const response = await fetch(`${API_END_POINT}/api/user/customer-deatils/${memberID}`);
//         const response = await fetch(
//           `${API_END_POINT}/user/customer-deatils/${memberID}`
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch customer data");
//         }
//         const data = await response.json();
//         setCustomer(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     // Fetch order data using the memberID
//     const fetchOrdersData = async () => {
//       try {
//         const response = await fetch(
//           `${API_END_POINT}/orders/get-orders/${memberID}`
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch order data");
//         }
//         const data = await response.json();

//         // Set the recent bookings (last order) and order history
//         if (data.orders && data.orders.length > 0) {
//           const lastOrder = data.orders[0]; // Assuming the latest order is at index 0
//           const orderItems = lastOrder.OrderItems.map((item) => ({
//             product: item.product.name,
//             qty: item.quantity,
//             price: item.final_price,
//             productImage: item.product.image,
//           }));
//           setRecentBookings(orderItems);

//           const dateParts = lastOrder.createdAt.split("-"); // Split "29-01-2025" into ["29", "01", "2025"]
//           const formattedDate = new Date(
//             `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
//           )
//             .toLocaleDateString("en-GB", {
//               day: "2-digit",
//               month: "short",
//               year: "numeric",
//             })
//             .replace(/ /g, "-");

//           console.log(formattedDate); // Output: "29-Jan-2025"

//           setHistory(
//             data.orders.map((order) => ({
//               createdAt: order.createdAt,
//               product: order.OrderItems.map(
//                 (item) => `${item.quantity} x ${item.product.name}`
//               ).join(", "),
//             }))
//           );

//           const totalOrders = data.orders.length;
//           setTotalOrders(totalOrders);

//           setLastOrderDate(formattedDate);
//           setTotalRows(data.orders.length); // Set the total rows for pagination
//         }
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//     fetchCustomerData();
//     fetchOrdersData();
//   }, [memberID]);

//   if (loading) {
//     return (
//       <Box p={3} display="flex" justifyContent="center" alignItems="center">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box p={3}>
//         <Typography color="error">{error}</Typography>
//       </Box>
//     );
//   }

//   if (!customer) {
//     return (
//       <Box p={3}>
//         <Typography>No customer data available</Typography>
//       </Box>
//     );
//   }

//   const handleSeeMoreClick = () => {
//     setVisibleHistoryCount((prevCount) => prevCount + 5); // Increase by 5 entries each time
//   };

//   const currentHistory = history.slice(
//     page * rowsPerPage,
//     (page + 1) * rowsPerPage
//   );

//   const renderPagination = () => (
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
//         Page {page + 1}
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

//   const handlePrev = () => {
//     if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
//   };

//   const handleNext = () => {
//     if (currentIndex < recentBookings.length - 1)
//       setCurrentIndex(currentIndex + 1);
//   };

//   return (
//     <Box p={3} display="flex" flexDirection="column" gap={2}>
//       {/* Customer Details */}
//       <Card>
//         <CardContent>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6}>
//               <Box
//                 display="flex"
//                 alignItems="center"
//                 sx={{
//                   p: 2,
//                   borderRadius: 2,
//                   height: "100%",
//                 }}
//               >
//                 <Avatar
//                   src={
//                     customer.image
//                       ? `${API_END_POINT_IMG}/uploads/${customer.image}`
//                       : undefined
//                   }
//                   alt={customer.full_name || "N/A"}
//                   sx={{
//                     width: { xs: 60, sm: 80, md: 100 }, // Responsive sizes
//                     height: { xs: 60, sm: 80, md: 100 },
//                     mr: 2,
//                   }}
//                 />
//                 <Box>
//                   <Typography variant="h6" fontWeight="bold">
//                     {customer.full_name || "N/A"}
//                   </Typography>
//                   <Typography color="primary">{`ID: ${customer.username}`}</Typography>
//                   <Typography variant="subtitle2" color="text.secondary">
//                     Role: {customer.role_name || "N/A"}
//                   </Typography>

//                   {/* Address */}
//                   <Box display="flex" alignItems="center">
//                     <LocationOn style={{ marginRight: "8px" }} />
//                     <Typography variant="body2">
//                       {`${customer.street_name}, ${customer.building_no_name}, ${customer.city}, ${customer.district}, ${customer.state}, ${customer.pincode}.`}
//                     </Typography>
//                   </Box>

//                   {/* Phone */}
//                   <Box display="flex" alignItems="center">
//                     <Phone style={{ marginRight: "8px" }} />
//                     <Typography variant="body2">
//                       {customer.mobile_number}
//                     </Typography>
//                   </Box>

//                   {/* Email */}
//                   <Box display="flex" alignItems="center">
//                     <Mail style={{ marginRight: "8px" }} />
//                     <Typography variant="body2">{customer.email}</Typography>
//                   </Box>
//                 </Box>
//               </Box>
//             </Grid>
//             <Grid item xs={12} sm={6} textAlign="right">
//               <Typography color="text.secondary" style={{ color: "#1c96c5" }}>
//                 Date of Joining:{" "}
//                 {new Date(customer.createdAt).toLocaleDateString("en-GB", {
//                   day: "2-digit",
//                   month: "short",
//                   year: "2-digit",
//                 })}{" "}
//               </Typography>
//               <Typography variant="body2" style={{ color: "#1c96c5" }}>
//                 Total No. of Booked:{" "}
//                 <span style={{ color: "#1c96c5" }}>{totalOrders}</span>
//               </Typography>
//             </Grid>
//           </Grid>
//         </CardContent>
//       </Card>

//       {/* Recent Bookings */}
//       <Card
//         style={{
//           padding: "16px",
//           backgroundColor: "#f9f9f9",
//           borderRadius: "8px",
//         }}
//       >
//         <CardContent>
//           <Typography
//             variant="h6"
//             style={{
//               textAlign: "center",
//               color: "#007b55",
//               fontWeight: "bold",
//             }}
//           >
//             Recent Bookings
//           </Typography>

//           <Typography
//             style={{ textAlign: "center", fontSize: "15px", marginTop: "4px" }}
//           >
//             {lastOrderDate} Last Booking
//           </Typography>

//           <Grid
//             container
//             spacing={2}
//             style={{ marginTop: "16px" }}
//             justifyContent="center"
//           >
//             <Grid item xs={12} sm={6} md={4}>
//               {recentBookings.length > 0 && recentBookings[currentIndex] ? (
//                 <Card variant="outlined" style={{ backgroundColor: "#ffffff" }}>
//                   <CardContent>
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       {/* Left Arrow Button */}
//                       <button
//                         onClick={handlePrev}
//                         disabled={currentIndex === 0}
//                         style={{ marginRight: "10px" }}
//                       >
//                         ◀
//                       </button>

//                       <img
//                         src={`${API_END_POINT_IMG}/uploads/${
//                           recentBookings[currentIndex]?.productImage ||
//                           "placeholder.png"
//                         }`}
//                         style={{
//                           width: "80px",
//                           height: "auto",
//                           objectFit: "contain",
//                           border: "1px solid #ccc",
//                           boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
//                           borderRadius: "10px",
//                         }}
//                         alt="Product"
//                       />

//                       <div style={{ textAlign: "center", marginLeft: "10px" }}>
//                         <Typography
//                           variant="body1"
//                           style={{ fontWeight: "bold" }}
//                         >
//                           {recentBookings[currentIndex]?.product ||
//                             "Product Name Not Available"}
//                         </Typography>
//                         <Typography variant="body2" style={{ color: "#555" }}>
//                           Qty: {recentBookings[currentIndex]?.qty}
//                         </Typography>
//                         <Typography
//                           variant="body2"
//                           style={{ color: "#007b55", fontWeight: "bold" }}
//                         >
//                           ₹ {recentBookings[currentIndex]?.price}
//                         </Typography>
//                       </div>

//                       {/* Right Arrow Button */}
//                       <button
//                         onClick={handleNext}
//                         disabled={currentIndex === recentBookings.length - 1}
//                         style={{ marginLeft: "10px" }}
//                       >
//                         ▶
//                       </button>
//                     </div>
//                   </CardContent>
//                   <Typography
//                     mt={2}
//                     variant="h6"
//                     style={{
//                       textAlign: "center",
//                       marginTop: "16px",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     Total Amount: ₹{" "}
//                     {recentBookings
//                       .reduce(
//                         (total, item) => total + parseFloat(item.price || 0),
//                         0
//                       )
//                       .toLocaleString("en-IN", {
//                         minimumFractionDigits: 2,
//                         maximumFractionDigits: 2,
//                       })}
//                   </Typography>
//                 </Card>
//               ) : (
//                 <div>No Recent Bookings</div>
//               )}
//             </Grid>
//           </Grid>
//         </CardContent>
//       </Card>

//       {/* Booking History */}
//       <Card>
//         <CardContent>
//           <Typography variant="h6">Booking History</Typography>
//           <TableContainer component={Paper} sx={{ mt: 2 }}>
//             <Table>
//               <TableHead sx={{ backgroundColor: "#DCDCDC" }}>
//                 <TableRow>
//                   <TableCell>No.</TableCell>
//                   <TableCell sx={{ width: "11%" }}>Booking Date</TableCell>
//                   <TableCell>Order Details</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {currentHistory.map((entry, index) => (
//                   <TableRow key={index}>
//                     <TableCell>{page * rowsPerPage + index + 1}</TableCell>
//                     <TableCell>{entry.createdAt}</TableCell>
//                     <TableCell>
//                       {entry.product
//                         .split(", ")
//                         .reduce((result, product, i) => {
//                           if (i % 3 === 0) {
//                             result.push([product]);
//                           } else {
//                             result[result.length - 1].push(product);
//                           }
//                           return result;
//                         }, [])
//                         .map((pair, i) => (
//                           <div key={i}>
//                             {pair.join(", ")}
//                             <br />
//                           </div>
//                         ))}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>

//           <div style={{ marginTop: "10px" }}>{renderPagination()}</div>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default CustomerDashboard;
