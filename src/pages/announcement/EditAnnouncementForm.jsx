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
import { API_END_POINT_IMG } from "../../constants/ApiConstant";

const EditAnnouncementForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const announcement = location.state?.announcement || {};
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;
  const imageBaseURL = `${API_END_POINT_IMG}/uploads/`;

  const [documentID, setDocumentID] = useState("");
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [receiver, setReceiver] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileName, setImageFileName] = useState("");
  const [existingImage, setExistingImage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectAll, setSelectAll] = useState(false);

  // Separate error state for each field
  const [headingError, setHeadingError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [linkError, setLinkError] = useState("");
  const [receiverError, setReceiverError] = useState("");
  const [imageError, setImageError] = useState(""); // Image file error state
  const [errorMessage, setErrorMessage] = useState(""); // General error message
  const [successMessage, setSuccessMessage] = useState("");  // Add this state for success messages

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

      // Validate file format
      const validFormats = ['image/jpeg', 'image/png'];
      if (!validFormats.includes(file.type)) {
        setImageError("Only JPEG, JPG, or PNG images are allowed.");
        setImageFile(null); // Clear selected file
        setImageFileName("");
        setPreviewUrl("");
        setExistingImage(""); // Clear existing image if error occurs
        return;
      }

      // Validate file size
      if (fileSizeMB > 2) {
        setImageError("File size must be less than 2MB.");
        setImageFile(null); // Clear selected file
        setImageFileName("");
        setPreviewUrl("");
        setExistingImage(""); // Clear existing image if error occurs
        return;
      }

      // Clear error if file is valid
      setImageError("");
      setImageFile(file);
      setImageFileName(file.name);

      // Generate image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setExistingImage(""); // Clear existing image if new file is selected
    }
  };


  const validateLink = (url) => {
    const regex = /^(https?:\/\/)?(www\.)?([a-zA-Z]+\.)?[a-zA-Z]+\.[a-z]{2,}(\/[^\s]*)?$/;
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
    if (!link.trim()) {
      setLinkError("Link is required.");
      isValid = false;
    } else if (!validateLink(link)) {
      setLinkError("Please enter a valid URL.");
      isValid = false;
    }



    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
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
      const response = await fetch(`${API_END_POINT}/announcements/${announcement.id}`, {
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
              margin="normal"
            />
            {headingError && (
              <Typography variant="body2" sx={{ color: "red", marginTop: "10px" }}>
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
              <Typography variant="body2" sx={{ color: "red", marginTop: "10px" }}>
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
              <Typography variant="body2" sx={{ color: "red", marginTop: "10px" }}>
                {linkError}
              </Typography>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 2 }}>


            <FormControl fullWidth margin="normal">
              <Typography variant="h6">Select Receivers</Typography>
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
            {receiverError && (
              <Typography variant="body2" sx={{ color: "red", marginTop: "10px" }}>
                {receiverError}
              </Typography>
            )}
            {/* The "Update Announcement" button placed here */}
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
    </Box>
  );

};

export default EditAnnouncementForm;
