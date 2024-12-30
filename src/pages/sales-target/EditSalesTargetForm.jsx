import React, { useState, useEffect } from "react";
import { Grid, TextField, Select, MenuItem, Button, Card, CardContent, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditSalesTarget() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedRow = location.state?.selectedRow || {}; // Get selected row from the location state
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  const [targetData, setTargetData] = useState({
    role_name: selectedRow.role_name || '',
    target: selectedRow.target || '',
    stock_target: selectedRow.stock_target || '',
    duration: selectedRow.duration || '',
  });

  const roles = ["Area Development Officer", "Master Distributor", "Super Distributor", "Distributor"]; // Example role list

  const handleChange = (field, value) => {
    setTargetData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const { role_name, target, stock_target, duration } = targetData;
  
      // Send PUT request to update the sales target in the backend
      const response = await axios.put(`${API_END_POINT}/salestarget/${role_name}`, {
        target,
        stock_target,
        duration,
      });
  
      // Check if the response indicates success
      if (response.data.success) {
        // Optionally, update the UI with the updated data
        setTargetData((prevData) => ({
          ...prevData,
          target: response.data.target || prevData.target,
          stock_target: response.data.stock_target || prevData.stock_target,
          duration: response.data.duration || prevData.duration,
        }));
        
        navigate("/dashboard/sales-target-form"); // Redirect to the sales target list after update
      } else {
        alert("Failed to update sales target.");
      }
    } catch (error) {
      console.error("Error updating sales target:", error);
      alert("Failed to update sales target.");
    }
  };
  

  return (
    <div style={{ padding: "20px" }}>
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
                    value={targetData.target}
                    onChange={(e) => handleChange("target", e.target.value)}
                  />
                </Grid>

                <Grid item xs={3}>
                  <TextField
                    label="Stock Target"
                    fullWidth
                    value={targetData.stock_target}
                    onChange={(e) => handleChange("stock_target", e.target.value)}
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

              {/* <Button
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
                Update Sales Target
              </Button> */}


              <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={handleSubmit}

              
              sx={{ marginTop: "24px",    width: "50%",
                borderRadius: "15px", padding: "8px" }}
            >
              Save
            </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
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








