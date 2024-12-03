import React, { useState, useEffect } from "react";
import {
  Typography,
  FormControl,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
  Box,
  Grid,
  TextareaAutosize,
  InputLabel,
  IconButton,
  Switch,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

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
  const [receiver, setReceiver] = useState(roles.map((role) => role.value));
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [selectAll, setSelectAll] = useState(true);
  const [imageError, setImageError] = useState("");
  const [errors, setErrors] = useState({
    heading: "",
    description: "",
    link: "",
    receiver: "",
    image: "",
  });

  useEffect(() => {
    if (document) {
      setAutoUpdate(document.autoUpdate || false);
      setActivateStatus(document.activateStatus || false);
      setDocumentID(document.documentID || "");
      setHeading(document.heading || "");
      setDescription(document.description || "");
      setLink(document.link || "");
      setReceiver(
        Array.isArray(document.receiver)
          ? document.receiver
          : roles.map((role) => role.value)
      );
            setFromDate(document.fromDate ? document.fromDate.split("T")[0] : "");
      setToDate(document.toDate ? document.toDate.split("T")[0] : "");
      setImageName(document.image || "");
    }
  }, [document]);

  const handleReceiverChange = (event) => {
    const { value, checked } = event.target;

    if (value === "selectAll") {
      if (checked) {
        setReceiver(roles.map((role) => role.value));
      } else {
        setReceiver([]);
      }
      setSelectAll(checked);
    } else {
      const updatedReceiver = checked
        ? [...receiver, value]
        : receiver.filter((role) => role !== value);

      setReceiver(updatedReceiver);
      setSelectAll(updatedReceiver.length === roles.length);
    }
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
  
      // Check if file type is JPEG, JPG, or PNG
      const validImageTypes = ['image/jpeg', 'image/png'];
      if (!validImageTypes.includes(file.type)) {
        setImageError("Only JPEG, JPG, and PNG images are allowed");
        setImage(null); // Reset image if the file type is not valid
        return; // Prevent further actions
      } else {
        setImageError(""); // Clear error if file type is valid
      }
  
      setImage(file);
      setImageName(file.name);
    }
  };
  
  const validateLink = (link) => {
    const validLinkRegex = /^(https?:\/\/|https:\/\/www\.youtube\.com\/watch\?v=)/;
    return validLinkRegex.test(link);
  };

  const handleLinkChange = (e) => {
    const value = e.target.value;
    if (validateLink(value) || value === "") {
      setLink(value); // Set valid link
      setErrors((prevErrors) => ({
        ...prevErrors,
        link: "", // Clear any previous error
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        link: "Link must be a valid HTTP or YouTube URL",
      }));
    }
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;
  
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of the day
  
    // Heading validation
    if (!heading.trim()) {
      formErrors.heading = "Heading is required";
      isValid = false;
    }
  
    // Description validation
    if (!description.trim()) {
      formErrors.description = "Description is required";
      isValid = false;
    }
  
    // Link validation
    if (!link.trim() || errors.link) {
      formErrors.link = "Link is required and must be a valid URL";
      isValid = false;
    }
  
    // Receiver validation
    if (receiver.length === 0) {
      formErrors.receiver = "At least one role must be selected";
      isValid = false;
    }
  
    // Image validation
    if (!image && !imageName) {
      formErrors.image = "Image is required";
      isValid = false;
    }
  
    // From Date validation
    if (autoUpdate && fromDate) {
      const fromDateObj = new Date(fromDate);
      if (fromDateObj < today) {
        formErrors.fromDate = "From Date cannot be in the past";
        isValid = false;
      }
    } else if (autoUpdate && !fromDate) {
      formErrors.fromDate = "From Date is required";
      isValid = false;
    }
  
    // To Date validation
    if (autoUpdate && toDate) {
      const toDateObj = new Date(toDate);
      if (toDateObj < today) {
        formErrors.toDate = "To Date cannot be in the past";
        isValid = false;
      } else if (fromDate && toDateObj < new Date(fromDate)) {
        formErrors.toDate = "To Date cannot be earlier than From Date";
        isValid = false;
      }
    } else if (autoUpdate && !toDate) {
      formErrors.toDate = "To Date is required";
      isValid = false;
    }
  
    setErrors(formErrors);
    return isValid;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Prevent form submission if validation fails
    }

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
              error={!!errors.heading}
              helperText={errors.heading}
            />
            <TextareaAutosize
              minRows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              style={{ width: "100%", margin: "16px 0" }}
            />
            {errors.description && (
              <Typography variant="body2" color="error" sx={{ marginBottom: "8px" }}>
                {errors.description}
              </Typography>
            )}
              <TextField
          fullWidth
          label="Link"
          value={link}
          onChange={handleLinkChange}
          margin="normal"
          error={!!errors.link}
          helperText={errors.link}
        />
          </Box>
        </Grid>

        {/* Right Side: Receiver and Actions */}
        <Grid item xs={12} md={6}>
          <Box sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Select Receiver Roles
            </Typography>
            <FormControl component="fieldset" sx={{ mb: 3 }}>
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
        {errors.receiver && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {errors.receiver}
          </Typography>
        )}
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
  error={!!errors.fromDate}
  helperText={errors.fromDate}
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
  error={!!errors.toDate}
  helperText={errors.toDate}
/>
                  </Grid>
                </Grid>
              </Box>
            )}

            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{ marginTop: "20px" }}
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
