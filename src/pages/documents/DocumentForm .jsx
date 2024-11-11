import React, { useState, useRef } from "react";
import { Box, TextField, Button, Grid, FormControl, Typography, Switch, InputLabel, IconButton, MenuItem, Select } from "@mui/material";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const DocumentForm = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageName, setImageName] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  // Formik setup with validation schema
  const formik = useFormik({
    initialValues: {
      documentID: "",
      heading: "",
      description: "",
      link: "",
      receiver: "",
      fromDate: "",
      toDate: "",
      autoUpdate: false,
      activateStatus: true,
      image: "",
    },
    validationSchema: Yup.object({
      heading: Yup.string().required("Heading is required"),
      description: Yup.string().required("Description is required"),
      link: Yup.string().required("Link is required"),
      receiver: Yup.string().required("Receiver is required"),
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("documentID", values.documentID);
      formData.append("heading", values.heading);
      formData.append("description", values.description);
      formData.append("link", values.link);
      formData.append("receiver", values.receiver);
      formData.append("autoUpdate", values.autoUpdate);
      formData.append("activateStatus", values.activateStatus);
      if (values.fromDate) formData.append("fromDate", values.fromDate);
      if (values.toDate) formData.append("toDate", values.toDate);
      if (selectedFile) {
        formData.append("image", selectedFile);
        formData.append("imageName", selectedFile.name);
      }

      fetch("http://88.222.245.236:3002/documents/create", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          navigate("/dashboard/documents");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue("image", file.name);
      setSelectedFile(file);
      setImageName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ padding: "20px", maxWidth: "1200px", margin: "0 auto", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        Add Document
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px" }}>
              <Typography variant="h6" gutterBottom>
                Document Details
              </Typography>

              {/* Image Upload Section */}
              <InputLabel>Add Image</InputLabel>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton color="primary" onClick={() => fileInputRef.current.click()}>
                  <AddPhotoAlternateIcon />
                </IconButton>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  style={{ display: "none" }}
                />
              </Box>
              {imageName && <Typography variant="body2" sx={{ marginTop: 1 }}>{imageName}</Typography>}
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Selected"
                  style={{ marginTop: "10px", maxWidth: "100%", height: "auto", borderRadius: "8px" }}
                />
              )}

              {/* Document Fields */}
              <TextField
                fullWidth
                label="Document ID"
                name="documentID"
                value={formik.values.documentID}
                onChange={formik.handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Heading"
                name="heading"
                value={formik.values.heading}
                onChange={formik.handleChange}
                error={formik.touched.heading && Boolean(formik.errors.heading)}
                helperText={formik.touched.heading && formik.errors.heading}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={3}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Link"
                name="link"
                value={formik.values.link}
                onChange={formik.handleChange}
                error={formik.touched.link && Boolean(formik.errors.link)}
                helperText={formik.touched.link && formik.errors.link}
                margin="normal"
                required
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px" }}>
              <Typography variant="h6" gutterBottom>
                Additional Settings
              </Typography>

              {/* Receiver Selection */}
              <InputLabel>Receiver</InputLabel>
              <FormControl fullWidth margin="normal">
                <InputLabel>Applying on</InputLabel>
                <Select
                  value={formik.values.receiver}
                  onChange={formik.handleChange}
                  name="receiver"
                  required
                >
                  <MenuItem value="All Users">All Users</MenuItem>
                  <MenuItem value="ADO">Area Development Officer (ADO)</MenuItem>
                  <MenuItem value="MD">Master Distributor (MD)</MenuItem>
                  <MenuItem value="SD">Super Distributor (SD)</MenuItem>
                  <MenuItem value="Distributor">Distributor</MenuItem>
                  <MenuItem value="Customers">Customers</MenuItem>
                </Select>
              </FormControl>

              {/* Auto Update Switch */}
              <Box sx={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
                <Switch
                  checked={formik.values.autoUpdate}
                  onChange={() => formik.setFieldValue("autoUpdate", !formik.values.autoUpdate)}
                  color="primary"
                />
                <Typography variant="body1" sx={{ marginLeft: 1 }}>
                  Auto Update
                </Typography>
              </Box>

              {/* Date Range Fields for Auto Update */}
              {formik.values.autoUpdate && (
                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="From Date"
                      type="date"
                      name="fromDate"
                      value={formik.values.fromDate}
                      onChange={formik.handleChange}
                      InputLabelProps={{ shrink: true }}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="To Date"
                      type="date"
                      name="toDate"
                      value={formik.values.toDate}
                      onChange={formik.handleChange}
                      InputLabelProps={{ shrink: true }}
                      margin="normal"
                    />
                  </Grid>
                </Grid>
              )}

              {/* Activate Status Switch */}
              <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
                <Switch
                  checked={formik.values.activateStatus}
                  onChange={() => formik.setFieldValue("activateStatus", !formik.values.activateStatus)}
                  color="primary"
                />
                <Typography variant="body1" sx={{ marginLeft: 1 }}>
                  Activate Status
                </Typography>
              </Box>

              {/* Submit Button */}
              <Button variant="contained" type="submit" fullWidth sx={{ marginTop: "20px" }}>
                Submit
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default DocumentForm;
