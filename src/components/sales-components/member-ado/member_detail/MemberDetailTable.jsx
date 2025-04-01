import { useState, useEffect, useMemo } from "react";
import React, { useRef } from "react";
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
import { LocationOn, Phone, Mail } from "@mui/icons-material";

// import { fetchMembersRequest, clearMembers } from "../../../redux/slices/member-slice/MemberGetSlice";
// import { deleteMemberRequest } from "../../../redux/slices/member-slice/MemberDeleteSlice";
import { deleteMemberRequest } from "../../../../redux/slices/member-slice/MemberDeleteSlice";
import AddMemberForm from ".././AddMemberForm";
import EditMemberForm from ".././EditMemberForm";
// import SearchBox from "../../../search-box/SearchBox";
import axios from "axios";
import { HiMiniUserGroup } from "react-icons/hi2";
import {
  clearMembers,
  fetchMembersRequest,
} from "../../../../redux/slices/member-slice/MemberGetSlice";
import SearchBox from "../../../../search-box/SearchBox";
import DeleteButton from "../../../../assets/actions/DeleteButton.svg";
import EditButton from "../../../../assets/actions/EditButton.svg";
import { API_END_POINT_IMG } from "../../../../constants/ApiConstant";
const MemberDetailTable = () => {
  const dispatch = useDispatch();
  // const { members } = useSelector((state) => state.members);
  // const membersList = Array.isArray(members) ? members : [members];
  const [membersList, setMembersList] = useState([]);
  const [salesData, setSalesData] = useState([0]);
  const [roleToUse, setRoleToUse] = useState(null); // Initialize roleToUse state
  const { userId } = useMemo(
    () => JSON.parse(localStorage.getItem("user")) || {},
    []
  );
  const [loading, setLoading] = useState(false);
  const [newMemberId, setNewMemberId] = useState(null); // Add this line

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
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  const navigate = useNavigate();
  const imageBaseURL = `${API_END_POINT_IMG}/uploads/`;

  const { users } = useSelector((state) => state.users);
  const UserId = users?.id;

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const { memberID, rolesID } = useParams();

  const [newRoleID, setNewRoleID] = useState(rolesID || null);

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

  useEffect(() => {
    if (role) {
      const calculatedRoleToUse =
        role === "Area Development Officer"
          ? 3
          : role === "Master Distributor"
          ? 4
          : role === "Super Distributor"
          ? 5
          : role === "Distributor"
          ? 6
          : role === "Customer"
          ? 7
          : null;

      setRoleToUse(calculatedRoleToUse); // Set roleToUse here
    }
  }, [role]); // Ensure this effect runs on role change

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedRole(selectedRole);
    }, 500);

    setCurrentPage(1);

    return () => clearTimeout(timer);
  }, [selectedRole]);

  const role_Id = useMemo(() => {
    switch (role) {
      case "Master Distributor":
        return 4;
      case "Super Distributor":
        return 5;
      case "Distributor":
        return 6;
      case "Customer":
        return 7;
    }
  }, [role]);

  const roleOptions = [
    { label: "Master Distributor (MD)", value: "3" },
    { label: "Super Distributor (SD)", value: "4" },
    { label: "Distributor (D)", value: "5" },
    { label: "Customer (C)", value: "6" },
  ];

  const [filteredRoleOptions, setFilteredRoleOptions] = useState([]);

  useEffect(() => {
    const filteredRoles = roleOptions.filter((option) => {
      // Hide roles based on the selected rolesID
      if (rolesID === "4") {
        return option.value !== "3"; // Hide MD when SD is selected (rolesID === 4)
      }
      if (rolesID === "5") {
        return option.value !== "3" && option.value !== "4"; // Hide MD and SD for Distributor
      }
      if (rolesID === "6") {
        return (
          option.value !== "3" && option.value !== "4" && option.value !== "5"
        ); // Hide MD, SD, and Distributor for Customer
      }
      if (rolesID === "7") {
        return option.value === "7"; // Only show role 7 (Customer) when it's selected
      }

      return true; // Default: show all roles
    });

    setFilteredRoleOptions(filteredRoles);
  }, [rolesID]); // Re-run the effect whenever rolesID changes

  const handleChange = (value) => {
    setSelectedRole(value);
    setRoleToUse(value);
  };

  useEffect(() => {
    dispatch(clearMembers());
  }, [dispatch, selectedRole]);

  useEffect(() => {
    if (!roleToUse || !memberID) return;

    // Set members list to an empty array or null when changing roles
    setMembersList([]);
    setLoading(true); // Set loading to true to indicate fetching state

    const fetchMembers = async () => {
      try {
        const response = await axios.get(
          `${API_END_POINT}/directMembers/users-by-ado?adoId=${memberID}&roleId=${roleToUse}`
        );
        setMembersList(response.data || []); // Set new members list
      } catch (error) {
        console.error("Failed to fetch members:", error);
        setMembersList([]); // Reset the list in case of error
      } finally {
        setLoading(false); // Reset loading state
      }
    };

    fetchMembers();
  }, [roleToUse, memberID]);

  // Set roleToUse based on URL roleID or user role
  useEffect(() => {
    if (rolesID) {
      setSelectedRole(rolesID); // Set selected role from URL
      setRoleToUse(rolesID); // Set roleToUse for fetching members
    }
  }, [rolesID]);

  useEffect(() => {
    const fetchSalesAchievement = async () => {
      try {
        const response = await axios.get(
          `${API_END_POINT}/user_sales_detail/sales_achievement/${roleToUse}/${memberID}`
        );
        const { monthlyDetails } = response.data;
        setSalesData(monthlyDetails || []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch sales data:", error);
        setLoading(false);
      }
    };

    fetchSalesAchievement();
  }, [roleToUse, memberID]);

  const fetchUserCounts = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_END_POINT}/user/${memberID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setRoleCounts(response.data);
    } catch (error) {
      console.error("Error fetching role counts:", error);
    }
};

  useEffect(() => {
    if (memberID) {
      fetchUserCounts();
    }
  }, [memberID]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const filteredMembersList = membersList.filter(
    (member) =>
      member?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member?.mobile_number.toLowerCase().includes(searchQuery.toLowerCase()) // Add search for mobile_number
  );

  const sortedMembersList = [...filteredMembersList].sort(
    (a, b) => b.id - a.id
  );

  const handleAddMemberClick = () => {
    setEditMember(null);
    setShowTable(false);
    navigate("add-members");
  };

  const handleEditMemberClick = (member) => {
    setEditMember(member);
    setShowTable(false);
    navigate(`/dashboard/members/edit-members/${member?.id}`);
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
    setCurrentPage(newPage + 1); // Fix page index starting from 1
  };

  const currentMembers = sortedMembersList.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  ///////
  const handleRowClick = (memberId, roleId, customerData) => {
    // if (roleId >= 6) {
    //   return;
    // }

    if (roleId >= 7) {
      return;
    }

    if (roleId === 6) {
      navigate(`/dashboard/customer_details/${memberId}/${roleId}`);

      return;
    }

    const nextRoleId = roleId + 1;
    setNewRoleID(nextRoleId);
    navigate(`/dashboard/members/${memberId}/${nextRoleId}`);
  };

  ///***** For Model *****//////
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Function to handle closing the modal
  const handleCloseCustomerModal = () => {
    setCustomerModalOpen(false);
    setSelectedCustomer(null);
  };

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
          `${API_END_POINT}/directMembers/profile-hirarchy?userId=${memberID}`,
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
    username,
    email,
    mobile_number,
    street_name,
    city,
    state,
    country,
    image,
    building_no_name,
    createdAt,
    club_name,
    district,
    pincode,
  } = userProfile;

  const newMemberID = memberID || newMemberId;

  const {
    MonthlyTargetAmount,
    achievementAmountPercent,
    StockAchievementPercent,
    AchievementAmount,
    pendingAmount,
    StockTarget,
    StockAchievement,
    PendingStockTarget,
  } = salesData[0];

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
    <Box sx={{ width: "104%" }}>
      <Typography variant="h6" sx={{ color: "#989FA9" }}>
        All Members
      </Typography>
      {/* /////// */}
      <Box sx={{ padding: 3 }}>
        <Card variant="outlined">
          <CardContent>
            <Grid container spacing={3}>
              {/* Profile Section */}
              <Grid item xs={12} md={6}>
                <Box
                  display="flex"
                  alignItems="center"
                  sx={{
                    backgroundColor: "#F1F3FF",
                    p: 2,
                    borderRadius: 2,
                    height: "100%",
                  }}
                >
                  <Avatar
                    src={image ? `${imageBaseURL}${image}` : undefined}
                    alt={full_name || "N/A"}
                    sx={{ width: 80, height: 80, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {full_name || "N/A"}
                    </Typography>
                    <Typography color="primary">{`ID: ${username}`}</Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      Role: {role_name || "N/A"}
                    </Typography>

                    {/* Address */}
                    <Box display="flex" alignItems="center" mt={2}>
                      <LocationOn style={{ marginRight: "8px" }} />
                      <Typography variant="body2">
                        {street_name}, {building_no_name}, {city}, {district},{" "}
                        {state}, {pincode}.
                      </Typography>
                    </Box>

                    {/* Phone */}
                    <Box display="flex" alignItems="center" mt={1}>
                      <Phone style={{ marginRight: "8px" }} />
                      <Typography variant="body2">{mobile_number}</Typography>
                    </Box>

                    {/* Email */}
                    <Box display="flex" alignItems="center" mt={1}>
                      <Mail style={{ marginRight: "8px" }} />
                      <Typography variant="body2">{email}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              {/* Sales Section */}
              <Grid item xs={12} md={6}>
                <Box
                  display="flex"
                  flexDirection="column"
                  gap={3}
                  height="100%"
                >
                  <Box display="flex" justifyContent="space-between" gap={2}>
                    {/* Target Amount Section */}
                    <Box
                      display="flex"
                      alignItems="center"
                      sx={{
                        backgroundColor: "#F1F3FF",
                        p: 2,
                        borderRadius: 2,
                        flex: 1,
                      }}
                    >
                      <Box position="relative" display="inline-flex" mr={2}>
                        {/* Background Circular Progress */}
                        <CircularProgress
                          variant="determinate"
                          value={100}
                          size={80}
                          thickness={5}
                          style={{ color: "#e0e0e0" }}
                        />
                        {/* Foreground Circular Progress */}
                        <CircularProgress
                          variant="determinate"
                          value={achievementAmountPercent}
                          size={80}
                          thickness={5}
                          style={{
                            position: "absolute",
                            color:
                              achievementAmountPercent < 50
                                ? "red"
                                : achievementAmountPercent < 75
                                ? "orange"
                                : "green",
                          }}
                        />
                        {/* Centered Text */}
                        <Box
                          position="absolute"
                          top="50%"
                          left="50%"
                          sx={{
                            transform: "translate(-50%, -50%)",
                          }}
                        >
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{
                              fontSize: "1.08rem !important",
                              color: "primary",
                            }}
                          >
                            {achievementAmountPercent != null &&
                            !isNaN(achievementAmountPercent)
                              ? parseFloat(achievementAmountPercent) === 100
                                ? 100
                                : parseFloat(achievementAmountPercent).toFixed(
                                    2
                                  )
                              : 0}
                            %
                          </Typography>
                        </Box>
                      </Box>

                      <Box>
                        <Typography variant="h6" fontWeight="bold" mb={0.5}>
                          Sales Target{" "}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Rs.{" "}
                          {new Intl.NumberFormat("en-IN").format(
                            parseFloat(MonthlyTargetAmount) || 0
                          )}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{ color: "green", fontWeight: "bold" }}
                        >
                          Achieved:{" "}
                          {new Intl.NumberFormat("en-IN").format(
                            parseFloat(AchievementAmount) || 0
                          )}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="error"
                          fontWeight="bold"
                        >
                          Pending:{" "}
                          {new Intl.NumberFormat("en-IN").format(
                            parseFloat(pendingAmount) || 0
                          )}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Sales Target Section */}
                    <Box
                      display="flex"
                      alignItems="center"
                      sx={{
                        backgroundColor: "#F1F3FF",
                        p: 2,
                        borderRadius: 2,
                        flex: 1,
                      }}
                    >
                      <Box position="relative" display="inline-flex" mr={2}>
                        <CircularProgress
                          variant="determinate"
                          value={100}
                          size={80}
                          thickness={5}
                          style={{ color: "#e0e0e0" }}
                        />
                        <CircularProgress
                          variant="determinate"
                          value={StockAchievementPercent} // Keep as is, since it's already in decimal form
                          size={80}
                          thickness={5}
                          style={{
                            position: "absolute",
                            color:
                              StockAchievementPercent < 50
                                ? "red"
                                : StockAchievementPercent < 75
                                ? "orange"
                                : "green",
                          }}
                        />
                        <Box
                          position="absolute"
                          top="50%"
                          left="50%"
                          sx={{ transform: "translate(-50%, -50%)" }}
                        >
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{
                              fontSize: "1.08rem !important",
                              color: "primary",
                            }}
                          >
                            {StockAchievementPercent != null &&
                            !isNaN(StockAchievementPercent)
                              ? parseFloat(StockAchievementPercent) === 100
                                ? 100
                                : parseFloat(StockAchievementPercent).toFixed(2)
                              : 0}
                            %
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight="bold" mb={0.5}>
                          Stock Target{" "}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Rs.{" "}
                          {new Intl.NumberFormat("en-IN").format(
                            parseFloat(StockTarget) || 0
                          )}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{ color: "green", fontWeight: "bold" }}
                        >
                          Achieved:{" "}
                          {new Intl.NumberFormat("en-IN").format(
                            parseFloat(StockAchievement) || 0
                          )}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="error"
                          fontWeight="bold"
                        >
                          Pending:{" "}
                          {new Intl.NumberFormat("en-IN").format(
                            parseFloat(PendingStockTarget) || 0
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Club Section */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ p: 2, borderRadius: 2 }}
                  >
                    {role_name !== "Area Development Officer" && (
                      <Typography>
                        Club:{" "}
                        <span style={{ color: "#1c96c5" }}>
                          {club_name ? club_name : "N/A"}
                        </span>
                      </Typography>
                    )}
                    <Typography></Typography>

                    <Typography
                      color="text.secondary"
                      style={{ color: "#1c96c5" }}
                    >
                      Date of Joining:{" "}
                      {new Date(createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "2-digit",
                      })}{" "}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {showTable ? (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ width: "100%", marginTop: 2 }}>
              <SearchBox
                value={searchQuery}
                onSearchChange={handleSearchChange}
              />
            </Box>
            <Box>
              <Box sx={{ marginBottom: "20px" }}>
                <InputLabel id="role-dropdown-label">Select Role</InputLabel>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                {/* Role Dropdown */}
                <FormControl sx={{ width: "100%" }}>
                  <Select
                    labelId="role-dropdown-label"
                    value={selectedRole}
                    onChange={(e) => handleChange(e.target.value)}
                    sx={{ borderRadius: "20px" }}
                  >
                    {filteredRoleOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Role Count */}
                <Box
                  sx={{ display: "flex", alignItems: "center", marginTop: 2 }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: "10px",
                    }}
                  >
                    <HiMiniUserGroup size={30} style={{ marginRight: "8px" }} />
                    {selectedRole === "3" && roleCounts.mdCount}
                    {selectedRole === "4" && roleCounts.sdCount}
                    {selectedRole === "5" && roleCounts.distributorCount}
                    {selectedRole === "6" && roleCounts.customerCount}
                  </Typography>
                </Box>
              </Box>
            </Box>
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
                  <TableCell sx={{ backgroundColor: "#DCDCDC" }}>No.</TableCell>
                  <TableCell sx={{ backgroundColor: "#DCDCDC" }}>
                    Username
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#DCDCDC" }}>
                    Full Name
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#DCDCDC" }}>
                    Mobile No.
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#DCDCDC" }}>
                    Role
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#DCDCDC" }}>
                    Email
                  </TableCell>
                  {role === "Admin" && (
                    <TableCell sx={{ backgroundColor: "#DCDCDC" }}>
                      Action
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : membersList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No Data Available
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembersList
                    .slice(
                      (currentPage - 1) * rowsPerPage,
                      currentPage * rowsPerPage
                    )
                    .map((member, index) => (
                      <TableRow
                        key={member.id}
                        onClick={(e) => {
                          if (!isScrolling.current) {
                            handleRowClick(member.id, member.role_id);
                          }
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <TableCell>
                          {(currentPage - 1) * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
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
                        {role === "Admin" && (
                          <TableCell>
                            <div style={{ display: "flex" }}>
                              <IconButton
                                color="secondary"
                                onClick={(event) => {
                                  event.stopPropagation();
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
                                onClick={(event) => {
                                  event.stopPropagation();
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
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <div style={{ marginTop: "10px" }}>
            {renderPagination(
              currentPage,
              setCurrentPage,
              sortedMembersList.length
            )}
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

export default MemberDetailTable;
