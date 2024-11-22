import React, { useState, useRef } from "react";
import { Box, TextField, Button, Grid, Typography, Switch, InputLabel, IconButton, FormControlLabel, Checkbox } from "@mui/material";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const validateLink = (url) => {
  const regex = /^(https?:\/\/)?(www\.)?([a-zA-Z]+\.)?[a-zA-Z]+\.[a-z]{2,}(\/[^\s]*)?$/;
  return regex.test(url);
};

const DocumentForm = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageName, setImageName] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const roles = ["Area Development Officer", "Master Distributor", "Super Distributor", "Distributor", "Customers"];
  const [imageError, setImageError] = useState("");  // Add state for image error

  const generateDocumentID = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const formik = useFormik({
    initialValues: {
      documentID: generateDocumentID(),
      heading: "",
      description: "",
      link: "",
      receiver: [],
      fromDate: "",
      toDate: "",
      autoUpdate: false,
      activateStatus: true,
      image: "",
    },
    validationSchema: Yup.object({
      heading: Yup.string().required("Heading is required"),
      description: Yup.string().required("Description is required"),
      link: Yup.string()
        .required("Link is required")
        .test("isValidURL", "Enter a valid URL", value => validateLink(value)),
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("documentID", values.documentID);
      formData.append("heading", values.heading);
      formData.append("description", values.description);
      formData.append("link", values.link);
      formData.append("receiver", JSON.stringify(values.receiver));
      formData.append("autoUpdate", values.autoUpdate);
      formData.append("activateStatus", values.activateStatus);
      if (values.fromDate) formData.append("fromDate", values.fromDate);
      if (values.toDate) formData.append("toDate", values.toDate);
      if (selectedFile) {
        formData.append("image", selectedFile);
        formData.append("imageName", selectedFile.name);
      }

      fetch("http://localhost:3002/documents/create", {
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
      const fileSizeMB = file.size / (1024 * 1024); // Convert size from bytes to MB
  
      // Check if file size exceeds 2MB
      if (fileSizeMB > 2) {
        setImageError("File size must be less than 2MB");
        return; // Prevent further actions if size is too large
      } else {
        setImageError(""); // Clear error if file is valid
      }
  
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

  const handleReceiverChange = (event) => {
    const value = event.target.value;
    formik.setFieldValue("receiver", value);
  };

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      formik.setFieldValue("receiver", roles);
    } else {
      formik.setFieldValue("receiver", []);
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
{imageError && (
  <Typography variant="body2" color="error" sx={{ marginTop: 1 }}>
    {imageError}
  </Typography>
)}


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

              {/* Receiver Selection - Checkboxes */}
              <InputLabel>Receiver</InputLabel>
              <Box sx={{ display: "flex", flexDirection: "column", marginTop: "10px" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectAll}
                      onChange={handleSelectAllChange}
                      color="primary"
                    />
                  }
                  label="Select All"
                  required
                />
                {roles.map((role) => (
                  <FormControlLabel
                    key={role}
                    control={
                      <Checkbox
                        value={role}
                        checked={formik.values.receiver.includes(role)}
                        onChange={(e) => {
                          const { checked } = e.target;
                          const newReceiver = checked
                            ? [...formik.values.receiver, role]
                            : formik.values.receiver.filter((r) => r !== role);
                          formik.setFieldValue("receiver", newReceiver);
                        }}
                      />
                    }
                    label={role}
                  />
                ))}
              </Box>

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
              <Box sx={{ marginTop: 3 }}>
                <Button variant="contained" color="primary" fullWidth type="submit">
                  Submit
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default DocumentForm;
