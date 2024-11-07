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
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddMemberForm from "./AddMemberForm"; // Import AddMemberForm component
import EditMemberForm from "./EditMemberForm"; // Import EditMemberForm component
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchMembersRequest } from "../../../redux/slices/member-slice/MemberGetSlice"; // Import useNavigate
import { deleteMemberRequest } from "../../../redux/slices/member-slice/MemberDeleteSlice";

const MemberAdoTable = () => {
  const dispatch = useDispatch();
  const { members } = useSelector((state) => state.members);
  const membersList = Array.isArray(members) ? members : [members];
  const [showTable, setShowTable] = useState(true); // State to toggle table visibility
  const [editMember, setEditMember] = useState(null); // State to store the selected member for editing
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // State to manage delete modal visibility
  const [memberToDelete, setMemberToDelete] = useState(null); // State to store the member to be deleted
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchMembersRequest({ roleId: 2 }));
  }, [dispatch]);

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
    navigate("edit-members", { state: { member } }); // Pass member data in state
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

  const [role, setRole] = useState("ado");
  const handleChange = (event) => {
    const selectedRole = event.target.value;
    setRole(selectedRole);
    let roleId = null;
    switch (selectedRole) {
      case "ado":
        roleId = 2;
        break;
      case "master":
        roleId = 3;
        break;
      case "super":
        roleId = 4;
        break;
      case "distributor":
        roleId = 5;
        break;
      case "customer":
        roleId = 6;
        break;
      default:
        break;
    }
    if (roleId) {
      dispatch(fetchMembersRequest({ roleId }));
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      {showTable ? (
        <>
          <Box sx={{ display: "flex", justifyContent: "flex-start", p: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="role-dropdown-label">
                Select Role
              </InputLabel>
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
            <Table aria-label="Member ADO Table">
              <TableHead>
                <TableRow>
                  <TableCell>No.</TableCell>
                  <TableCell>Id User</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Status/Month</TableCell>
                  <TableCell>Mobile No.</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
  {membersList.map((member, index) => (
    <TableRow key={member.id}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{member?.id}</TableCell>
      <TableCell>
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Use the image property from the member object */}
          <Avatar alt={member?.full_name} src={member?.image} /> 
          <Typography style={{ marginLeft: "10px" }}>
            {member?.username}
          </Typography>
        </div>
      </TableCell>
      <TableCell>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography style={{ marginRight: "10px" }}>
            {"95"}%
          </Typography>
          <CircularProgress
            variant="determinate"
            value={67}
            size={30}
            thickness={5}
            style={{ marginLeft: "10px" }}
          />
        </div>
      </TableCell>
      <TableCell>{member?.mobile_number}</TableCell>
      <TableCell>
        <IconButton color="primary">
          <VisibilityIcon />
        </IconButton>
        <IconButton
          color="secondary"
          onClick={() => handleEditMemberClick(member)} // Pass the member data
        >
          <EditIcon />
        </IconButton>
        <IconButton
          color="error"
          onClick={() => handleDeleteOpen(member)} // Open delete confirmation modal
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
        <EditMemberForm member={editMember} /> // Pass selected member to the EditMemberForm
      ) : (
        <AddMemberForm /> // Show AddMemberForm if no member is being edited
      )}
    </Box>
  );
};

export default MemberAdoTable;
