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
  Avatar,
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
import AddClubForm from "./AddClubForm"; // Import your AddClubForm component
import EditClubForm from "./EditClubForm"; // Import your EditClubForm component
import { useNavigate } from "react-router-dom";

const ClubTable = () => {
  const [clubs, setClubs] = useState([]); // State to hold club data
  const [loading, setLoading] = useState(true); // State to control loading
  const [showTable, setShowTable] = useState(true); // State to toggle table and form visibility
  const [selectedClub, setSelectedClub] = useState(null); // State to hold selected club for editing
  const [openDeleteModal, setOpenDeleteModal] = useState(false); // State to control delete modal
  const navigate = useNavigate();
  // Fetch clubs from API
  const fetchClubs = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://88.222.245.236:3002/club");
      const result = await response.json();
      if (result.success) { // Check if the fetch was successful
        setClubs(result.data); // Set the clubs from the data property
      } else {
        console.error("Error fetching clubs: ", result.message); // Handle any error messages
      }
    } catch (error) {
      console.error("Error fetching clubs:", error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchClubs(); // Fetch clubs on component mount
  }, []);

  // Function to handle the click of "Add Club" button
  const handleAddClubClick = () => {
    navigate("add-club");
  };

  // Function to handle editing a club
  const handleEditClick = (club) => {
    navigate("edit-club", { state: { club } });
  };

  // Function to handle deleting a club
  const handleDeleteClick = (club) => {
    setSelectedClub(club); // Set the selected club for deletion
    setOpenDeleteModal(true); // Open the delete confirmation modal
  };

  // Function to confirm deletion
  const handleConfirmDelete = async () => {
    if (selectedClub) {
      try {
        await fetch(`http://88.222.245.236:3002/club/${selectedClub.id}`, {
          method: "DELETE",
        });
        setClubs((prevClubs) =>
          prevClubs.filter((club) => club.id !== selectedClub.id)
        );
      } catch (error) {
        console.error("Error deleting club:", error);
      } finally {
        setOpenDeleteModal(false); // Close the modal after deletion
        setSelectedClub(null); // Reset selected club
      }
    }
  };

  // Function to cancel deletion
  const handleCancelDelete = () => {
    setOpenDeleteModal(false); // Close the modal
    setSelectedClub(null); // Reset selected club
  };

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        Club Management
      </Typography>

      {showTable ? (
        <>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button variant="contained" color="primary" onClick={handleAddClubClick}>
              + Add Club
            </Button>
          </Box>
          <h2>Clubs</h2>
          {loading ? (
            <CircularProgress /> // Show loading spinner while fetching data
          ) : (
            <TableContainer component={Paper}>
              <Table aria-label="Club Table">
                <TableHead>
                  <TableRow>
                    <TableCell>No.</TableCell>
                    <TableCell>Club Name</TableCell>
                    <TableCell>Litre Quantity</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
  {clubs.length > 0 ? (
    clubs.map((club, index) => (
      <TableRow key={club.id}>
        <TableCell>{index + 1}</TableCell>
        <TableCell>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar alt={club.club_name} src={club.avatar} /> {/* Assuming avatar is a field in your API */}
            <Typography sx={{ marginLeft: "10px" }}>
              {club.club_name} {/* Correctly accessing club_name */}
            </Typography>
          </div>
        </TableCell>
        <TableCell>
          <Typography>{club.litre_quantity}</Typography>
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
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={4} align="center">
        No clubs available
      </TableCell>
    </TableRow>
  )}
</TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      ) : selectedClub ? (
        <EditClubForm club={selectedClub} onCancel={() => setShowTable(true)} />
      ) : (
        <AddClubForm onCancel={() => setShowTable(true)} />
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={openDeleteModal} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the club "{selectedClub?.name}"?
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











// import { useEffect } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Avatar,
//   Typography,
//   CircularProgress,
//   Button,
//   Box,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import { useDispatch, useSelector } from "react-redux";
// import React, { useState } from 'react';

// import AddClubForm from "./AddClubForm";
// import EditClubForm from "./EditClubForm";
// import { useNavigate } from "react-router-dom";
// import { fetchAllClubsRequest } from "../../redux/slices/club-slice/GetAllClubSlices";

// const ClubTable = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
  
//   const { allclubs, loading, error } = useSelector((state) => state.allclubs);
//   const [openDeleteModal, setOpenDeleteModal] = useState(false);
//   const [selectedClub, setSelectedClub] = useState(null);
  
//   // Fetch clubs on component mount
//   useEffect(() => {
//     dispatch(fetchAllClubsRequest());
//   }, [dispatch]);

//   // Function to handle adding a club
//   const handleAddClubClick = () => {
//     navigate("add-club");
//   };

//   // Function to handle editing a club
//   const handleEditClick = (club) => {
//     navigate("edit-club", { state: { club } });
//   };

//   // Function to handle deleting a club
//   const handleDeleteClick = (club) => {
//     setSelectedClub(club);
//     setOpenDeleteModal(true);
//   };

//   // Function to confirm deletion
//   const handleConfirmDelete = async () => {
//     if (selectedClub) {
//       try {
//         await fetch(`http://88.222.245.236:3002/club/${selectedClub.id}`, {
//           method: "DELETE",
//         });
//         dispatch(fetchAllClubsRequest()); // Refresh clubs after deletion
//       } catch (error) {
//         console.error("Error deleting club:", error);
//       } finally {
//         setOpenDeleteModal(false);
//         setSelectedClub(null);
//       }
//     }
//   };

//   return (
//     <Box sx={{ width: "100%", p: 2 }}>
//       <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
//         Club Management
//       </Typography>

//       <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
//         <Button variant="contained" color="primary" onClick={handleAddClubClick}>
//           + Add Club
//         </Button>
//       </Box>

//       {loading ? (
//         <CircularProgress />
//       ) : error ? (
//         <Typography color="error">Error loading clubs: {error}</Typography>
//       ) : (
//         <TableContainer component={Paper}>
//           <Table aria-label="Club Table">
//             <TableHead>
//               <TableRow>
//                 <TableCell>No.</TableCell>
//                 <TableCell>Club Name</TableCell>
//                 <TableCell>Litre Quantity</TableCell>
//                 <TableCell>Action</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {allclubs.length > 0 ? (
//                 allclubs.map((club, index) => (
//                   <TableRow key={club.id}>
//                     <TableCell>{index + 1}</TableCell>
//                     <TableCell>
//                       <Box display="flex" alignItems="center">
//                         <Avatar alt={club.club_name} src={club.avatar} />
//                         <Typography sx={{ marginLeft: "10px" }}>
//                           {club.club_name}
//                         </Typography>
//                       </Box>
//                     </TableCell>
//                     <TableCell>
//                       <Typography>{club.litre_quantity}</Typography>
//                     </TableCell>
//                     <TableCell>
//                       <IconButton color="secondary" onClick={() => handleEditClick(club)}>
//                         <EditIcon />
//                       </IconButton>
//                       <IconButton color="error" onClick={() => handleDeleteClick(club)}>
//                         <DeleteIcon />
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={4} align="center">
//                     No clubs available
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}

//       {/* Delete Confirmation Modal */}
//       <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
//         <DialogTitle>Confirm Deletion</DialogTitle>
//         <DialogContent>
//           <Typography>
//             Are you sure you want to delete the club "{selectedClub?.club_name}"?
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDeleteModal(false)} color="primary">
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

// export default ClubTable;
