import React, { useState, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Switch,
  InputLabel,
  IconButton,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const validateLink = (url) => {
  const regex =
    /^(https?:\/\/)?(www\.)?([a-zA-Z]+\.)?[a-zA-Z]+\.[a-z]{2,}(\/[^\s]*)?$/;
  return regex.test(url);
};

const DocumentForm = () => {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageName, setImageName] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const roles = [
    "Area Development Officer",
    "Master Distributor",
    "Super Distributor",
    "Distributor",
    "Customer",
  ];
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;
  const [imageError, setImageError] = useState("");
  const [fileError, setFileError] = useState("");
  const today = new Date().toISOString().split("T")[0]; // Get current date in 'yyyy-MM-dd' format
  const [fileName, setFileName] = useState("");
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
      file: "",
    },
    validationSchema: Yup.object({
      heading: Yup.string().required("Heading is required"),
      description: Yup.string().required("Description is required"),
      link: Yup.string().test("isValidURL", "Enter a valid URL", (value) => {
        if (!value || !value.trim()) {
          return true;
        }
        const urlPattern = new RegExp(
          "^(https?:\\/\\/)?(www\\.)?([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}(\\/[a-zA-Z0-9@:%_\\+.~#?&//=]*)?$"
        );
        return urlPattern.test(value);
      }),
      receiver: Yup.array()
        .min(1, "At least one role must be selected")
        .required("Receiver is required"),
      fromDate: Yup.date()
        .nullable()
        .min(today, "From Date cannot be in the past"),
      toDate: Yup.date()
        .nullable()
        .min(Yup.ref("fromDate"), "To Date must be after From Date"),
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

      // Check if autoUpdate is false, set From Date and To Date to null
      if (values.autoUpdate) {
        if (values.fromDate) formData.append("fromDate", values.fromDate);
        if (values.toDate) formData.append("toDate", values.toDate);
      } else {
        // Do not append fromDate and toDate when they should be null
        formData.delete("fromDate");
        formData.delete("toDate");
      }

      if (selectedFile) {
        formData.append("file", selectedFile); // Append the actual file object
        formData.append("imageName", selectedFile.name); // Append the file name
      }

      fetch(`${API_END_POINT}/documents/create`, {
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
  
    if (file) {
      const fileSizeMB = file.size / (1024 * 1024); // Convert bytes to MB
  
      // Allow files up to 5MB
      if (fileSizeMB > 5) {
        setImageError("File size must be less than 5MB.");
        setSelectedFile(null);
        setFileName("");
        setImagePreview("");
        return;
      } else {
        setImageError(""); // Clear error if file size is valid
      }
  
      // Set file and file name
      formik.setFieldValue("image", file.name);
      setSelectedFile(file);
      setFileName(file.name);
  
      // Generate image preview if the file is an image
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(""); // Clear preview for non-image files
      }
    }
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
    <Box
      sx={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        Add Document
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "8px",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Document Details
              </Typography>

              <InputLabel>Add Image and File</InputLabel>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  color="primary"
                  onClick={() => fileInputRef.current.click()}
                >
                  <AddPhotoAlternateIcon />
                </IconButton>
                <input
                  name="file"
                  type="file"
                  accept="*/*"
                  onChange={handleFileChange} // Use the updated handleFileChange
                  ref={fileInputRef}
                  style={{ display: "none" }}
                />
              </Box>

              {fileName && (
                <Typography variant="body2" sx={{ marginTop: 1 }}>
                  Selected File: {fileName}{" "}
                  {/* Display the selected file name */}
                </Typography>
              )}

              {/* Display image preview only if the selected file is an image */}
              {(imagePreview &&
                !imageError &&
                fileName &&
                fileName.endsWith(".jpg")) ||
              fileName.endsWith(".jpeg") ||
              fileName.endsWith(".png") ? (
                <img
                  src={imagePreview}
                  alt="Selected"
                  style={{
                    marginTop: "10px",
                    maxWidth: "100%",
                    height: "auto",
                    borderRadius: "8px",
                  }}
                />
              ) : fileName &&
                !imagePreview &&
                !imageError &&
                (fileName.endsWith(".pdf") || fileName.endsWith(".zip")) ? (
                <Typography variant="body2" sx={{ marginTop: 1 }}></Typography>
              ) : null}

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
                sx={{ marginBottom: "10px" }}
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={3}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
                margin="normal"
                sx={{ marginBottom: "10px" }}
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
                sx={{ marginBottom: "10px" }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "8px",
              }}
            >
              <InputLabel>Receiver</InputLabel>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "10px",
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectAll}
                      onChange={handleSelectAllChange}
                      color="primary"
                    />
                  }
                  label="Select All"
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
                {formik.touched.receiver && formik.errors.receiver && (
                  <Typography
                    variant="body2"
                    color="error"
                    sx={{ marginTop: 1 }}
                  >
                    {formik.errors.receiver}
                  </Typography>
                )}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <Switch
                  checked={formik.values.autoUpdate}
                  onChange={() =>
                    formik.setFieldValue(
                      "autoUpdate",
                      !formik.values.autoUpdate
                    )
                  }
                  color="primary"
                />
                <Typography variant="body1" sx={{ marginLeft: 1 }}>
                  Auto Update
                </Typography>
              </Box>

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
                      error={
                        formik.touched.fromDate &&
                        Boolean(formik.errors.fromDate)
                      }
                      helperText={
                        formik.touched.fromDate && formik.errors.fromDate
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
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
                      error={
                        formik.touched.toDate && Boolean(formik.errors.toDate)
                      }
                      helperText={formik.touched.toDate && formik.errors.toDate}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>
              )}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "20px",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    marginTop: "24px",
                    borderRadius: "15px",
                    padding: "8px",
                  }}
                >
                  Save
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
