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
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DeleteButton from "../../assets/actions/DeleteButton.svg"
import EditButton from "../../assets/actions/EditButton.svg"
import { API_END_POINT_IMG } from "../../constants/ApiConstant";
import { FaFilePdf, FaFileArchive, FaFileExcel } from "react-icons/fa";

const AnnouncementTable = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const [page, setPage] = useState(0); // Current page number
  const [rowsPerPage] = useState(10); // Rows per page
  const navigate = useNavigate();
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  const imageBaseURL = `${API_END_POINT_IMG}/uploads/`;

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");
      const response = await axios.get(`${API_END_POINT}/announcements`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Sort announcements by ID in descending order
      const sortedAnnouncements = response.data.data.sort((a, b) => b.id - a.id);
      setAnnouncements(sortedAnnouncements);
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
        await axios.delete(`${API_END_POINT}/announcements/${announcementToDelete.id}`);
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



  // Pagination logic
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedAnnouncements = announcements.slice(startIndex, endIndex);

  const renderPagination = (page, setPage, totalRows) => (
    <div style={{ display: "flex", justifyContent: "right", alignItems: "center", gap: "15px" }}>
      <Button
        onClick={() => setPage(page - 1)}
        disabled={page === 0}
        variant="outlined"
      >
        Previous
      </Button>
      <Typography variant="body1" style={{ minWidth: "60px", textAlign: "center" }}>
        Page {page + 1}
      </Typography>
      <Button
        onClick={() => setPage(page + 1)}
        disabled={page >= Math.ceil(totalRows / rowsPerPage) - 1}
        variant="outlined"
      >
        Next
      </Button>
    </div>
  );

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
          <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
            Announcements
          </Typography>

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
          <TableHead sx={{ backgroundColor: '#DCDCDC' }}>
            <TableRow style={{ whiteSpace: 'nowrap' }}>
              <TableCell>No.</TableCell>
              <TableCell>Announcement Image</TableCell>
              <TableCell>Announcement Heading</TableCell>
              <TableCell style={{ maxWidth: 300, wordWrap: "break-word" }}>Description</TableCell>
              <TableCell style={{ maxWidth: 200, wordWrap: "break-word" }}>Applying on</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAnnouncements.map((announcement, index) => (
              <TableRow key={announcement.id}>
                <TableCell>{startIndex + index + 1}</TableCell>
                <TableCell style={{ width: 100, textAlign: "center" }}>
                  {announcement.image ? (
                    announcement.image.endsWith(".pdf") ? (
                      <FaFilePdf size={40} color="red" />
                    ) : announcement.image.endsWith(".zip") ? (
                      <FaFileArchive size={40} color="blue" />
                    ) : announcement.image.endsWith(".xlsx") || announcement.image.endsWith(".csv") ? (
                      <FaFileExcel size={40} color="green" />
                    ) : (
                      <img
                        src={`${imageBaseURL}${announcement.image}`}
                        style={{
                          width: "80px",
                          height: "auto",
                          objectFit: "contain",
                          border: "1px solid #ccc",
                          boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
                          borderRadius: "10px",
                          marginRight: "10px",
                        }}
                      />
                    )
                  ) : (
                    <span style={{ color: "#999" }}>No Image Available</span>
                  )}
                </TableCell>
                <TableCell>{announcement.heading}</TableCell>
                <TableCell
                  sx={{
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 4,
                    wordBreak: 'break-word',
                    maxWidth: '250px'
                  }}
                >
                  {announcement.description}
                </TableCell>
                <TableCell style={{ maxWidth: 200, wordWrap: "break-word" }}>
                  {announcement.receiver.join(", ")}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDeleteOpen(announcement)} color="secondary" style={{ marginRight: "5px" }}
                  >
                    <img
                      src={DeleteButton}
                      alt="Delete"
                      style={{
                        width: "30px",
                        height: "30px",
                        objectFit: "contain",
                        transform: "scale(1.5)",
                      }}
                    />
                  </IconButton>
                  <IconButton
                    onClick={() => handleEditClick(announcement)}
                    color="primary"
                  >
                    <img
                      src={EditButton}
                      alt="Edit"
                      style={{
                        width: "30px",
                        height: "30px",
                        objectFit: "contain",
                        transform: "scale(1.5)",
                      }}
                    />
                  </IconButton>


                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ marginTop: "10px" }}>
        {renderPagination(page, setPage, announcements.length)}

      </div>

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
