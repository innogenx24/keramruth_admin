import React, { useState } from "react";
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
  Snackbar,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useNavigate } from "react-router-dom";
import "./announcement.css";

const AddAnnouncementDetails = ({ onClose }) => {
  const navigate = useNavigate();
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [activateStatus, setActivateStatus] = useState(true);
  const [documentID, setDocumentID] = useState("");
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [receiver, setReceiver] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageFileName, setImageFileName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!documentID || !heading || !receiver) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("documentID", documentID);
    formData.append("heading", heading);
    formData.append("description", description);
    formData.append("link", link);
    formData.append("receiver", receiver);
    formData.append("autoUpdate", autoUpdate);
    formData.append("activateStatus", activateStatus);
    if (autoUpdate) {
      formData.append("fromDate", fromDate);
      formData.append("toDate", toDate);
    }
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await fetch("http://88.222.245.236:3002/announcements/create", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Announcement successfully saved:", result);
        setSuccessMessage("Announcement created successfully!");

        // Navigate to the announcements page after success
        navigate("/dashboard/announcement");

        // Clear form fields
        setDocumentID("");
        setHeading("");
        setDescription("");
        setLink("");
        setReceiver("");
        setImageFile(null);
        setImageFileName("");
        setFromDate("");
        setToDate("");
      } else {
        const errorText = await response.text();
        setErrorMessage(`Failed to save announcement: ${errorText}`);
        console.error("Failed to save announcement:", response.statusText);
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
            <TextField
              fullWidth
              label="Announcement ID*"
              value={documentID}
              onChange={(e) => setDocumentID(e.target.value)}
              placeholder="Enter Document ID"
              required
              margin="normal"
            />
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
                <MenuItem value="Customer">Customer</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
              <Switch
                checked={autoUpdate}
                onChange={() => setAutoUpdate(!autoUpdate)}
                color="primary"
              />
              <Typography variant="body1" sx={{ marginLeft: 1 }}>
                Auto Update
              </Typography>
            </Box>

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
                      margin="normal"
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
                      margin="normal"
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
              <Switch
                checked={activateStatus}
                onChange={() => setActivateStatus(!activateStatus)}
                color="primary"
              />
              <Typography variant="body1" sx={{ marginLeft: 1 }}>
                Activate Status
              </Typography>
            </Box>

            <Button
              variant="contained"
              type="submit"
              sx={{ marginTop: 2 }}
            >
              Submit
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
