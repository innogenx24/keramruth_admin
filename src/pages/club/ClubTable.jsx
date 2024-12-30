import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  CircularProgress,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

const ClubTable = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0); // Current page state
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page
  const [selectedClub, setSelectedClub] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const navigate = useNavigate();
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");

      const response = await fetch(`${API_END_POINT}/club`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        const sortedClubs = result.data.sort((a, b) => b.id - a.id);
        setClubs(sortedClubs);
      } else {
        console.error("Error fetching clubs:", result.message);
      }
    } catch (error) {
      console.error("Error fetching clubs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const handleAddClubClick = () => {
    navigate("add-club");
  };

  const handleEditClick = (club) => {
    navigate("edit-club", { state: { club } });
  };

  const handleDeleteClick = (club) => {
    setSelectedClub(club);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedClub) {
      try {
        await fetch(`${API_END_POINT}/club/${selectedClub.id}`, {
          method: "DELETE",
        });
        setClubs((prevClubs) =>
          prevClubs.filter((club) => club.id !== selectedClub.id)
        );
      } catch (error) {
        console.error("Error deleting club:", error);
      } finally {
        setOpenDeleteModal(false);
        setSelectedClub(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteModal(false);
    setSelectedClub(null);
  };

  // Pagination logic
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const renderPagination = () => (
    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "15px", padding: "15px" }}>
      <Button
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 0}
        variant="outlined"
      >
        Previous
      </Button>
      <Typography variant="body1" style={{ minWidth: "60px", textAlign: "center" }}>
        Page {page + 1}
      </Typography>
      <Button
        onClick={() => handlePageChange(page + 1)}
        disabled={page >= Math.ceil(clubs.length / rowsPerPage) - 1}
        variant="outlined"
      >
        Next
      </Button>
    </div>
  );

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        Club Management
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button variant="contained" color="primary" onClick={handleAddClubClick}
              style={{
                backgroundColor: "#28a745",
                color: "white",
                fontWeight: "bold",
                borderRadius: "5px",
              }}


            >
              + Add Club
            </Button>
          </Box>

          <TableContainer component={Paper} >
            <Table aria-label="Club Table">
              <TableHead>
                <TableRow>
                  <TableCell>No.</TableCell>
                  <TableCell>Club Name</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clubs.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((club, index) => (
                  <TableRow key={club.id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Typography>{club.club_name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{parseInt(club.litre_quantity, 10)}</Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton color="secondary" onClick={() => handleEditClick(club)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteClick(club)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {clubs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No clubs available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {renderPagination()}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={openDeleteModal} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the club "{selectedClub?.club_name}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClubTable;
