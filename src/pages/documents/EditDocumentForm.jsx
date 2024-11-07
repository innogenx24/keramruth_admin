import React, { useState, useEffect } from "react";
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Switch,
  Box,
  TextField,
  TextareaAutosize,
  Grid,
  IconButton,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useLocation, useNavigate } from "react-router-dom";

const EditDocumentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const document = location.state?.document || {};

  // State variables
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [activateStatus, setActivateStatus] = useState(false);
  const [documentID, setDocumentID] = useState("");
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [receiver, setReceiver] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [image, setImage] = useState(null); // Keep as a file object
  const [imageName, setImageName] = useState("");

  // Effect to initialize state based on document details
  useEffect(() => {
    if (document) {
      setAutoUpdate(document.autoUpdate || false);
      setActivateStatus(document.activateStatus || false);
      setDocumentID(document.documentID || "");
      setHeading(document.heading || "");
      setDescription(document.description || "");
      setLink(document.link || "");
      setReceiver(document.receiver || "");
      setFromDate(document.fromDate ? document.fromDate.split("T")[0] : "");
      setToDate(document.toDate ? document.toDate.split("T")[0] : "");
      setImageName(document.image ? document.image.split('/').pop() : ""); // Set image name based on URL
    }
  }, [document]);

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file); // Store the file object
      setImageName(file.name); // Set the image name
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
    updatedDocument.append("receiver", receiver);
    updatedDocument.append("autoUpdate", autoUpdate);
    updatedDocument.append("activateStatus", activateStatus);
    updatedDocument.append("fromDate", fromDate);
    updatedDocument.append("toDate", toDate);

    // Append the image file if it exists
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
                onChange={handleImageUpload} // Handle image upload
              />
            </IconButton>
            {imageName && <Typography variant="body2">{imageName}</Typography>} {/* Display image name */}
            
            {/* Display the uploaded image preview */}
            <Box sx={{ marginTop: "16px" }}>
              {image && (
                <img
                  src={URL.createObjectURL(image)} // Create a local URL for the image preview
                  alt="Uploaded Preview"
                  style={{ maxWidth: "100%", maxHeight: "200px", marginTop: "8px" }}
                />
              )}
            </Box>

            <TextField
              fullWidth
              label="Document ID*"
              value={documentID}
              onChange={(e) => setDocumentID(e.target.value)} // Allow editing of Document ID
              margin="normal"
            />

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
            <InputLabel>Receiver</InputLabel>
            <FormControl fullWidth margin="normal">
              <InputLabel>Applying on</InputLabel>
              <Select
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
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
                  {/* From Date on the left side */}
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="From Date"
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      margin="normal"
                    />
                  </Grid>

                  {/* To Date on the right side */}
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="To Date"
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      margin="normal"
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Activate Status */}
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
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mt: 2 }}
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
