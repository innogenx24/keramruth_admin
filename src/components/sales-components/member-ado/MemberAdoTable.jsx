import { useState, useEffect, useMemo } from "react";
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
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchMembersRequest, clearMembers } from "../../../redux/slices/member-slice/MemberGetSlice";
import { deleteMemberRequest } from "../../../redux/slices/member-slice/MemberDeleteSlice";
import AddMemberForm from "./AddMemberForm"; // Import AddMemberForm component
import EditMemberForm from "./EditMemberForm"; // Import EditMemberForm component

const MemberAdoTable = () => {
  const dispatch = useDispatch();
  const { members } = useSelector((state) => state.members);
  const membersList = Array.isArray(members) ? members : [members];
  const [showTable, setShowTable] = useState(true);
  const [editMember, setEditMember] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [rowsPerPage] = useState(10); // Number of rows per page
  const navigate = useNavigate();
  const imageBaseURL = "http://88.222.245.236:3002/uploads/";
  const [selectedRole, setSelectedRole] = useState("");
  // console.log("rrrr", selectedRole);
  const [debouncedRole, setDebouncedRole] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  useEffect(() => {
    // Debounce logic: Wait 500ms before updating `debouncedRole`
    const timer = setTimeout(() => {
      setDebouncedRole(selectedRole);
    }, 500);

    return () => clearTimeout(timer); 
  }, [selectedRole]);

  // const role_Id = (() => {
  //   switch (role) {
  //     // case "Admin":
  //     //   return 1;
  //     case "Area Development Officer":
  //       return 3;
  //     case "Master Distributor":
  //       return 4;
  //     case "Super Distributor":
  //       return 5;
  //     case "Distributor":
  //       return 6;
  //     case "Customer":
  //       return 7;
  //     default:
  //       return null;
  //   }
  // })();

  const role_Id = useMemo(() => {
    switch (role) {
      case "Area Development Officer":
        return 3;
      case "Master Distributor":
        return 4;
      case "Super Distributor":
        return 5;
      case "Distributor":
        return 6;
      case "Customer":
        return 7;
      default:
        return 2; // Default role ID
    }
  }, [role]);
  

  const roleOptions = (() => {
    switch (role) {
      case "Admin":
        return [
          { label: "Area Development Officer (ADO)", value: "2" },
          { label: "Master Distributor (MD)", value: "3" },
          { label: "Super Distributor (SD)", value: "4" },
          { label: "Distributor (D)", value: "5" },
          { label: "Customer (C)", value: "6" },
        ];
      case "Area Development Officer":
        return [
          { label: "Master Distributor (MD)", value: "3" },
          { label: "Super Distributor (SD)", value: "4" },
          { label: "Distributor (D)", value: "5" },
          { label: "Customer (C)", value: "6" },
        ];
      case "Master Distributor":
        return [
          { label: "Super Distributor (SD)", value: "4" },
          { label: "Distributor (D)", value: "5" },
          { label: "Customer (C)", value: "6" },
        ];
      case "Super Distributor":
        return [
          { label: "Distributor (D)", value: "5" },
          { label: "Customer (C)", value: "6" },
        ];
      case "Distributor":
        return [{ label: "Customer (C)", value: "6" }];
      default:
        return [];
    }
  })();

  const handleChange = (value) => {
    setSelectedRole(value);
  };

  useEffect(() => {
    dispatch(clearMembers());
  }, [dispatch, selectedRole]);

  useEffect(() => {
    const roleToUse = debouncedRole || role_Id;

    if (roleToUse ) {
      dispatch(fetchMembersRequest({ roleId: roleToUse }));
    }
  }, [dispatch, role_Id, debouncedRole]);

// console.log("ani", role_Id)
// useEffect(() => {
//   if (role_Id !== undefined) {
//     console.log("Dispatching with role_Id:", role_Id);
//     dispatch(fetchMembersRequest({ roleId: role_Id }));
//   }
// }, [dispatch, role_Id]);

  // useEffect(() => {
  //   dispatch(fetchMembersRequest({role_Id}));
  // }, [dispatch, role_Id, selectedRole]);

  const sortedMembersList = [...membersList].sort((a, b) => b.id - a.id);

  // Function to handle the click of "Add Member" button
  const handleAddMemberClick = () => {
    setEditMember(null); // Clear any selected member for editing
    setShowTable(false); // Hide the table and show the Add Member form
    navigate("add-members");
  };

  // Function to handle the click of "Edit" button
  const handleEditMemberClick = (member) => {
    setEditMember(member); // Set the selected member for editing
    setShowTable(false); // Hide the table and show the Edit Member form
    navigate(`edit-members/${member?.id}`);
  };

  // Function to open delete confirmation modal
  const handleDeleteOpen = (member) => {
    setMemberToDelete(member); // Set the member to be deleted
    setDeleteModalOpen(true); // Open the delete modal
  };

  // Function to confirm deletion
  const confirmDelete = () => {
    dispatch(deleteMemberRequest(memberToDelete?.id));
    setDeleteModalOpen(false);
    window.location.reload();
  };

  // const [role, setRole] = useState("ado");
  // const handleChange = (event) => {
  //   const selectedRole = event.target.value;
  //   setRole(selectedRole);
  //   let roleId = null;
  //   switch (selectedRole) {
  //     case "ado":
  //       roleId = 2;
  //       break;
  //     case "master":
  //       roleId = 3;
  //       break;
  //     case "super":
  //       roleId = 4;
  //       break;
  //     case "distributor":
  //       roleId = 5;
  //       break;
  //     case "customer":
  //       roleId = 6;
  //       break;
  //     default:
  //       break;
  //   }
  //   if (roleId) {
  //     dispatch(fetchMembersRequest({ roleId }));
  //     setCurrentPage(1);
  //   }
  // };

  // Pagination logic
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage + 1); // +1 because page index starts at 0
  };

  // Slice the members list for the current page
  const currentMembers = sortedMembersList.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <Box sx={{ width: "100%" }}>
      {showTable ? (
        <>
          <Box sx={{ display: "flex", justifyContent: "flex-start", p: 2 }}>
            {/* <FormControl fullWidth>
              <InputLabel id="role-dropdown-label">Select Role</InputLabel>
              <Select
                labelId="role-dropdown-label"
                value={role}
                onChange={handleChange}
              >
                <MenuItem value="ado">Area Development Officer (ADO)</MenuItem>
                <MenuItem value="master">Master Distributor</MenuItem>
                <MenuItem value="super">Super Distributor</MenuItem>
                <MenuItem value="distributor">Distributor</MenuItem>
                <MenuItem value="customer">Customers</MenuItem>
              </Select>
            </FormControl> */}
            <FormControl fullWidth>
              <InputLabel id="role-dropdown-label">Select Role</InputLabel>
              <Select
                labelId="role-dropdown-label"
                value={selectedRole} // State to manage selected role
                onChange={(e) => handleChange(e.target.value)} // Update state on change
              >
                {roleOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddMemberClick}
            >
              + Add Member
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table stickyHeader aria-label="Member ADO Table">
              <TableHead>
                <TableRow>
                  <TableCell>No.</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Mobile No.</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Email</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentMembers.map((member, index) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      {(currentPage - 1) * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          src={
                            member?.image
                              ? `${imageBaseURL}${member.image}`
                              : "/path/to/default-image.jpg"
                          }
                        />
                        <Typography style={{ marginLeft: "10px" }}>
                          {member?.username}
                        </Typography>
                      </div>
                    </TableCell>
                    <TableCell>{member?.full_name}</TableCell>
                    <TableCell>{member?.mobile_number}</TableCell>
                    <TableCell>{member?.role_name}</TableCell>
                    <TableCell>{member?.email}</TableCell>

                    <TableCell>
                      <IconButton
                        color="secondary"
                        onClick={() => handleEditMemberClick(member)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteOpen(member)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination Controls */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "right",
              p: 2,
              height: "50px",
            }}
          >
            <Button
              onClick={() => handleChangePage(null, currentPage - 2)}
              disabled={currentPage === 1}
              variant="outlined"
              style={{ height: "40px" }}
            >
              Previous
            </Button>
            <Typography
              sx={{ p: 1, height: "40px" }}
            >{`Page ${currentPage}`}</Typography>
            <Button
              onClick={() => handleChangePage(null, currentPage)}
              disabled={currentMembers.length < rowsPerPage}
              variant="outlined"
              style={{ height: "40px" }}
            >
              Next
            </Button>
          </Box>

          {/* Delete Confirmation Modal */}
          <Dialog
            open={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
          >
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete the member "
                {memberToDelete?.full_name}" with ID "{memberToDelete?.id}"?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteModalOpen(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={confirmDelete} color="secondary">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : editMember ? (
        <EditMemberForm member={editMember} />
      ) : (
        <AddMemberForm />
      )}
    </Box>
  );
};

export default MemberAdoTable;
