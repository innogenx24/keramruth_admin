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
  
      // Check if file size exceeds 2MB
      if (fileSizeMB > 2) {
        setImageError("File size must be less than 2MB");
        setImageFile(null); // Clear any previously selected file
        setImageFileName("");
        setPreviewUrl("");
      } else {
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
    const urlPattern = new RegExp(
      "^(https?:\/\/)?(www\.)?((youtube\.com\/(?:[^\/]+\/[^\/]+\/|(?:v|e(?:mbed))\/?))|(youtu\.be\/))([a-zA-Z0-9-]+)(\?[^\s]*)?$|^https?:\/\/(.*\.(?:jpg|jpeg|png|gif|bmp|webp|svg))$"
    );
    
    if (value && !urlPattern.test(value)) {
      setLinkError("Please enter a valid URL.");
    } else {
      setLinkError("");
    }
  };

  const handleLinkChange = (e) => {
    const value = e.target.value;
    setLink(value);
    validateLink(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const randomDocumentID = Math.floor(100000 + Math.random() * 900000).toString();
    setDocumentID(randomDocumentID);

    if (!randomDocumentID || !heading || receiver.length === 0 || linkError) {
      setErrorMessage("Please fill in all required fields with valid data.");
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
      const response = await fetch("http://88.222.245.236:3002/announcements/create", {
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
              required
              margin="normal"
            />
            <TextareaAutosize
              minRows={3}
              placeholder="Enter Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: "100%", margin: "16px 0", backgroundColor: "#f5f5f5" }}
            />
            <TextField
              fullWidth
              label="Link"
              value={link}
              onChange={handleLinkChange}
              placeholder="Enter Link"
              margin="normal"
              error={!!linkError}
              helperText={linkError}
            />
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

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: "24px", borderRadius: "15px", padding: "8px" }}
            >
              Save
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={!!successMessage}
        onClose={() => setSuccessMessage("")}
        message={successMessage}
        autoHideDuration={3000}
      />

      <Snackbar
        open={!!errorMessage}
        onClose={() => setErrorMessage("")}
        message={errorMessage}
        autoHideDuration={3000}
      />
    </Box>
  );
};

export default AddAnnouncementDetails;
