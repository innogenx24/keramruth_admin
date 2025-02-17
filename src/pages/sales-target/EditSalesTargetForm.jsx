import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  Typography,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditSalesTarget() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedRow = location.state?.selectedRow || {}; // Get selected row from the location state
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  const [targetData, setTargetData] = useState({
    role_name: selectedRow.role_name || "",
    target: selectedRow.target ? parseInt(selectedRow.target) : "",
    stock_target: selectedRow.stock_target ? parseInt(selectedRow.stock_target) : "",
    duration: selectedRow.duration || "",
  });

  const [errors, setErrors] = useState({
    target: "",
    stock_target: "",
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("success");

  const formatIndianCurrency = (value) => {
    if (!value) return value;

    const [integer, decimal] = value.toString().split(".");
    const integerPart = integer.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    return decimal ? `${integerPart}.${decimal}` : integerPart;
  };

  const handleChange = (field, value) => {
    // Remove commas for correct numeric storage
    const numericValue = value.replace(/,/g, "");

    if (field === "target" || field === "stock_target") {
      if (!/^\d*$/.test(numericValue)) {
        setErrors((prev) => ({
          ...prev,
          [field]: "This field must only contain numbers",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }
    }

    setTargetData((prevData) => ({
      ...prevData,
      [field]: numericValue,
    }));
  };

  const handleSubmit = async () => {
    // Check for errors before submitting
    if (errors.target || errors.stock_target) {
      setSnackbarMessage("Please correct the errors before submitting.");
      setSnackbarType("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const { role_name, target, stock_target, duration } = targetData;

      // Send PUT request to update the sales target in the backend
      const response = await axios.put(
        `${API_END_POINT}/salestarget/${role_name}`,
        {
          target,
          stock_target,
          duration,
        }
      );

      // Check if the response indicates success
      if (response.data.success) {
        setSnackbarMessage("Sales target updated successfully!");
        setSnackbarType("success");
        setOpenSnackbar(true);

        // Redirect after a short delay
        setTimeout(() => {
          navigate("/dashboard/sales-target-form"); // Redirect to the sales target list after update
        }, 2000);
      } else {
        setSnackbarMessage("Failed to update sales target.");
        setSnackbarType("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error updating sales target:", error);
      setSnackbarMessage("Failed to update sales target.");
      setSnackbarType("error");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      sx={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Edit Sales Target
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sales Target Details:
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={3}>
                  {/* Display the role name, but it's disabled so user cannot edit it */}
                  <TextField
                    label="Role Name"
                    fullWidth
                    value={targetData.role_name}
                    disabled
                  />
                </Grid>

                <Grid item xs={3}>
                  <TextField
                    label="Sales Target"
                    fullWidth
                    value={formatIndianCurrency(targetData.target)} // Indian number format
                    onChange={(e) => handleChange("target", e.target.value)}
                    error={!!errors.target}
                    helperText={errors.target}
                  />
                </Grid>

                <Grid item xs={3}>
                  <TextField
                    label="Stock Target"
                    fullWidth
                    value={formatIndianCurrency(targetData.stock_target)} // Indian number format
                    onChange={(e) =>
                      handleChange("stock_target", e.target.value)
                    }
                    error={!!errors.stock_target}
                    helperText={errors.stock_target}
                  />
                </Grid>

                <Grid item xs={3}>
                  <Select
                    fullWidth
                    value={targetData.duration}
                    onChange={(e) => handleChange("duration", e.target.value)}
                  >
                    <MenuItem value="1 month">1 Month</MenuItem>
                    <MenuItem value="3 months">3 Months</MenuItem>
                    <MenuItem value="6 months">6 Months</MenuItem>
                  </Select>
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{
                  marginTop: "24px",
                  width: "50%",
                  borderRadius: "15px",
                  padding: "8px",
                }}
              >
                Save
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={2000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarType}
            variant="filled"
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Grid>
    </Box>
  );
}


// import React, { useState, useEffect } from "react";
// import {
//   Grid,
//   TextField,
//   Select,
//   MenuItem,
//   Button,
//   Card,
//   CardContent,
//   Typography,
//   Box,
// } from "@mui/material";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import "./sales.css";

// export default function EditSalesTarget() {
//   const navigate = useNavigate();
//   const { state } = useLocation(); // Receiving data from the previous page

//   const [selectedProduct, setSelectedProduct] = useState(
//     state?.product?.product_name || ""
//   );
//   const [targets, setTargets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [errors, setErrors] = useState({});
//   const [formSubmitted, setFormSubmitted] = useState(false); // Track if form was submitted

//   // Fetch sales target data based on the selected product
//   useEffect(() => {
//     if (!selectedProduct) return;
//     fetchSalesTargets();
//   }, [selectedProduct]);

//   const fetchSalesTargets = async () => {
//     try {
//       const response = await axios.get(
//         `http://--/salestarget/${encodeURIComponent(selectedProduct)}`
//       );
//       setTargets(response.data.data || []);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching sales targets:", error);
//       setLoading(false);
//     }
//   };

//   const handleChange = (productIndex, dataIndex, field, value) => {
//     const updatedTargets = [...targets];
//     updatedTargets[productIndex].product_data[dataIndex][field] = value;
//     setTargets(updatedTargets);

//     // Clear errors for this field when input is corrected
//     if (formSubmitted) {
//       validateField(productIndex, dataIndex, field, value);
//     }
//   };

//   const handleTargetChange = (productIndex, dataIndex, value) => {
//     handleChange(productIndex, dataIndex, "target", value);
//   };

//   const handleStockTargetChange = (productIndex, dataIndex, value) => {
//     handleChange(productIndex, dataIndex, "stock_target", value);
//   };

//   const validateField = (productIndex, dataIndex, field, value) => {
//     const newErrors = { ...errors };

//     if (field === "target" && (!value || !/^\d+$/.test(value))) {
//       newErrors[`targetError_${productIndex}_${dataIndex}`] = "Target must be a number.";
//     } else if (field === "stock_target" && (!value || !/^\d+$/.test(value))) {
//       newErrors[`stockTargetError_${productIndex}_${dataIndex}`] = "Stock Target must be a number.";
//     } else if (field === "duration" && !value) {
//       newErrors[`durationError_${productIndex}_${dataIndex}`] = "Duration is required.";
//     } else {
//       delete newErrors[`${field}Error_${productIndex}_${dataIndex}`];
//     }

//     setErrors(newErrors);
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     targets.forEach((product, productIndex) => {
//       product.product_data.forEach((data, dataIndex) => {
//         if (!data.target || !/^\d+$/.test(data.target)) {
//           newErrors[`targetError_${productIndex}_${dataIndex}`] = "Target must be a number.";
//         }
//         if (!data.stock_target || !/^\d+$/.test(data.stock_target)) {
//           newErrors[`stockTargetError_${productIndex}_${dataIndex}`] = "Stock Target must be a number.";
//         }
//         if (!data.duration) {
//           newErrors[`durationError_${productIndex}_${dataIndex}`] = "Duration is required.";
//         }
//       });
//     });

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0; // No errors if the object is empty
//   };

//   const handleSubmit = async () => {
//     setFormSubmitted(true); // Mark the form as submitted
//     if (!validateForm()) return; // If validation fails, stop submission

//     const requestData = {
//       product_name: selectedProduct,
//       productData: targets.flatMap((product) =>
//         product.product_data.map((data) => ({
//           role: data.role,
//           target: data.target,
//           stock_target: data.stock_target,
//           duration: data.duration,
//         }))
//       ),
//     };

//     try {
//       const response = await axios.put(
//         `http:-----/salestarget/${encodeURIComponent(selectedProduct)}`,
//         requestData
//       );

//       if (response.data.success) {
//         alert("Sales targets updated successfully");
//         navigate("/dashboard/sales-target");
//       }
//     } catch (error) {
//       console.error("Error updating sales targets:", error);
//       alert("Failed to update sales targets.");
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <Typography variant="h4" gutterBottom>
//         Edit Sales Target for {selectedProduct}
//       </Typography>

//       {loading ? (
//         <Typography variant="h6">Loading...</Typography>
//       ) : (
//         <Grid container spacing={4}>
//           <Grid item xs={12} md={6}>
//             <Card variant="outlined">
//               <CardContent>
//                 <Typography variant="h6" gutterBottom>
//                   Sales Target for {selectedProduct}:
//                 </Typography>
//                 {targets.map((product, productIndex) => (
//                   <div key={product.id}>
//                     {product.product_data.map((data, dataIndex) => (
//                       <Grid
//                         container
//                         spacing={4}
//                         key={dataIndex}
//                         alignItems="center"
//                         sx={{ mb: 2 }}
//                       >
//                         <Grid item xs={3}>
//                           <Typography>{data.role}</Typography>
//                         </Grid>
//                         <Grid item xs={9}>
//                           <Grid container spacing={2}>
//                           <Grid item xs={4}>
//                           <TextField
//                             label="Sales Target"
//                             fullWidth
//                             value={data.target || ""}
//                             onChange={(e) =>
//                               handleTargetChange(
//                                 productIndex,
//                                 dataIndex,
//                                 e.target.value
//                               )
//                             }
//                             error={!!errors[`targetError_${productIndex}_${dataIndex}`]}
//                             helperText={errors[`targetError_${productIndex}_${dataIndex}`]}
//                           />
//                         </Grid>
//                         <Grid item xs={4}>
//                           <TextField
//                             label="Enter Stock Target"
//                             fullWidth
//                             value={data.stock_target || ""}
//                             onChange={(e) =>
//                               handleStockTargetChange(
//                                 productIndex,
//                                 dataIndex,
//                                 e.target.value
//                               )
//                             }
//                             error={!!errors[`stockTargetError_${productIndex}_${dataIndex}`]}
//                             helperText={errors[`stockTargetError_${productIndex}_${dataIndex}`]}
//                           />
//                         </Grid>
//                         <Grid item xs={4}>
//                           <Select
//                             fullWidth
//                             value={data.duration || ""}
//                             onChange={(e) =>
//                               handleChange(
//                                 productIndex,
//                                 dataIndex,
//                                 "duration",
//                                 e.target.value
//                               )
//                             }
//                             displayEmpty
//                             error={!!errors[`durationError_${productIndex}_${dataIndex}`]}
//                           >
//                             <MenuItem value="" disabled>
//                               <em>Select Duration</em>
//                             </MenuItem>
//                             <MenuItem value="1 month">1 Month</MenuItem>
//                             <MenuItem value="3 months">3 Months</MenuItem>
//                             <MenuItem value="6 months">6 Months</MenuItem>
//                           </Select>
//                           <Typography variant="caption" color="error">
//                             {errors[`durationError_${productIndex}_${dataIndex}`]}
//                           </Typography>
//                         </Grid>

//                           </Grid>

//                         </Grid>
//                       </Grid>
//                     ))}
//                   </div>
//                 ))}
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={12}>
//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               onClick={handleSubmit}
//               sx={{
//                 marginTop: "24px",
//                 width: "50%",
//                 borderRadius: "15px",
//                 padding: "8px",
//               }}
//             >
//               Update Sales Target
//             </Button>
//           </Grid>
//         </Grid>
//       )}
//     </div>
//   );
// }
