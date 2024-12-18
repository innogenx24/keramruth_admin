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
  Grid,
  CardContent,
  Card,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import { fetchMembersRequest, clearMembers } from "../../../redux/slices/member-slice/MemberGetSlice";
// import { deleteMemberRequest } from "../../../redux/slices/member-slice/MemberDeleteSlice";
import AddMemberForm from ".././AddMemberForm";
import EditMemberForm from ".././EditMemberForm";
// import SearchBox from "../../../search-box/SearchBox";
import axios from 'axios';
import { HiMiniUserGroup } from "react-icons/hi2";
import { clearMembers, fetchMembersRequest } from "../../../../redux/slices/member-slice/MemberGetSlice";
import SearchBox from "../../../../search-box/SearchBox";

const MemberDetailTable = () => {
  const percentage = 87; // Percentage to display
  const pending = 2800; // Pending in Litres
  const targetVolume = 5000; // Total target in Litres
  const dispatch = useDispatch();
  // const { members } = useSelector((state) => state.members);
  // const membersList = Array.isArray(members) ? members : [members];
  const [membersList, setMembersList] = useState([]);
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

  const { memberID, rolesID } = useParams();

  const [newRoleID, setNewRoleID] = useState(rolesID || null);


  useEffect(() => {
    if (rolesID) {
      setSelectedRole(rolesID);
      setCurrentPage(1);
    } else if (role) {
      const initialRole = role === "Area Development Officer" ? "3" :
        role === "Master Distributor" ? "4" :
          role === "Super Distributor" ? "5" :
            role === "Distributor" ? "6" : "3";
      setSelectedRole(initialRole);
      setCurrentPage(1);
    }
  }, [rolesID, role]);



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
          //   { label: "Area Development Officer (ADO)", value: "2" },
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
    setNewRoleID(value)
  };

  useEffect(() => {
    dispatch(clearMembers());
  }, [dispatch, selectedRole]);



  useEffect(() => {
    // const roleToUse = rolesID || debouncedRole || role_Id;
    const roleToUse = newRoleID || debouncedRole || role_Id;


    if (roleToUse) {
      const fetchMembers = async () => {
        try {
          // Replace API call here
          const response = await axios.get(
            `http://88.222.245.236:3002/directMembers/users-by-ado?adoId=${memberID}&roleId=${roleToUse}`
          );

          if (response.data) {
            setMembersList(response.data);
          } else {
            setMembersList([]);
          }
        } catch (error) {
          console.error("Failed to fetch members:", error);
          setMembersList([]); // Clear the list on error
        }
      };

      fetchMembers();
    }
  }, [role_Id, debouncedRole, memberID]);
  





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
  const renderPagination = (totalRows) => (
    <div style={{ display: "flex", justifyContent: "right", alignItems: "center", gap: "15px" }}>
      <Button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}  // Ensure it doesn't go below 1
        disabled={currentPage === 1}
        variant="outlined"
      >
        Previous
      </Button>
      <Typography variant="body1" style={{ minWidth: "60px", textAlign: "center" }}>
        Page {currentPage}
      </Typography>
      <Button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(totalRows / rowsPerPage)))}
        disabled={currentPage >= Math.ceil(totalRows / rowsPerPage)}
        variant="outlined"
      >
        Next
      </Button>
    </div>
  );
  ///////
  const handleRowClick = (memberId, roleId) => {
    if (roleId >= 6) {
      return;
    }
    const nextRoleId = roleId + 1;
    setNewRoleID(nextRoleId)
    navigate(`/dashboard/members/${memberId}/${nextRoleId}`);
  };


  //////filter role option ///////////
  // const filteredRoleOptions = useMemo(() => {
  //   return roleOptions.filter(option => {
  //     if (newRoleID === 4) {
  //       return option.value !== "3"; // Hide Master Distributor (MD)
  //     }
  //     if (newRoleID === 5) {
  //       return option.value !== "3" && option.value !== "4"; // Hide MD and SD
  //     }
  //     if (newRoleID === 6) {
  //       return option.value !== "3" && option.value !== "4" && option.value !== "5"; // Hide MD, SD, and D
  //     }
  //     return true; // Show all for other cases
  //   });
  // }, [newRoleID, roleOptions]);
  const [filteredRoleOptions, setFilteredRoleOptions] = useState([]);
  useEffect(() => {
    setFilteredRoleOptions(roleOptions.filter(option => {
      if (newRoleID === 4) {
        return option.value !== "3"; // Hide MD
      }
      if (newRoleID === 5) {
        return option.value !== "3" && option.value !== "4"; // Hide MD and SD
      }
      if (newRoleID === 6) {
        return option.value !== "3" && option.value !== "4" && option.value !== "5"; // Hide MD, SD, and D
      }
      return true; // Show all for other cases
    }));
  }, [newRoleID, roleOptions]);

  ///**fetch memeber profile data */
  const [userProfile, setUserProfile] = useState(null);
  // const userId = 606; // Replace with the dynamic userId if needed
  const token = localStorage.getItem("token");
  

  useEffect(() => {

    if (!memberID) {
      console.warn("No memberID provided, skipping fetch.");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `http://88.222.245.236:3002/directMembers/profile-hirarchy?userId=${memberID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserProfile(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [memberID, token]);

  if (!memberID) {
    return <Typography>No member selected in the URL.</Typography>;
  }

  if (!userProfile) {
    return <Typography>Loading profile...</Typography>;
  }


  const {
    full_name,
    role_name,
    email,
    mobile_number,
    street_name,
    city,
    state,
    country,
    image,
    building_no_name,
  } = userProfile;


  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" sx={{ color: '#989FA9' }}>
        All Members
      </Typography>
      {/* /////// */}
      <Box sx={{ padding: 3 }} >


        <Card variant="outlined">
          <CardContent>
            <Grid container spacing={3} alignItems="center">

            <Grid item xs={12} md={6}>
      <Box display="flex" alignItems="center" sx={{ backgroundColor: "#F1F3FF", p: 2, borderRadius: 2 }}>
        <Avatar
          src={image ? `http://88.222.245.236:3002/images/${image}` : undefined} // Replace with the profile picture URL
          alt={full_name || "hu"}
          sx={{ width: 80, height: 80, mr: 2 }}
        />
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {full_name || "N/A"}
          </Typography>
          <Typography color="primary">{`ID: ${memberID}`}</Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {role_name || "N/A"}
          </Typography>
          <Box display="flex" mt={1}>
            <Typography variant="body2">
              {`${building_no_name || ""}, ${street_name || ""}, ${city || ""}, ${state || ""}, ${country || ""}`}
            </Typography>
          </Box>
          <Box display="flex" mt={0.5}>
            <Typography variant="body2">
              {mobile_number ? `+91 ${mobile_number || "dd"}` : "N/A"}
            </Typography>
          </Box>
          <Box display="flex" mt={0.5}>
            <Typography variant="body2">{email || "N/A"}</Typography>
          </Box>
        </Box>
      </Box>
    </Grid>

              {/* Stats Section */}
              <Grid item xs={12} md={6}>
                <Box display="flex" flexDirection="column" gap={3} >
                  {/* Target Section */}
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    {/* Circular Graph */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" sx={{ backgroundColor: '#F1F3FF' }}>
                      {/* First Graph with Content (Left Aligned) */}
                      <Box display="flex" alignItems="center" flex="1" justifyContent="flex-start">
                        {/* Circular Progress (Background Circle) */}
                        <Box position="relative" display="inline-flex">
                          <CircularProgress
                            variant="determinate"
                            value={100}
                            size={120}
                            thickness={5}
                            style={{ color: "#e0e0e0" }}
                          />
                          {/* Active Circular Progress */}
                          <CircularProgress
                            variant="determinate"
                            value={percentage}
                            size={120}
                            thickness={5}
                            color="primary"
                            style={{ position: "absolute" }}
                          />
                          {/* Percentage in Center */}
                          <Box
                            position="absolute"
                            top="50%"
                            left="50%"
                            sx={{
                              transform: "translate(-50%, -50%)",
                            }}
                          >
                            <Typography variant="h5" color="primary" fontWeight="bold">
                              {percentage}%
                            </Typography>
                          </Box>
                        </Box>

                        {/* Content on Right Side of First Graph */}
                        <Box ml={2}>
                          <Typography variant="h6" fontWeight="bold" mb={0.5}>
                            Target
                          </Typography>
                          <Typography variant="body2" color="text.secondary" mb={0.5}>
                            {targetVolume} Litres
                          </Typography>
                          <Typography variant="body2" color="error" fontWeight="bold">
                            Pending: {pending} L
                          </Typography>
                        </Box>
                      </Box>

                      {/* Second Graph with Content (Right Aligned) */}
                      <Box display="flex" alignItems="center" flex="1" justifyContent="flex-end">
                        {/* Circular Progress (Background Circle) */}
                        <Box position="relative" display="inline-flex">
                          <CircularProgress
                            variant="determinate"
                            value={100}
                            size={120}
                            thickness={5}
                            style={{ color: "#e0e0e0" }}
                          />
                          {/* Active Circular Progress */}
                          <CircularProgress
                            variant="determinate"
                            value={percentage}
                            size={120}
                            thickness={5}
                            color="primary"
                            style={{ position: "absolute" }}
                          />
                          {/* Percentage in Center */}
                          <Box
                            position="absolute"
                            top="50%"
                            left="50%"
                            sx={{
                              transform: "translate(-50%, -50%)",
                            }}
                          >
                            <Typography variant="h5" color="primary" fontWeight="bold">
                              {percentage}%
                            </Typography>
                          </Box>
                        </Box>

                        {/* Content on Left Side of Second Graph */}
                        <Box ml={2}>
                          <Typography variant="h6" fontWeight="bold" mb={0.5}>
                            Target
                          </Typography>
                          <Typography variant="body2" color="text.secondary" mb={0.5}>
                            {targetVolume} Litres
                          </Typography>
                          <Typography variant="body2" color="error" fontWeight="bold">
                            Pending: {pending} L
                          </Typography>
                        </Box>
                      </Box>
                    </Box>


                  </Box>

                  {/* Club Section */}
                  <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" sx={{ backgroundColor: '#F1F3FF' }}>
                    <Typography>
                      Club:{" "}
                      <span style={{ color: "#1976D2", fontWeight: "bold" }}>
                        1000 Litres
                      </span>
                    </Typography>
                    <Typography color="text.secondary">15-Mar-24 Joined</Typography>
                  </Box>
                </Box>
              </Grid>


            </Grid>
          </CardContent>
        </Card>


        {/* <Box textAlign="center" mt={3}>
          <Button variant="outlined" color="success">
            VIEW RECENT BOOKING
          </Button>
        </Box> */}


      </Box>

      {showTable ? (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Box sx={{ width: '100%', marginTop: 2 }}>

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
                  {/* {roleOptions.map((option) => ( */}
                  {filteredRoleOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              

           
              {/* <Box sx={{ display: 'flex', alignItems: 'center', mr: 100 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                  <HiMiniUserGroup size={30} style={{ marginRight: '8px' }} />
                  {selectedRole === '3' && roleCounts.mdCount}
                  {selectedRole === '4' && roleCounts.sdCount}
                  {selectedRole === '5' && roleCounts.distributorCount}
                  {selectedRole === '6' && roleCounts.customerCount}
                </Typography>
              </Box> */}
              



            </Box>
          </Box>

          {/* <Box sx={{ display: 'flex', justifyContent: 'flex-centre', p: 2 }}>
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
          </Box> */}

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
                  {role === 'Admin' && <TableCell>Action</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMembersList.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).map((member, index) => (
                  <TableRow
                    key={member.id}
                    onClick={() => handleRowClick(member.id, member.role_id)}
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
                        <IconButton color="secondary" onClick={() => handleEditMemberClick(member)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDeleteOpen(member)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <div style={{ marginTop: '10px' }}>
            {renderPagination(filteredMembersList.length)}
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


export default MemberDetailTable