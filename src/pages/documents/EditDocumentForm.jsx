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
    { label: "Area Development Officer (ADO)", value: "Area Development Officer" },
    { label: "Master Distributor (MD)", value: "Master Distributor" },
    { label: "Super Distributor (SD)", value: "Super Distributor" },
    { label: "Distributor", value: "Distributor" },
    { label: "Customer", value: "Customer" },
  ];

  // State variables
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [activateStatus, setActivateStatus] = useState(false);
  const [documentID, setDocumentID] = useState("");
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [receiver, setReceiver] = useState([]); // receiver as an array of selected roles
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [image, setImage] = useState(null); // Keep as a file object
  const [imageName, setImageName] = useState("");
  const [selectAll, setSelectAll] = useState(false); // state for 'Select All' checkbox

  useEffect(() => {
    if (document) {
      setAutoUpdate(document.autoUpdate || false);
      setActivateStatus(document.activateStatus || false);
      setDocumentID(document.documentID || "");
      setHeading(document.heading || "");
      setDescription(document.description || "");
      setLink(document.link || "");
      setReceiver(document.receiver || []); // Ensure it's an array
      setFromDate(document.fromDate ? document.fromDate.split("T")[0] : "");
      setToDate(document.toDate ? document.toDate.split("T")[0] : "");
      setImageName(document.image ? document.image.split("/").pop() : "");
      setImage(null); // Reset image state when document is loaded
    }
  }, [document]);

  useEffect(() => {
    // Sync 'Select All' checkbox with receiver list
    setSelectAll(roles.length > 0 && roles.every(role => receiver.includes(role.value)));
  }, [receiver]);

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file); // Store the file object
      setImageName(file.name); // Set the image name
    }
  };

  const handleReceiverChange = (event) => {
    const { value, checked } = event.target;
  
    if (value === "selectAll") {
      // Toggle select/deselect all roles
      setReceiver(checked ? roles.map(role => role.value) : []);
    } else {
      setReceiver((prevReceiver) => {
        const currentReceiver = Array.isArray(prevReceiver) ? prevReceiver : []; // Ensure it's an array
        if (checked) {
          return [...currentReceiver, value]; // Add the role to receiver if checked
        } else {
          return currentReceiver.filter((role) => role !== value); // Remove role from receiver if unchecked
        }
      });
    }
  };
  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedDocument = new FormData();
    updatedDocument.append("documentID", documentID);
    updatedDocument.append("heading", heading);
    updatedDocument.append("description", description);
    updatedDocument.append("link", link);
    updatedDocument.append("receiver", JSON.stringify(receiver)); // Store receiver as a JSON string
    updatedDocument.append("autoUpdate", autoUpdate);
    updatedDocument.append("activateStatus", activateStatus);
    updatedDocument.append("fromDate", fromDate);
    updatedDocument.append("toDate", toDate);

    if (image) {
      updatedDocument.append("image", image);
    }

    try {
      const response = await fetch(`http://88.222.245.236:3002/documents/${document.id}`, {
        method: "PUT",
        body: updatedDocument,
      });

      if (!response.ok) {
        throw new Error("Failed to update document");
      }

      const result = await response.json();
      console.log("Document updated successfully:", result);
      navigate("/dashboard/documents");
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  return (
    <Box p={3} component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        Document / Edit Document
      </Typography>
      <Grid container spacing={3}>
        {/* Left Side: Document Details */}
        <Grid item xs={12} md={6}>
          <Box sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 2 }}>
            <InputLabel>Edit Images</InputLabel>
            <IconButton color="primary" component="label">
              <AddPhotoAlternateIcon />
              <input
                type="file"
                hidden
                onChange={handleImageUpload}
              />
            </IconButton>
            {imageName && <Typography variant="body2">{imageName}</Typography>}

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
              label="Document Heading*"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              placeholder="Enter Document Heading"
              required
              margin="normal"
            />

            <TextareaAutosize
              minRows={3}
              placeholder="Enter Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: "100%", margin: "16px 0" }}
              required
            />

            <TextField
              fullWidth
              label="Link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Enter Link"
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
            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <label style={{ marginRight: "8px" }}>Activate Status</label>
              <Switch
                checked={activateStatus}
                onChange={(e) => setActivateStatus(e.target.checked)}
                color="primary"
              />
            </Box>

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
