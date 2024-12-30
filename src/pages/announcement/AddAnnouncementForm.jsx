import React, { useState } from "react";
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
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useNavigate } from "react-router-dom";
import "./announcement.css";

const AddAnnouncementDetails = ({ onClose }) => {
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

  const roles = [
    { label: "Area Development Officer (ADO)", value: "Area Development Officer" },
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
      setReceiver((prevReceivers) => prevReceivers.filter((item) => item !== value));
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    
    if (file) {
      const fileSizeMB = file.size / (1024 * 1024); // Convert size from bytes to MB
  
      // Check if the file type is valid (JPEG, JPG, PNG)
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setImageError("Only JPEG, JPG, and PNG files are allowed.");
        setImageFile(null); // Clear any previously selected file
        setImageFileName("");
        setPreviewUrl("");
      } 
      // Check if file size exceeds 2MB
      else if (fileSizeMB > 2) {
        setImageError("File size must be less than 2MB");
        setImageFile(null); // Clear any previously selected file
        setImageFileName("");
        setPreviewUrl("");
      } 
      else {
        setImageError(""); // Clear error if file is valid
        setImageFile(file);
        setImageFileName(file.name);
  
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
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
    } else if (!value.trim()) {
      setLinkError("Link is required.");
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
      validateLink(value); // This will update linkError accordingly
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
  
    // Validate Link
    if (!link) {
      setLinkError("Link is required.");
      isValid = false;
    } else {
      validateLink(link);
      if (linkError) {
        isValid = false;
      }
    }
  
    return isValid;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const randomDocumentID = Math.floor(100000 + Math.random() * 900000).toString();
    setDocumentID(randomDocumentID);

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("documentID", randomDocumentID);
    formData.append("heading", heading);
    formData.append("description", description);
    formData.append("link", link);
    formData.append("receiver", JSON.stringify(receiver));
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await fetch(`${API_END_POINT}/announcements/create`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSuccessMessage("Announcement created successfully!");
        navigate("/dashboard/announcement");
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
      }
    } catch (error) {
      setErrorMessage("Error submitting the form: " + error.message);
    }
  };

  return (
    <Box p={3} component="form" onSubmit={handleSubmit} encType="multipart/form-data">
      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        Announcement / Add Announcement
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 2 }}>
            <InputLabel>Add Images</InputLabel>
            <IconButton color="primary" component="label">
              <AddPhotoAlternateIcon />
              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </IconButton>
            {imageFileName && (
              <Typography variant="body2" sx={{ marginTop: "10px" }}>
                Selected file: {imageFileName}
              </Typography>
            )}
            {previewUrl && (
              <Box sx={{ marginTop: "10px" }}>
                <img src={previewUrl} alt="Preview" style={{ maxWidth: "100%", height: "auto" }} />
              </Box>
            )}
            {imageError && (
              <Typography variant="body2" color="error" sx={{ marginTop: "10px" }}>
                {imageError}
              </Typography>
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
              style={{ width: "100%", margin: "16px 0", backgroundColor: "#f5f5f5" }}
            />
            {descriptionError && (
              <Typography variant="body2" color="error" sx={{ marginTop: "10px" }}>
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
  <Typography variant="body2" color="error" sx={{ marginTop: "10px" }}>
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
              <Typography variant="body2" color="error" sx={{ marginTop: "10px" }}>
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
              <Typography variant="body2" color="success" sx={{ marginTop: "10px" }}>
                {successMessage}
              </Typography>
            )}
          </Box>
        </Grid>
        
        </Grid>

    </Box>
  );
};

export default AddAnnouncementDetails;
