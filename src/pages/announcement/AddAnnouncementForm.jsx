import React, { useState, useRef } from "react";

import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Typography,
  Box,
  TextField,
  TextareaAutosize,
  Grid,
  IconButton,
  Snackbar,
  Alert,
  InputLabel,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useNavigate } from "react-router-dom";
import "./announcement.css";

const AddAnnouncementDetails = ({ onClose }) => {

  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState(""); // Declare fileName state

  const navigate = useNavigate();
  const [documentID, setDocumentID] = useState("");
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [linkError, setLinkError] = useState("");
  const [receiver, setReceiver] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileName, setImageFileName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [imageError, setImageError] = useState("");
  const [headingError, setHeadingError] = useState("");
  const [descriptionError, setDescriptionError] = useState(""); // Add descriptionError state
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;
  const [imagePreview, setImagePreview] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState("success");

  const roles = [
    {
      label: "Area Development Officer (ADO)",
      value: "Area Development Officer",
    },
    { label: "Master Distributor (MD)", value: "Master Distributor" },
    { label: "Super Distributor (SD)", value: "Super Distributor" },
    { label: "Distributor", value: "Distributor" },
    { label: "Customer", value: "Customer" },
  ];

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setReceiver((prevReceivers) => [...prevReceivers, value]);
    } else {
      setReceiver((prevReceivers) =>
        prevReceivers.filter((item) => item !== value)
      );
      setSelectAll(false); // Uncheck "Select All" if any item is unchecked
    }
  };

  const handleSelectAllChange = (event) => {
    const { checked } = event.target;
    setSelectAll(checked);
    if (checked) {
      setReceiver(roles.map((role) => role.value));
    } else {
      setReceiver([]);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  
    if (file) {
      const fileSizeMB = file.size / (1024 * 1024); // Convert size from bytes to MB
  
      // Allow all image types dynamically and all file types
      if (file.size > MAX_FILE_SIZE) {
        setImageError("File size must be less than 5MB");
        setImageFile(null); // Clear any previously selected file
        setImageFileName("");
        setPreviewUrl("");
      } else {
        setImageError(""); // Clear error if file is valid
        setImageFile(file);
        setImageFileName(file.name);
  
        // If the file is an image, generate a preview
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewUrl(reader.result);
          };
          reader.readAsDataURL(file);
        } else {
          setPreviewUrl(""); // Clear preview for non-image files
        }
      }
    }
  };
  
  

  const validateLink = (value) => {
    // Updated regex for validating general and specific URLs
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?(www\\.)?([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}(\\/[a-zA-Z0-9@:%_\\+.~#?&//=]*)?$"
    );

    if (value && !urlPattern.test(value)) {
      setLinkError("Please enter a valid URL.");
    } else {
      setLinkError(""); // Clear the error if the link is valid
    }
  };

  const handleLinkChange = (e) => {
    const value = e.target.value;
    setLink(value);

    if (!value.trim()) {
      setLinkError("Link is required.");
    } else {
      validateLink(value);
    }
  };

  const validateDescription = (value) => {
    if (!value.trim()) {
      setDescriptionError("Description is required.");
      return false;
    }
    return true;
  };

  const validateForm = () => {
    let isValid = true;

    // Validate Heading
    if (!heading) {
      setHeadingError("Heading is required.");
      isValid = false;
    } else {
      setHeadingError("");
    }

    // Validate Receiver
    if (!receiver.length) {
      setErrorMessage("Please select at least one receiver.");
      isValid = false;
    } else {
      setErrorMessage("");
    }

    // Validate Description
    if (!validateDescription(description)) {
      isValid = false;
    } else {
      setDescriptionError("");
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const randomDocumentID = Math.floor(100000 + Math.random() * 900000).toString();
    setDocumentID(randomDocumentID);

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("documentID", randomDocumentID);
    formData.append("heading", heading);
    formData.append("description", description);
    formData.append("link", link);
    formData.append("receiver", JSON.stringify(receiver));
    if (imageFile) {
      formData.append("file", imageFile);
    }

    try {
      const response = await fetch(`${API_END_POINT}/announcements/create`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSuccessMessage("Announcement created successfully!");
        setSnackbarType("success");
        setOpenSnackbar(true);

        // Delay navigation by 2 seconds
        setTimeout(() => {
          setOpenSnackbar(false);
          navigate("/dashboard/announcement");
        }, 2000);

        // Reset form fields
        setDocumentID("");
        setHeading("");
        setDescription("");
        setLink("");
        setReceiver([]);
        setImageFile(null);
        setImageFileName("");
        setPreviewUrl("");
        setSelectAll(false);
      } else {
        const errorText = await response.text();
        setErrorMessage(`Failed to save announcement: ${errorText}`);
        setSnackbarType("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setErrorMessage("Error submitting the form: " + error.message);
      setSnackbarType("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box
      p={3}
      component="form"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        Announcement / Add Announcement
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 2 }}>
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
                Selected File: {fileName} {/* Display the selected file name */}
              </Typography>
            )}

            {/* Display image preview only if the selected file is an image */}
            {imagePreview &&
            !imageError &&
            fileName &&
            (fileName.endsWith(".jpg") ||
              fileName.endsWith(".jpeg") ||
              fileName.endsWith(".png")) ? (
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
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                {/* Optional: Provide additional file-specific details if needed */}
              </Typography>
            ) : null}

            {imageError && (
              <Typography variant="body2" color="error" sx={{ marginTop: 1 }}>
                {imageError}
              </Typography>
            )}

            {/* Code for adding a single image file */}
           
            {imageFileName && (
              <Typography variant="body2" sx={{ marginTop: "10px" }}>
                Selected file: {imageFileName}
              </Typography>
            )}
            {previewUrl && (
              <Box sx={{ marginTop: "10px" }}>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </Box>
            )}
            

            <TextField
              fullWidth
              label="Announcement Heading*"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              placeholder="Enter Announcement Heading"
              margin="normal"
              error={!!headingError}
              helperText={headingError}
            />
            <TextareaAutosize
              minRows={3}
              placeholder="Enter Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: "100%",
                margin: "16px 0",
                backgroundColor: "#f5f5f5",
              }}
            />
            {descriptionError && (
              <Typography
                variant="body2"
                color="error"
                sx={{ marginTop: "10px" }}
              >
                {descriptionError}
              </Typography>
            )}
            <TextField
              fullWidth
              label="Link"
              value={link}
              onChange={handleLinkChange}
              placeholder="Enter a valid link"
              margin="normal"
              error={!!linkError} // Error state for the field
            />
            {linkError && (
              <Typography
                variant="body2"
                color="error"
                sx={{ marginTop: "10px" }}
              >
                {linkError}
              </Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 2 }}>
            <InputLabel>Receiver</InputLabel>
            <FormControl fullWidth margin="normal">
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
                  key={role.value}
                  control={
                    <Checkbox
                      checked={receiver.includes(role.value)}
                      onChange={handleCheckboxChange}
                      value={role.value}
                    />
                  }
                  label={role.label}
                />
              ))}
            </FormControl>
            {errorMessage && (
              <Typography
                variant="body2"
                color="error"
                sx={{ marginTop: "10px" }}
              >
                {errorMessage}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              sx={{ marginTop: "20px" }}
              fullWidth
            >
              Add Announcement
            </Button>
            {successMessage && (
              <Typography
                variant="body2"
                color="success"
                sx={{ marginTop: "10px" }}
              >
                {successMessage}
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarType}
          variant="filled"
        >
          {successMessage || errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddAnnouncementDetails;
