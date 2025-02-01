import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  Typography,
  IconButton,
  Avatar,
  TextField,
  Box,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { API_END_POINT_IMG } from "../../constants/ApiConstant";

const MemberTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const imageBaseURL = `${API_END_POINT_IMG}/uploads/`;
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  const [deleteRequests, setDeleteRequests] = useState([]);
  const [pendingFilteredRequests, setPendingFilteredRequests] = useState([]); // Separate state for pending requests filter
  const [deletedFilteredRequests, setDeletedFilteredRequests] = useState([]); // Separate state for deleted/rejected requests filter
  const [pendingSearchQuery, setPendingSearchQuery] = useState(""); // For Pending Search
  const [deletedSearchQuery, setDeletedSearchQuery] = useState(""); // For Deleted/Rejected Search
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchDeleteRequests();
  }, []);

  const fetchDeleteRequests = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_END_POINT}/delete_request/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch delete requests");
      }

      const data = await response.json();
      setDeleteRequests(data.deleteRequests);
      setPendingFilteredRequests(
        data.deleteRequests.filter((request) => request.status === "Pending")
      );
      setDeletedFilteredRequests(
        data.deleteRequests.filter(
          (request) =>
            request.status === "Rejected" || request.status === "Deleted"
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await fetch(
        `${API_END_POINT}/delete_request/${id}/deleted`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        setSuccessMessage("Request Approved");
        setSnackbarOpen(true);
        fetchDeleteRequests();
      } else {
        throw new Error("Failed to approve request");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch(
        `${API_END_POINT}/delete_request/${id}/rejected`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        setSuccessMessage("Request Rejected");
        setSnackbarOpen(true);
        fetchDeleteRequests();
      } else {
        throw new Error("Failed to reject request");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Pending Search for Member Name
  const handlePendingSearchChange = (e) => {
    setPendingSearchQuery(e.target.value);
    const filteredData = deleteRequests.filter(
      (request) =>
        request.member_name
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) &&
        request.status === "Pending"
    );
    setPendingFilteredRequests(filteredData);
  };

  // Deleted/Rejected Search for Full Name
  const handleDeletedSearchChange = (e) => {
    setDeletedSearchQuery(e.target.value);
    const filteredData = deleteRequests.filter(
      (request) =>
        request.full_name
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) &&
        (request.status === "Rejected" || request.status === "Deleted")
    );
    setDeletedFilteredRequests(filteredData);
  };

  let currentIndex = 0;
  let completedIndex = 0;

  return (
    <>
      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        Pending Details
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
        <TextField
          label="Search by Member Name"
          variant="outlined"
          value={pendingSearchQuery}
          onChange={handlePendingSearchChange}
          sx={{
            borderRadius: "20px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
            },
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#DCDCDC" }}>
            <TableRow style={{ whiteSpace: "nowrap" }}>
              <TableCell>No.</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Member Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Date Of Joining</TableCell>
              <TableCell>Mobile No</TableCell>
              <TableCell>Request Reason</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingFilteredRequests.map((request) => {
              currentIndex++;
              return (
                <TableRow key={request.id}>
                  <TableCell>{currentIndex}</TableCell>
                  <TableCell>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={
                          request?.image
                            ? `${imageBaseURL}${request.image}`
                            : "/path/to/default-image.jpg"
                        }
                      />
                      <Typography style={{ marginLeft: "10px" }}>
                        {request?.username}
                      </Typography>
                    </div>
                  </TableCell>
                  <TableCell>{request.member_name}</TableCell>
                  <TableCell>{request.role}</TableCell>
                  <TableCell>
                    {new Date(request.date_of_joining).toLocaleDateString(
                      "en-IN"
                    )}
                  </TableCell>
                  <TableCell>{request.mobile_number}</TableCell>
                  <TableCell>{request.request_reason}</TableCell>
                  <TableCell>
                    <div style={{ display: "flex", gap: "5px" }}>
                      <IconButton
                        style={{
                          width: "45px",
                          height: "40px",
                          backgroundColor: "red",
                          color: "white",
                          borderRadius: "6px",
                        }}
                        onClick={() => handleReject(request.id)}
                      >
                        <ClearIcon />
                      </IconButton>
                      <IconButton
                        style={{
                          width: "45px",
                          height: "40px",
                          backgroundColor: "green",
                          color: "white",
                          borderRadius: "6px",
                        }}
                        onClick={() => handleApprove(request.id)}
                      >
                        <DoneIcon />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ marginBottom: "40px" }} />

      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        Deleted / Rejected Data
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
        <TextField
          label="Search by Full Name"
          variant="outlined"
          value={deletedSearchQuery}
          onChange={handleDeletedSearchChange}
          sx={{
            borderRadius: "20px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
            },
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#DCDCDC" }}>
            <TableRow style={{ whiteSpace: "nowrap" }}>
              <TableCell>No.</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Request Reason</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deletedFilteredRequests.map((request) => {
              completedIndex++;
              return (
                <TableRow key={request.id}>
                  <TableCell>{completedIndex}</TableCell>
                  <TableCell>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={
                          request?.image
                            ? `${imageBaseURL}${request.image}`
                            : "/path/to/default-image.jpg"
                        }
                      />
                      <Typography style={{ marginLeft: "10px" }}>
                        {request?.username}
                      </Typography>
                    </div>
                  </TableCell>
                  <TableCell>{request.full_name}</TableCell>
                  <TableCell>{request.role}</TableCell>
                  <TableCell>{request.request_reason}</TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        color:
                          request.status === "Deleted"
                            ? "green"
                            : request.status === "Rejected"
                            ? "red"
                            : "black",
                      }}
                    >
                      {request.status}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MemberTable;
