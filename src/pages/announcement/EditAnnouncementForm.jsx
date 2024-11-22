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
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useNavigate, useLocation } from "react-router-dom";
import "./announcement.css";

const EditAnnouncementForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const announcement = location.state?.announcement || {};
  const imageBaseURL = "http://88.222.245.236:3002/uploads/";

  const [documentID, setDocumentID] = useState("");
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [receiver, setReceiver] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileName, setImageFileName] = useState("");
  const [existingImage, setExistingImage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [imageError, setImageError] = useState(""); // Added image error state

  const roles = [
    { label: "Area Development Officer (ADO)", value: "Area Development Officer" },
    { label: "Master Distributor (MD)", value: "Master Distributor" },
    { label: "Super Distributor (SD)", value: "Super Distributor" },
    { label: "Distributor", value: "Distributor" },
    { label: "Customer", value: "Customer" },
  ];

  useEffect(() => {
    if (announcement) {
      setDocumentID(announcement.documentID || "");
      setHeading(announcement.heading || "");
      setDescription(announcement.description || "");
      setLink(announcement.link || "");
      setReceiver(announcement.receiver || []);
      setImageFileName(announcement.image ? announcement.image.split('/').pop() : "");
      setExistingImage(announcement.image ? `${imageBaseURL}${announcement.image}` : "");
    }
  }, [announcement]);

  useEffect(() => {
    setSelectAll(receiver.length === roles.length);
  }, [receiver]);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setReceiver((prevReceivers) => [...prevReceivers, value]);
    } else {
      setReceiver((prevReceivers) => prevReceivers.filter((item) => item !== value));
    }
  };

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setReceiver(roles.map((role) => role.value));
    } else {
      setReceiver([]);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB size limit
      const fileSizeMB = file.size / (1024 * 1024); // Convert size to MB

      // Validate file size
      if (fileSizeMB > 2) {
        setImageError("File size must be less than 2MB");
        setImageFile(null); // Clear selected file
        setImageFileName("");
        setPreviewUrl("");
        setExistingImage(""); // Clear existing image if error occurs
      } else {
        setImageError(""); // Clear error if file is valid
        setImageFile(file);
        setImageFileName(file.name);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
        setExistingImage(""); // Clear existing image if new file is selected
      }
    }
  };

  const validateLink = (url) => {
    const regex = /^(https?:\/\/)?(www\.)?([a-zA-Z]+\.)?[a-zA-Z]+\.[a-z]{2,}(\/[^\s]*)?$/;
    return regex.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!documentID || !heading || receiver.length === 0) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (link && !validateLink(link)) {
      setErrorMessage("Please enter a valid URL.");
      return;
    }

    const formData = new FormData();
    formData.append("documentID", documentID);
    formData.append("heading", heading);
    formData.append("description", description);
    formData.append("link", link);
    formData.append("receiver", JSON.stringify(receiver));
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await fetch(`http://88.222.245.236:3002/announcements/${announcement.id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setSuccessMessage("Announcement updated successfully!");
        navigate("/dashboard/announcement");
      } else {
        const errorText = await response.text();
        setErrorMessage(`Failed to update announcement: ${errorText}`);
      }
    } catch (error) {
      setErrorMessage("Error updating the announcement: " + error.message);
    }
  };


  return (
    <Box p={3} component="form" onSubmit={handleSubmit} encType="multipart/form-data">
      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        Announcement / Edit Announcement
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 2 }}>
          <InputLabel>Edit Images</InputLabel>
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
            {existingImage && (
              <Box sx={{ marginTop: "10px" }}>
                <img src={existingImage} alt="Existing Image" style={{ maxWidth: "100%", height: "auto" }} />
              </Box>
            )}
            {imageError && (
              <Typography variant="body2" sx={{ color: "red", marginTop: "10px" }}>
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

        <Grid item xs={12} md={6}>
          <Box sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 2 }}>
            <InputLabel>Receiver</InputLabel>
            <FormControl fullWidth margin="normal">
              <FormControlLabel
                control={<Checkbox checked={selectAll} onChange={handleSelectAllChange} />}
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

export default EditAnnouncementForm;
