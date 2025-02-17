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
  InputLabel,
  Alert,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useNavigate } from "react-router-dom";
import "../announcement/announcement.css";

const AddMediaNews = ({ onClose }) => {
  const navigate = useNavigate();
  const [documentID, setDocumentID] = useState("");
  const [fileName, setFileName] = useState(""); // Declare fileName state

  const fileInputRef = useRef(null);

  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [linkError, setLinkError] = useState("");
  const [receiver, setReceiver] = useState([""]);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileName, setImageFileName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [imageError, setImageError] = useState("");
  const [headingError, setHeadingError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [event_date, setEventDate] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("success");
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;
  const [eventDateError, setEventDateError] = useState("");
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

      // Check if file size exceeds 5MB
      if (file.size > MAX_FILE_SIZE) {
        setImageError("File size must be less than 5MB");
        setImageFile(null);
        setImageFileName("");
        setPreviewUrl("");
        setFileName("");
        return;
      }

      // Allow all file types (no restriction on MIME types)
      setImageError(""); // Clear error if file is valid
      setImageFile(file);
      setImageFileName(file.name);
      setFileName(file.name);

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

    // Validate Event Date (Check if not in the past)
    if (!event_date) {
      setEventDateError("Event date is required.");
      isValid = false;
    } else {
      const selectedDate = new Date(event_date);
      const currentDate = new Date();

      // Compare dates, ensure selected date is not in the past
      if (selectedDate < currentDate.setHours(0, 0, 0, 0)) {
        // Comparing date without time
        setEventDateError("Event date cannot be in the past.");
        isValid = false;
      } else {
        setEventDateError(""); // Clear error if date is valid
      }
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const randomDocumentID = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    setDocumentID(randomDocumentID);

    if (!validateForm()) {
      return; // Prevent form submission if validation fails
    }

    const formData = new FormData();
    formData.append("documentID", randomDocumentID);
    formData.append("heading", heading);
    formData.append("description", description);
    formData.append("event_date", event_date);
    formData.append("link", link);
    formData.append("receiver", JSON.stringify(receiver));

    if (imageFile) {
      formData.append("file", imageFile);
    }

    try {
      const response = await fetch(`${API_END_POINT}/media-news/create`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Show success message in Snackbar
        setSnackbarMessage("Media/News created successfully!");
        setSnackbarType("success");
        setOpenSnackbar(true);

        // Redirect after a short delay
        setTimeout(() => {
          navigate("/dashboard/media-news");
        }, 2000);

        // Reset form state
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
        setErrorMessage(`Failed to save Media/News: ${errorText}`);
      }
    } catch (error) {
      setErrorMessage("Error submitting the form: " + error.message);
      // Show error message in Snackbar
      setSnackbarMessage("Error submitting the form. Please try again.");
      setSnackbarType("error");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      p={3}
      component="form"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        Add Media / News
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
                onChange={handleFileChange}
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
            {previewUrl &&
            !imageError &&
            (fileName.endsWith(".jpg") ||
              fileName.endsWith(".jpeg") ||
              fileName.endsWith(".png")) ? (
              <img
                src={previewUrl}
                alt="Selected"
                style={{
                  marginTop: "10px",
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "8px",
                }}
              />
            ) : fileName &&
              !previewUrl &&
              !imageError &&
              (fileName.endsWith(".pdf") || fileName.endsWith(".zip")) ? (
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                {/* Optional: Provide additional file-specific details if needed */}
              </Typography>
            ) : null}

            <TextField
              fullWidth
              label="Media / News Heading*"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              placeholder="Enter Media/News Heading"
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
            <Box sx={{ marginTop: "10px" }}>
              <InputLabel sx={{ marginBottom: 1 }}>
                Date Of Event (Published)
              </InputLabel>

              <TextField
                fullWidth
                type="date"
                value={event_date}
                name="event_date"
                onChange={(e) => setEventDate(e.target.value)}
                sx={{ marginTop: 1 }}
                error={!!eventDateError} // Error state for the field
              />

              {eventDateError && (
                <Typography
                  variant="body2"
                  color="error"
                  sx={{ marginTop: "10px" }}
                >
                  {eventDateError}
                </Typography>
              )}
            </Box>
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
              {errorMessage && (
                <Typography
                  variant="body2"
                  color="error"
                  sx={{ marginTop: "10px" }}
                >
                  {errorMessage}
                </Typography>
              )}
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              sx={{ marginTop: "20px" }}
              fullWidth
            >
              Add Media/News
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
    </Box>
  );
};

export default AddMediaNews;
