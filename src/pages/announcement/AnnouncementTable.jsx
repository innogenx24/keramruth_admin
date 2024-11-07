import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Switch,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AnnouncementTable = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const navigate = useNavigate();

  const imageBaseURL = "http://88.222.245.236:3002/uploads/"; // Define the base URL for images

  // Fetch announcements from API
  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get("http://88.222.245.236:3002/announcements");
      setAnnouncements(response.data.data); // Assuming your API returns data in this format
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  useEffect(() => {
    fetchAnnouncements(); // Call the fetch function on component mount
  }, []);

  // Open delete confirmation modal
  const handleDeleteOpen = (announcement) => {
    setAnnouncementToDelete(announcement);
    setDeleteModalOpen(true);
  };

  // Close delete confirmation modal
  const handleDeleteClose = () => {
    setDeleteModalOpen(false);
    setAnnouncementToDelete(null);
  };

  // Confirm deletion of the announcement
  const confirmDelete = async () => {
    if (announcementToDelete) {
      try {
        await axios.delete(`http://88.222.245.236:3002/announcements/${announcementToDelete.id}`); // Use the ID from the announcement
        setAnnouncements(announcements.filter((announcement) => announcement.id !== announcementToDelete.id));
        handleDeleteClose();
      } catch (error) {
        console.error("Error deleting announcement:", error);
      }
    }
  };

  // Handle edit button click
  const handleEditClick = (announcement) => {
    navigate("edit-announcement", { state: { announcement } });
  };

  // Handle add button click
  const handleAddClick = () => {
    navigate("add-announcement");
  };

  // Handle toggle switch for activating/deactivating status
  const handleToggleSwitch = async (announcement) => {
    try {
      const updatedStatus = !announcement.activateStatus;
      await axios.patch(`http://88.222.245.236:3002/announcements/${announcement.id}`, {
        activateStatus: updatedStatus,
      });
      setAnnouncements((prevAnnouncements) =>
        prevAnnouncements.map((a) =>
          a.id === announcement.id ? { ...a, activateStatus: updatedStatus } : a
        )
      );
    } catch (error) {
      console.error("Error updating activate status:", error);
    }
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0 }}>All Announcements</h2>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            style={{
              backgroundColor: "#28a745", // Match green color for create button
              color: "white",
            }}
          >
            CREATE ANNOUNCEMENT
          </Button>
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Announcement ID</TableCell>
              <TableCell>Announcement Heading</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Applying on</TableCell>
              <TableCell>Activate Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {announcements.map((announcement, index) => (
              <TableRow key={announcement.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell style={{ display: "flex", alignItems: "center" }}>
                  {announcement.image ? (
                    <img
                      src={`${imageBaseURL}${announcement.image}`} // Use imageBaseURL to construct the full image URL
                      style={{ width: 50, height: 50, marginRight: 10, borderRadius: 2 }}
                      alt="Announcement"
                    />
                  ) : (
                    <span>No Image Available</span>
                  )}
                  <span>{announcement.documentID}</span>
                </TableCell>
                <TableCell>{announcement.heading}</TableCell>
                <TableCell style={{ maxWidth: 200 }}>
                  {announcement.description.length > 50
                    ? `${announcement.description.substring(0, 50)}...`
                    : announcement.description}
                </TableCell>
                <TableCell>{announcement.receiver}</TableCell>
                <TableCell>
                  <Switch
                    checked={announcement.activateStatus}
                    onChange={() => handleToggleSwitch(announcement)}
                    color="success"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEditClick(announcement)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteOpen(announcement)}
                    color="secondary"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onClose={handleDeleteClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the announcement with ID "
            {announcementToDelete?.documentID}" and heading "
            {announcementToDelete?.heading}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AnnouncementTable;
