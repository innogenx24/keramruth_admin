// MemberAdoTable.js
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
import AddMemberForm from "./AddMemberForm";
import EditMemberForm from "./EditMemberForm";
import SearchBox from "../../../search-box/SearchBox"

const MemberAdoTable = () => {
  const dispatch = useDispatch();
  const { members } = useSelector((state) => state.members);
  const membersList = Array.isArray(members) ? members : [members];
  const [showTable, setShowTable] = useState(true);
  const [editMember, setEditMember] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [selectedRole, setSelectedRole] = useState("");
  const [debouncedRole, setDebouncedRole] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const navigate = useNavigate();
  const imageBaseURL = "http://88.222.245.236:3002/uploads/";

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedRole(selectedRole);
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedRole]);

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
        return 2;
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
    if (roleToUse) {
      dispatch(fetchMembersRequest({ roleId: roleToUse }));
    }
  }, [dispatch, role_Id, debouncedRole]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const filteredMembersList = membersList.filter((member) =>
    member?.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedMembersList = [...filteredMembersList].sort((a, b) => b.id - a.id);

  const handleAddMemberClick = () => {
    setEditMember(null);
    setShowTable(false);
    navigate("add-members");
  };

  const handleEditMemberClick = (member) => {
    setEditMember(member);
    setShowTable(false);
    navigate(`edit-members/${member?.id}`);
  };

  const handleDeleteOpen = (member) => {
    setMemberToDelete(member);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    dispatch(deleteMemberRequest(memberToDelete?.id));
    setDeleteModalOpen(false);
    window.location.reload();
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage + 1);
  };

  const currentMembers = sortedMembersList.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <Box sx={{ width: "100%" }}>
                <SearchBox value={searchQuery} onSearchChange={handleSearchChange} /> {/* Search box component */}

      {showTable ? (
        <>
          <Box sx={{ display: "flex", justifyContent: "flex-start", p: 2 }}>
            <FormControl style={{width:"30%"}}>
              <InputLabel id="role-dropdown-label">Select Role</InputLabel>
              <Select
                labelId="role-dropdown-label"
                value={selectedRole}
                onChange={(e) => handleChange(e.target.value)}
                sx={{
                  borderRadius: "20px", 
                }}
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
            <Button variant="contained" color="primary" onClick={handleAddMemberClick}

style={{
  backgroundColor: "#28a745",
  color: "white",
  fontWeight: "bold",
  borderRadius: "5px",
}}
            
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
                    <TableCell>{(currentPage - 1) * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          src={member?.image ? `${imageBaseURL}${member.image}` : "/path/to/default-image.jpg"}
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
                      <IconButton color="secondary" onClick={() => handleEditMemberClick(member)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteOpen(member)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : editMember ? (
        <EditMemberForm member={editMember} />
      ) : (
        <AddMemberForm />
      )}

      {/* Delete Member Confirmation Dialog */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this member?
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
    </Box>
  );
};

export default MemberAdoTable;
