import { useState, useEffect } from "react"; 
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchRolesRequest } from "../../redux/slices/master-slice/role-slice/RoleGetSlice";
import { useSelector, useDispatch } from "react-redux";

const RoleTable = () => {
  const dispatch = useDispatch();
  const { roles } = useSelector((state) => state.roles);
  const rolesList = roles?.data || [];
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [selectedClub, setSelectedClub] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchRolesRequest());
  }, [dispatch]);

  // Pagination logic
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const renderPagination = () => (
    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "15px", padding: "15px" }}>
      <Button
        onClick={() => handleChangePage(page - 1)}
        disabled={page === 0}
        variant="outlined"
      >
        Previous
      </Button>
      <Typography variant="body1" style={{ minWidth: "60px", textAlign: "center" }}>
        Page {page + 1}
      </Typography>
      <Button
        onClick={() => handleChangePage(page + 1)}
        disabled={page >= Math.ceil(rolesList.length / rowsPerPage) - 1}
        variant="outlined"
      >
        Next
      </Button>
    </div>
  );

  const sortedRolesList = rolesList.slice(page * rowsPerPage, (page + 1) * rowsPerPage); // Paginate

  // Table rendering
  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        Masters / Role
      </Typography>

      <TableContainer component={Paper} sx={{ maxHeight: 400, overflowY: "auto" }}>
        <Table aria-label="Role Table">
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Role Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRolesList.map((row, index) => (
              <TableRow key={row?.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row?.role_name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {renderPagination()}

      {/* Delete Confirmation Modal */}
      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the role "{selectedClub?.role_name}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => setOpenDeleteModal(false)} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoleTable;





// import { useState, useEffect } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Typography,
//   Button,
//   Box,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import AddRoleForm from "./AddRoleForm"; // Import your AddClubForm component
// import EditRoleForm from "./EditRoleForm"; // Import your EditClubForm component
// import { useNavigate } from "react-router-dom";
// import { fetchRolesRequest } from "../../redux/slices/master-slice/role-slice/RoleGetSlice";
// import { useSelector, useDispatch } from "react-redux";

// const RoleTable = () => {
//   const dispatch = useDispatch();
//   const { roles } = useSelector((state) => state.roles);
//   const rolesList = roles?.data || []; // Access the data field in roles
//   const [showTable, setShowTable] = useState(true); // State to toggle table and form visibility
//   const [selectedClub, setSelectedClub] = useState(null); // State to hold selected club for editing
//   const [openDeleteModal, setOpenDeleteModal] = useState(false); // State to control delete modal
//   const navigate = useNavigate();

//   useEffect(() => {
//     dispatch(fetchRolesRequest());
//   }, [dispatch]);

//   // Sort rolesList by ID in descending order
//   // const sortedRolesList = [...rolesList].sort((a, b) => b.id - a.id);
//   const sortedRolesList = rolesList; // No sorting applied


//   // Function to handle the click of "Add Club" button
//   const handleAddClubClick = () => {
//     navigate("add-role");
//   };

//   // Function to handle editing a club
//   const handleEditClick = (club) => {
//     navigate("edit-role", { state: { club } });
//   };

//   // Function to handle deleting a club
//   const handleDeleteClick = (club) => {
//     setSelectedClub(club); // Set the selected club for deletion
//     setOpenDeleteModal(true); // Open the delete confirmation modal
//   };

//   // Function to confirm deletion
//   const handleConfirmDelete = () => {
//     // Add your deletion logic here
//     console.log("Deleted Club:", selectedClub);
//     setOpenDeleteModal(false); // Close the modal after deletion
//     setSelectedClub(null); // Reset selected club
//   };

//   // Function to cancel deletion
//   const handleCancelDelete = () => {
//     setOpenDeleteModal(false); // Close the modal
//     setSelectedClub(null); // Reset selected club
//   };

//   return (
//     <Box sx={{ width: "100%", p: 2 }}>
//       <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
//         Masters / Role
//       </Typography>

//       {showTable ? (
//         <>
//           {/* <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
//             <Button variant="contained" color="primary" onClick={handleAddClubClick}>
//               + Add Role
//             </Button>
//           </Box> */}
//           <h2>Role</h2>
//           <TableContainer component={Paper}>
//             <Table aria-label="Club Table">
//               <TableHead>
//                 <TableRow>
//                   <TableCell>No.</TableCell>
//                   <TableCell>Role Name</TableCell>
//                   {/* <TableCell>Action</TableCell> */}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {sortedRolesList?.map((row, index) => (
//                   <TableRow key={row?.id}>
//                     <TableCell>{index + 1}</TableCell>
                    
//                     <TableCell>
//                       <div style={{ display: "flex", alignItems: "center" }}>
//                         <Typography sx={{ marginLeft: "10px" }}>
//                           {row?.role_name}
//                         </Typography>
//                       </div>
//                     </TableCell>

//                     {/* <TableCell>
//                       <IconButton
//                         color="secondary"
//                         onClick={() => handleEditClick(row)}
//                       >
//                         <EditIcon />
//                       </IconButton>
//                       <IconButton
//                         color="error"
//                         onClick={() => handleDeleteClick(row)}
//                       >
//                         <DeleteIcon />
//                       </IconButton>
//                     </TableCell> */}
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </>
//       ) : selectedClub ? (
//         <EditRoleForm club={selectedClub} onCancel={() => setShowTable(true)} />
//       ) : (
//         <AddRoleForm onCancel={() => setShowTable(true)} />
//       )}

//       {/* Delete Confirmation Modal */}
//       <Dialog open={openDeleteModal} onClose={handleCancelDelete}>
//         <DialogTitle>Confirm Deletion</DialogTitle>
//         <DialogContent>
//           <Typography>
//             Are you sure you want to delete the role "{selectedClub?.role_name}"?
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCancelDelete} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={handleConfirmDelete} color="error">
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default RoleTable;
