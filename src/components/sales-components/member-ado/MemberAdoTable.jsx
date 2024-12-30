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
import SearchBox from "../../../search-box/SearchBox";
import axios from 'axios';
import { HiMiniUserGroup } from "react-icons/hi2";
import React, { useRef } from 'react';
import DeleteButton from "../../../assets/actions/DeleteButton.svg"
import EditButton from "../../../assets/actions/EditButton.svg"

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
  const [selectedRole, setSelectedRole] = useState(""); // Initially set as empty
  const [debouncedRole, setDebouncedRole] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [roleCounts, setRoleCounts] = useState({
    mdCount: 0,
    sdCount: 0,
    distributorCount: 0,
    customerCount: 0,
    adoCount: 0,
  });

  const navigate = useNavigate();
  const imageBaseURL = "http://88.222.245.236:3002/uploads/";

  const { users } = useSelector((state) => state.users);
  const UserId = users?.id;

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  useEffect(() => {
    if (role) {
      const initialRole = role === "Admin" ? "2" :
        role === "Area Development Officer" ? "3" :
          role === "Master Distributor" ? "4" :
            role === "Super Distributor" ? "5" :
              role === "Distributor" ? "6" : "3";
      setSelectedRole(initialRole);
      setCurrentPage(1);
    }
  }, [role]);



  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedRole(selectedRole);
    }, 500);

    setCurrentPage(1);

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
      case "Admin":
        return 2;
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

  const [loadingCounts, setLoadingCounts] = useState(true); // Loading state

  const fetchUserCounts = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    try {
      const response = await axios.get(`http://88.222.245.236:3002/api/user/${UserId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRoleCounts(response.data);
    } catch (error) {
      console.error("Error fetching role counts:", error);
    }
  };

  useEffect(() => {
    if (UserId) {
      fetchUserCounts();
    }
  }, [UserId]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const filteredMembersList = membersList.filter((member) =>
    member?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member?.mobile_number.toLowerCase().includes(searchQuery.toLowerCase())  // Add search for mobile_number
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
    setCurrentPage(newPage + 1);  // Fix page index starting from 1
  };

  const currentMembers = sortedMembersList.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  ///////
  const handleRowClick = (memberId, roleId) => {

    // If the current roleId is greater than or equal to 6, navigate to the customer details page
    if (roleId >= 6) {
      navigate(`/dashboard/customer_details/${memberId}/${roleId}`);
      window.location.reload();
      return;
    }

    // Increment roleId and check if the nextRoleId is 7
    const nextRoleId = roleId + 1;
    if (nextRoleId === 7) {
      navigate(`/dashboard/customer_details/${memberId}/${roleId}`);
    } else {
      navigate(`/dashboard/members/${memberId}/${nextRoleId}`);
    }

    window.location.reload();
  };




  const isScrolling = useRef(false); // Flag to track scrolling

  const handleMouseDown = () => {
    isScrolling.current = false;
  };

  const handleMouseMove = () => {
    isScrolling.current = true; // Set to true during scrolling
  };

  const handleMouseUp = () => {
    setTimeout(() => {
      isScrolling.current = false; // Reset after mouse interaction ends
    }, 150);
  };




  const renderPagination = (page, setPage, totalRows) => {
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "15px",
          padding: "10px",
        }}
      >
        <Button
          onClick={() => setPage(page - 1)}
          disabled={page <= 1}
          variant="outlined"
        >
          Previous
        </Button>
        <Typography variant="body1">
          Page {page} of {totalPages}
        </Typography>
        <Button
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
          variant="outlined"
        >
          Next
        </Button>
      </Box>
    );
  };



  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" sx={{ marginBottom: '20px', color: '#989FA9' }}>
        All Members
      </Typography>

      {showTable ? (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Box sx={{ width: '100%', marginTop: 2 }}>
              <SearchBox value={searchQuery} onSearchChange={handleSearchChange} />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              {/* Role Dropdown */}
              <FormControl style={{ width: '30%' }}>
                <InputLabel id="role-dropdown-label">Select Role</InputLabel>
                <Select
                  labelId="role-dropdown-label"
                  value={selectedRole}
                  onChange={(e) => handleChange(e.target.value)}
                  sx={{ borderRadius: '20px' }}
                >
                  {roleOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Role Count */}
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 100 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                  <HiMiniUserGroup size={30} style={{ marginRight: '8px' }} />
                  {selectedRole === '2' && roleCounts.adoCount}
                  {selectedRole === '3' && roleCounts.mdCount}
                  {selectedRole === '4' && roleCounts.sdCount}
                  {selectedRole === '5' && roleCounts.distributorCount}
                  {selectedRole === '6' && roleCounts.customerCount}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddMemberClick}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '5px',
              }}
            >
              + Add Member
            </Button>
          </Box>

          <TableContainer
            component={Paper}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <Table stickyHeader aria-label="Member ADO Table">
              <TableHead>
                <TableRow>
                  <TableCell>No.</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Mobile No.</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Email</TableCell>
                  {role === 'Admin' && <TableCell>Action</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {currentMembers.map((member, index) => (
                  <TableRow
                    key={member.id}
                    onClick={(e) => {
                      if (!isScrolling.current) {
                        handleRowClick(member.id, member.role_id);
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <TableCell>{(currentPage - 1) * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          src={member?.image ? `${imageBaseURL}${member.image}` : '/path/to/default-image.jpg'}
                        />
                        <Typography style={{ marginLeft: '10px' }}>{member?.username}</Typography>
                      </div>
                    </TableCell>
                    <TableCell>{member?.full_name}</TableCell>
                    <TableCell>{member?.mobile_number}</TableCell>
                    <TableCell>{member?.role_name}</TableCell>
                    <TableCell>{member?.email}</TableCell>
                    {role === 'Admin' && (
                      <TableCell>

                        <IconButton
                          color="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteOpen(member);
                          }}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditMemberClick(member);
                          }}
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
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <div style={{ marginTop: "10px" }}>
            {renderPagination(currentPage, setCurrentPage, sortedMembersList.length)}
          </div>


        </>
      ) : editMember ? (
        <EditMemberForm member={editMember} />
      ) : (
        <AddMemberForm />
      )}

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
