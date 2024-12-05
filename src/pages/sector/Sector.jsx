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

const SectorTable = () => {
  const [sectors, setSectors] = useState([]);
  const [selectedSector, setSelectedSector] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [page, setPage] = useState(0); // Page state
  const rowsPerPage = 10; // Rows per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const response = await fetch("http://88.222.245.236:3002/sectors");
        const data = await response.json();

        // Sort sectors by ID in descending order
        const sortedSectors = data.sort((a, b) => b.id - a.id);
        setSectors(sortedSectors);
      } catch (error) {
        console.error("Error fetching sectors:", error);
      }
    };
    fetchSectors();
  }, []);

  const handleAddSectorClick = () => {
    navigate("/dashboard/add-sector");
  };

  const handleEditClick = (sector) => {
    navigate("/dashboard/add-sector", { state: { sector } });
  };

  const handleDeleteClick = (sector) => {
    setSelectedSector(sector);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await fetch(`http://88.222.245.236:3002/sectors/${selectedSector?.id}`, {
        method: "DELETE",
      });
      setOpenDeleteModal(false);
      setSelectedSector(null);

      // Fetch updated sectors list after deletion
      const response = await fetch("http://88.222.245.236:3002/sectors");
      const data = await response.json();

      // Sort sectors by ID in descending order after deletion
      const sortedSectors = data.sort((a, b) => b.id - a.id);
      setSectors(sortedSectors);
    } catch (error) {
      console.error("Error deleting sector:", error);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteModal(false);
    setSelectedSector(null);
  };

  // Paginate the sectors based on the current page
  const paginatedSectors = sectors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Render Pagination Component
  const renderPagination = () => (
    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "15px", padding: "15px" }}>
      <Button
        onClick={() => setPage((prev) => prev - 1)}
        disabled={page === 0}
        variant="outlined"
      >
        Previous
      </Button>
      <Typography variant="body1" style={{ minWidth: "60px", textAlign: "center" }}>
        Page {page + 1}
      </Typography>
      <Button
        onClick={() => setPage((prev) => prev + 1)}
        disabled={page >= Math.ceil(sectors.length / rowsPerPage) - 1}
        variant="outlined"
      >
        Next
      </Button>
    </div>
  );

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        Masters / Sector
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" color="primary" onClick={handleAddSectorClick}>
          + Add Sector
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Sector Name</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {paginatedSectors.map((row, index) => (
    <TableRow key={row.id}>
      <TableCell>{page * rowsPerPage + index + 1}</TableCell> {/* Update to reflect pagination */}
      <TableCell>{row.sector_name}</TableCell>
      <TableCell>
        <IconButton color="secondary" onClick={() => handleEditClick(row)}>
          <EditIcon />
        </IconButton>
        <IconButton color="error" onClick={() => handleDeleteClick(row)}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

        </Table>
      </TableContainer>

      {renderPagination()} {/* Add pagination at the bottom */}

      <Dialog open={openDeleteModal} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the sector "{selectedSector?.sector_name}"?
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

export default SectorTable;
