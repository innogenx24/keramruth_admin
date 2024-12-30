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
import { fetchCategorysRequest } from "../../redux/slices/master-slice/categort-slice/CategortGetSlice";
import { useSelector, useDispatch } from "react-redux";
import DeleteButton from "../../assets/actions/DeleteButton.svg";
import EditButton from "../../assets/actions/EditButton.svg";

const CategoryTable = () => {
  const dispatch = useDispatch();
  const { categorys } = useSelector((state) => state?.categorys);
  const categoryList = Array.isArray(categorys) ? categorys : [categorys];
  const [showTable, setShowTable] = useState(true); // State to toggle table and form visibility
  const [selectedClub, setSelectedClub] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false); // State to control delete modal
  const [page, setPage] = useState(0); // State for pagination
  const rowsPerPage = 10; // Define rows per page
  const navigate = useNavigate();
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  useEffect(() => {
    dispatch(fetchCategorysRequest());
  }, [dispatch]);

  // Function to handle the click of "Add Category" button
  const handleAddClubClick = () => {
    navigate("add-category");
  };

  // Function to handle editing a category
  const handleEditClick = (club) => {
    navigate("edit-category", { state: { club } });
  };

  // Function to handle deleting a category
  const handleDeleteClick = (club) => {
    setSelectedClub(club); // Set the selected category for deletion
    setOpenDeleteModal(true); // Open the delete confirmation modal
  };

  // Function to confirm deletion
  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`${API_END_POINT}/category/${selectedClub?.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        dispatch(fetchCategorysRequest()); // Re-fetch the category list after deletion
        setOpenDeleteModal(false); // Close the modal after deletion
        setSelectedClub(null); // Reset selected category
      } else {
        console.error("Error deleting category");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Function to cancel deletion
  const handleCancelDelete = () => {
    setOpenDeleteModal(false); // Close the modal
    setSelectedClub(null); // Reset selected category
  };

  // Sort the category list in descending order by 'id'
  const sortedCategoryList = [...categoryList].sort((a, b) => b.id - a.id);

  // Function to render pagination buttons
  const renderPagination = () => (
    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "15px", padding: "15px" }}>
      <Button
        onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
        disabled={page === 0}
        variant="outlined"
      >
        Previous
      </Button>
      <Typography variant="body1" style={{ minWidth: "60px", textAlign: "center" }}>
        Page {page + 1}
      </Typography>
      <Button
        onClick={() => setPage((prev) => Math.min(prev + 1, Math.ceil(categoryList.length / rowsPerPage) - 1))}
        disabled={page >= Math.ceil(categoryList.length / rowsPerPage) - 1}
        variant="outlined"
      >
        Next
      </Button>
    </div>
  );

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        Masters / Category
      </Typography>

      {showTable ? (
        <>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddClubClick}
              style={{
                backgroundColor: "#28a745",
                color: "white",
                fontWeight: "bold",
                borderRadius: "5px",
              }}
            >
              + Add Category
            </Button>
          </Box>
          <h2>Category</h2>
          <TableContainer component={Paper} >
            <Table aria-label="Category Table">
              <TableHead >
                <TableRow>
                  <TableCell>No.</TableCell>
                  <TableCell>Category Name</TableCell>
                  <TableCell>Sector Name</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedCategoryList.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((row, index) => (
                  <TableRow key={row?.id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Typography sx={{ marginLeft: "10px" }}>{row?.category_name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ marginLeft: "10px" }}>{row?.sector_name}</Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="secondary"
                        onClick={() => handleDeleteClick(row)}
                        style={{ marginRight: "5px" }}

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
                        color="primary"
                        onClick={() => handleEditClick(row)}
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
          {renderPagination()}
        </>
      ) : selectedClub ? (
        <EditCategoryForm club={selectedClub} onCancel={() => setShowTable(true)} />
      ) : (
        <AddCategoryForm onCancel={() => setShowTable(true)} />
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={openDeleteModal} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the category "{selectedClub?.category_name}"?
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

export default CategoryTable;
