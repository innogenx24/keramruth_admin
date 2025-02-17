import React, { useState, useEffect } from "react";
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
import { useNavigate, useLocation } from "react-router-dom";
import "../announcement/announcement.css";
import { API_END_POINT_IMG } from "../../constants/ApiConstant";

const EditMediaNews = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const news = location.state?.news || {};
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;
  const imageBaseURL = `${API_END_POINT_IMG}/uploads/`;
  const [documentID, setDocumentID] = useState("");
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [event_date, setEventDate] = useState("");
  const [receiver, setReceiver] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileName, setImageFileName] = useState("");
  const [existingImage, setExistingImage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [eventDateError, setEventDateError] = useState("");

  // Separate error state for each field
  const [headingError, setHeadingError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [linkError, setLinkError] = useState("");
  const [receiverError, setReceiverError] = useState("");
  const [imageError, setImageError] = useState(""); // Image file error state
  const [errorMessage, setErrorMessage] = useState(""); // General error message
  const [successMessage, setSuccessMessage] = useState(""); // Add this state for success messages
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
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
  useEffect(() => {
    if (news) {
      setDocumentID(news.documentID || "");
      setHeading(news.heading || "");
      setDescription(news.description || "");
      setLink(news.link || "");
      setEventDate(news.event_date || "");

      setReceiver(news.receiver || []);
      setImageFileName(news.image ? news.image.split("/").pop() : "");
      setExistingImage(news.image ? `${imageBaseURL}${news.image}` : "");
    }
  }, [news]);

  useEffect(() => {
    setSelectAll(receiver.length === roles.length);
  }, [receiver]);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;

    setReceiver((prevReceivers) => {
      const currentReceivers = Array.isArray(prevReceivers)
        ? prevReceivers
        : [];
      if (checked) {
        return [...currentReceivers, value];
      }
      return currentReceivers.filter((item) => item !== value);
    });
  };

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setReceiver(roles.map((role) => role.value));
    } else {
      setReceiver([]);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB size limit
      const fileSizeMB = file.size / (1024 * 1024); // Convert size to MB
  
      // Validate file size
      if (fileSizeMB > 5) {
        setImageError("File size must be less than 5MB.");
        setImageFile(null); 
        setImageFileName("");
        setPreviewUrl("");
        setExistingImage(""); 
        return;
      }
  
      // Allow all file types
      setImageError("");
      setImageFile(file);
      setImageFileName(file.name);
  
      // Generate preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
        setExistingImage(""); 
      } else {
        setPreviewUrl(""); // No preview for non-image files
        setExistingImage(""); 
      }
    }
  };
  

  const validateLink = (url) => {
    const regex =
      /^(https?:\/\/)?(www\.)?([a-zA-Z]+\.)?[a-zA-Z]+\.[a-z]{2,}(\/[^\s]*)?$/;
    return regex.test(url);
  };

  const validateForm = () => {
    let isValid = true;
  
    // Reset all error messages
    setHeadingError("");
    setDescriptionError("");
    setLinkError("");
    setReceiverError("");
    setImageError("");
    setErrorMessage(""); // Reset the general error message
    setEventDateError(""); // Reset event date error
  
    // Validate Heading
    if (!heading) {
      setHeadingError("Heading is required.");
      isValid = false;
    }
  
    // Validate Receiver
    if (receiver.length === 0) {
      setReceiverError("Please select at least one receiver.");
      isValid = false;
    }
  
    // Validate Description
    if (!description.trim()) {
      setDescriptionError("Description is required.");
      isValid = false;
    }
  
    // Validate Link
    if (link.trim() && !validateLink(link)) {
      setLinkError("Please enter a valid URL.");
      isValid = false;
    } else if (!link.trim()) {
      setLink("");
    }
  
    // Validate Event Date (ensure it is not in the past)
    if (!event_date) {
      setEventDateError("Event date is required.");
      isValid = false;
    } else {
      const selectedDate = new Date(event_date);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Set to the beginning of today (midnight)
  
      if (selectedDate < currentDate) {
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

    if (!validateForm()) {
      return; // Prevent form submission if validation fails
    }

    const formData = new FormData();
    formData.append("heading", heading);
    formData.append("description", description);
    formData.append("event_date", event_date);
    if (link.trim()) {
      formData.append("link", link);
    }
    formData.append("receiver", JSON.stringify(receiver));
    if (imageFile) {
      formData.append("file", imageFile);
    }

    try {
      const response = await fetch(`${API_END_POINT}/media-news/${news.id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        // Set success message and show Snackbar
        setSnackbarMessage("Media/News updated successfully!");
        setSnackbarType("success");
        setOpenSnackbar(true);

        const result = await response.json();
        console.log("Updated Media/News:", result);

        // Redirect to Media/News page after a short delay
        setTimeout(() => {
          navigate("/dashboard/media-news");
        }, 2000);
      } else {
        const errorText = await response.text();
        setErrorMessage(`Failed to update Media / News: ${errorText}`);
        // Show error message in Snackbar
        setSnackbarMessage(`Failed to update: ${errorText}`);
        setSnackbarType("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setErrorMessage("Error updating the Media / News: " + error.message);
      // Show error message in Snackbar
      setSnackbarMessage("Error updating the Media / News. Please try again.");
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
        Edit Media / News
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 2 }}>
            <InputLabel>Edit Images and File</InputLabel>

            <IconButton color="primary" component="label">
              <AddPhotoAlternateIcon />
              <input
                type="file"
                hidden
                accept="*/*"
                onChange={handleFileChange}
              />
            </IconButton>
            {imageFileName && (
              <Typography variant="body2" sx={{ marginTop: "10px" }}>
                Selected file: {imageFileName}
              </Typography>
            )}

            {/* Show preview if the file is an image */}
            {previewUrl && (
              <Box sx={{ marginTop: "10px" }}>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </Box>
            )}

            {/* Show existing image if available */}
            {existingImage && (
              <Box sx={{ marginTop: "10px" }}>
                <img
                  src={existingImage}
                  alt="Existing Image"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </Box>
            )}

            {/* Display error if any */}
            {imageError && (
              <Typography
                variant="body2"
                sx={{ color: "red", marginTop: "10px" }}
              >
                {imageError}
              </Typography>
            )}
            <TextField
              fullWidth
              label="Enter Media / News Heading*"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              margin="normal"
            />
            {headingError && (
              <Typography
                variant="body2"
                sx={{ color: "red", marginTop: "10px" }}
              >
                {headingError}
              </Typography>
            )}
            <TextareaAutosize
              minRows={4}
              maxRows={6}
              placeholder="Description"
              style={{ width: "100%", marginTop: "20px" }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {descriptionError && (
              <Typography
                variant="body2"
                sx={{ color: "red", marginTop: "10px" }}
              >
                {descriptionError}
              </Typography>
            )}

            <TextField
              fullWidth
              label="Link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Enter Link"
              margin="normal"
            />
            {linkError && (
              <Typography
                variant="body2"
                sx={{ color: "red", marginTop: "10px" }}
              >
                {linkError}
              </Typography>
            )}
            <Box sx={{ marginTop: "10px" }}>
  <InputLabel>Date Of Event (Published)</InputLabel>
  <TextField
    label="Event Date"
    type="date"
    value={event_date}
    onChange={(e) => setEventDate(e.target.value)}
    fullWidth
    margin="normal"
    InputLabelProps={{
      shrink: true,
    }}
    error={!!eventDateError} // Show error if eventDateError exists
  />
  {eventDateError && (
    <Typography
      variant="body2"
      sx={{ color: "red", marginTop: "10px" }}
    >
      {eventDateError}
    </Typography>
  )}
</Box>

          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 2 }}>
            <FormControl fullWidth margin="normal">
              <Typography variant="h6">Select Receivers</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectAll}
                    onChange={handleSelectAllChange}
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
              {receiverError && (
                <Typography
                  variant="body2"
                  sx={{ color: "red", marginTop: "10px" }}
                >
                  {receiverError}
                </Typography>
              )}
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ marginTop: 3, width: "100%" }}
            >
              Update Announcement
            </Button>
          </Box>
        </Grid>
      </Grid>

      {errorMessage && (
        <Typography variant="body2" sx={{ color: "red", marginTop: "20px" }}>
          {errorMessage}
        </Typography>
      )}

<Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarType} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditMediaNews;
