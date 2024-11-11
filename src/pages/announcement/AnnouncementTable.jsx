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

  const imageBaseURL = "http://localhost:3002/uploads/";

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get("http://localhost:3002/announcements");
      setAnnouncements(response.data.data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleDeleteOpen = (announcement) => {
    setAnnouncementToDelete(announcement);
    setDeleteModalOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteModalOpen(false);
    setAnnouncementToDelete(null);
  };

  const confirmDelete = async () => {
    if (announcementToDelete) {
      try {
        await axios.delete(`http://88.222.245.236:3002/announcements/${announcementToDelete.id}`);
        setAnnouncements(announcements.filter((announcement) => announcement.id !== announcementToDelete.id));
        handleDeleteClose();
      } catch (error) {
        console.error("Error deleting announcement:", error);
      }
    }
  };

  const handleEditClick = (announcement) => {
    navigate("edit-announcement", { state: { announcement } });
  };

  const handleAddClick = () => {
    navigate("add-announcement");
  };

  const handleToggleSwitch = async (announcement) => {
    try {
      const updatedStatus = !announcement.activateStatus;
      await axios.patch(`http://localhost:3002/announcements/${announcement.id}`, {
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

  const getImageURL = (imagePath) => {
    if (!imagePath) return "";
    const imageName = imagePath.includes("\\") ? imagePath.split("\\").pop() : imagePath;
    return `${imageBaseURL}${imageName}`;
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
              backgroundColor: "#28a745",
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
                      src={getImageURL(announcement.image)}
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
                  <IconButton onClick={() => handleEditClick(announcement)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteOpen(announcement)} color="secondary">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
