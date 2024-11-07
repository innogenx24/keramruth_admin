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
import AddCategoryForm from "./AddCategoryForm"; // Import your AddClubForm component
import EditCategoryForm from "./EditCategoryForm"; // Import your EditClubForm component
import { useNavigate } from "react-router-dom";
import { fetchCategorysRequest } from "../../redux/slices/master-slice/categort-slice/CategortGetSlice";
import { useSelector, useDispatch } from "react-redux";
import { deleteCategoryRequest } from "../../redux/slices/master-slice/categort-slice/CategoryDeleteSlice";

const CategoryTable = () => {
  const dispatch = useDispatch();
  const { categorys } = useSelector((state) => state?.categorys);
  const categoryList = Array.isArray(categorys) ? categorys : [categorys];
  const [showTable, setShowTable] = useState(true); // State to toggle table and form visibility
  const [selectedClub, setSelectedClub] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false); // State to control delete modal
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCategorysRequest());
  }, [dispatch]);

  // Function to handle the click of "Add Club" button
  const handleAddClubClick = () => {
    navigate("add-category");
  };

  // Function to handle editing a club
  const handleEditClick = (club) => {
    navigate("edit-category", { state: { club } });
  };

  // Function to handle deleting a club
  const handleDeleteClick = (club) => {
    setSelectedClub(club); // Set the selected club for deletion
    setOpenDeleteModal(true); // Open the delete confirmation modal
  };

  // Function to confirm deletion
  const handleConfirmDelete = () => {
    // Add your deletion logic here
    // console.log("Deleted Club:", selectedClub?.id);
    dispatch(deleteCategoryRequest(selectedClub?.id));
    setOpenDeleteModal(false); // Close the modal after deletion
    setSelectedClub(null); // Reset selected club
    // window.location.reload();
  };

  // Function to cancel deletion
  const handleCancelDelete = () => {
    setOpenDeleteModal(false); // Close the modal
    setSelectedClub(null); // Reset selected club
  };

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
            >
              + Add Category
            </Button>
          </Box>
          <h2>Category</h2>
          <TableContainer component={Paper}>
            <Table aria-label="Club Table">
              <TableHead>
                <TableRow>
                  <TableCell>No.</TableCell>
                  <TableCell>Id</TableCell>
                  <TableCell>Category Name</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categoryList.map((row, index) => (
                  <TableRow key={row?.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Typography>{row?.id}</Typography>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Typography sx={{ marginLeft: "10px" }}>
                          {row?.category_name}
                        </Typography>
                      </div>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="secondary"
                        onClick={() => handleEditClick(row)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(row)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
