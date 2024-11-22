import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  TextField,
  TextareaAutosize,
  Grid,
  Switch,
  Typography,
  IconButton,
  InputLabel,
  FormControlLabel,
  Checkbox,
  FormControl,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useLocation, useNavigate } from "react-router-dom";

const EditDocumentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const document = location.state?.document || {};

  const imageBaseURL = "http://88.222.245.236:3002/uploads/";
  const roles = [
    { label: "Area Development Officer", value: "Area Development Officer" },
    { label: "Master Distributor", value: "Master Distributor" },
    { label: "Super Distributor", value: "Super Distributor" },
    { label: "Distributor", value: "Distributor" },
    { label: "Customer", value: "Customer" },
  ];

  const [autoUpdate, setAutoUpdate] = useState(false);
  const [activateStatus, setActivateStatus] = useState(false);
  const [documentID, setDocumentID] = useState("");
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [receiver, setReceiver] = useState([]); // array of roles
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [imageError, setImageError] = useState(""); // State for image error message

  useEffect(() => {
    if (document) {
      setAutoUpdate(document.autoUpdate || false);
      setActivateStatus(document.activateStatus || false);
      setDocumentID(document.documentID || "");
      setHeading(document.heading || "");
      setDescription(document.description || "");
      setLink(document.link || "");
      setReceiver(document.receiver || []);
      setFromDate(document.fromDate ? document.fromDate.split("T")[0] : "");
      setToDate(document.toDate ? document.toDate.split("T")[0] : "");
      setImageName(document.image || "");
    }
  }, [document]);

  useEffect(() => {
    setSelectAll(roles.every((role) => receiver.includes(role.value)));
  }, [receiver]);

  const handleReceiverChange = (event) => {
    const { value, checked } = event.target;
  
    setReceiver((prev) => {
      if (value === "selectAll") {
        return checked ? roles.map((role) => role.value) : [];
      } else {
        const newReceiver = Array.isArray(prev) ? [...prev] : [];
        return checked
          ? [...newReceiver, value] 
          : newReceiver.filter((role) => role !== value); 
      }
    });
  };  

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileSizeMB = file.size / (1024 * 1024); // Convert file size to MB

      // Check if file size exceeds 2MB
      if (fileSizeMB > 2) {
        setImageError("File size must be less than 2MB");
        setImage(null); // Reset image if the file is too large
        return; // Prevent further actions
      } else {
        setImageError(""); // Clear error if file size is valid
      }

      setImage(file);
      setImageName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("documentID", documentID);
    formData.append("heading", heading);
    formData.append("description", description);
    formData.append("link", link);
  
    // Send the receiver array as a JSON string
    formData.append("receiver", JSON.stringify(receiver));
  
    formData.append("autoUpdate", autoUpdate);
    formData.append("activateStatus", activateStatus);
    formData.append("fromDate", fromDate);
    formData.append("toDate", toDate);
  
    if (image) {
      formData.append("image", image);
    }
  
    try {
      const response = await fetch(
        `http://88.222.245.236:3002/documents/${document.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to update document");
      }
  
      const result = await response.json();
      console.log("Document updated:", result);
      navigate("/dashboard/documents");
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };
  return (
    <Box p={3} component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" sx={{ marginBottom: "20px" }}>
        Edit Document
      </Typography>
      <Grid container spacing={3}>
        {/* Left Side: Image and Basic Info */}
        <Grid item xs={12} md={6}>
          <Box p={2} sx={{ backgroundColor: "#f5f5f5", borderRadius: 2 }}>
          <InputLabel>Edit Images</InputLabel>
      <IconButton color="primary" component="label">
        <AddPhotoAlternateIcon />
        <input type="file" hidden onChange={handleImageUpload} />
      </IconButton>
      {imageName && <Typography variant="body2">{imageName}</Typography>}

      {imageError && (
        <Typography variant="body2" color="error" sx={{ marginTop: 1 }}>
          {imageError}
        </Typography>
      )}

      <Box sx={{ marginTop: "16px" }}>
        {image ? (
          <img
            src={URL.createObjectURL(image)}
            alt="Uploaded Preview"
            style={{ maxWidth: "100%", maxHeight: "200px", marginTop: "8px" }}
          />
        ) : (
          document.image && (
            <img
              src={`${imageBaseURL}${document.image}`}
              alt="Existing Document Image"
              style={{ maxWidth: "100%", maxHeight: "200px", marginTop: "8px" }}
            />
          )
        )}
      </Box>
            <TextField
              fullWidth
              label="Heading"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              margin="normal"
            />
            <TextareaAutosize
              minRows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              style={{ width: "100%", margin: "16px 0" }}
            />
            <TextField
              fullWidth
              label="Link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              margin="normal"
            />
          </Box>
        </Grid>

        {/* Right Side: Receiver and Actions */}
        <Grid item xs={12} md={6}>
          <Box sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Select Receiver Roles
            </Typography>
            <InputLabel>Receiver</InputLabel>
            <FormControl fullWidth margin="normal">
              {/* Select All Checkbox */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectAll}
                    onChange={handleReceiverChange}
                    value="selectAll"
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
                      onChange={handleReceiverChange}
                      value={role.value}
                    />
                  }
                  label={role.label}
                />
              ))}
            </FormControl>

            {/* Auto Update */}
            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <label style={{ marginRight: "8px" }}>Auto Update</label>
              <Switch
                checked={autoUpdate}
                onChange={(e) => setAutoUpdate(e.target.checked)}
                color="primary"
              />
            </Box>

            {/* Show date fields if Auto Update is enabled */}
            {autoUpdate && (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="From Date"
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="To Date"
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Status Toggle */}
            {/* <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <label style={{ marginRight: "8px" }}>Activate Status</label>
              <Switch
                checked={activateStatus}
                onChange={(e) => setActivateStatus(e.target.checked)}
                color="primary"
              />
            </Box> */}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
            >
              Update Document
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditDocumentForm;
