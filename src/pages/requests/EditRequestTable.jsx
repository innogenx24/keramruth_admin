import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  Modal,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllMembersRequest } from "../../redux/slices/member-slice/GetAllmemberSlices";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import DoneIcon from "@mui/icons-material/Done";
import { API_END_POINT_IMG } from "../../constants/ApiConstant";

const MemberTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allmembers, loading, error } = useSelector(
    (state) => state.allmembers
  );
  const [editRequests, setEditRequests] = useState([]);
  const [loadingEditRequests, setLoadingEditRequests] = useState(true);
  const [editRequestError, setEditRequestError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [imageModal, setImageModal] = useState({ open: false, imageUrl: "" });
  const [sortedEditRequests, setSortedEditRequests] = useState([]);
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  const [currentPageCurrent, setCurrentPageCurrent] = useState(0);
  const [currentPageCompleted, setCurrentPageCompleted] = useState(0);
  const rowsPerPage = 10;

  const imageBaseURL = `${API_END_POINT_IMG}/uploads/`;

  const user = JSON.parse(localStorage.getItem("user")); 
  const role = user?.role;
  const roleId = role === "Admin"? 1 : 2;

  // Filter edit requests based on role
  const filterEditRequests = (requests) => {
    if (role === "Area Development Officer") {
      return requests.filter(request => request.role_id !== 2);
    }
    return requests;
  };

  // Sort data by updated_at in descending order (initial sort)
  useEffect(() => {
    const sortedRequests = [...editRequests].sort(
      (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
    );
    setSortedEditRequests(sortedRequests);
  }, [editRequests]);

  useEffect(() => {
    dispatch(fetchAllMembersRequest());
    fetchEditRequests();
  }, [dispatch]);

  const fetchEditRequests = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_END_POINT}/edit-requests`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        const mostRecentRequests = data.data.reduce((acc, request) => {
          const existingRequest = acc[request.user_id];
          if (
            !existingRequest ||
            new Date(request.updated_at) > new Date(existingRequest.updated_at)
          ) {
            acc[request.user_id] = request;
          }
          return acc;
        }, {});

        const sortedRequests = Object.values(mostRecentRequests).sort(
          (a, b) => {
            return new Date(b.updated_at) - new Date(a.updated_at);
          }
        );

        // Apply role-based filtering
        const filteredRequests = filterEditRequests(sortedRequests);
        setEditRequests(filteredRequests);
      } else {
        throw new Error("Failed to fetch edit requests");
      }
    } catch (error) {
      setEditRequestError(error.message);
    } finally {
      setLoadingEditRequests(false);
    }
  };

  const combinedMembers = [
    ...(allmembers.ADOs || []),
    ...(allmembers.MDs || []),
    ...(allmembers.SDs || []),
    ...(allmembers.Ds || []),
  ];

  const handleApprove = async (memberId) => {
    const requestToApprove = editRequests.find(
      (request) => request.user_id === memberId
    );

    if (!requestToApprove) {
      console.error("Request not found:", memberId);
      return;
    }
    const oldData = combinedMembers.find((member) => member.id === memberId);

    const updatedData = {
      roleName: role,
      mobile_number: requestToApprove.new_mobile_number || oldData?.mobile_number,
      email: requestToApprove.new_email_id || oldData?.email,
      state: requestToApprove.new_address.state || oldData?.state,
      city: requestToApprove.new_address.district || oldData?.city,
      street_name: requestToApprove.new_address.street || oldData?.street_name,
      pincode: requestToApprove.new_address.zip || oldData?.pincode,
    };

    try {
      const response = await fetch(
        `${API_END_POINT}/member-update/update/${memberId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (data.success) {
          setSuccessMessage("Update successful!");
          setSnackbarOpen(true);
          fetchEditRequests();
        } else {
          console.error("Failed to approve request:", data.message);
        }
      } else {
        console.error("Failed to approve request:", data.message);
      }
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      const response = await fetch(
        `${API_END_POINT}/edit-requests/reject/${requestId}/${roleId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (data.success) {
        fetchEditRequests();
      } else {
        console.error("Failed to reject request:", data.message);
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  const handleImageClick = (imageUrl) => {
    setImageModal({ open: true, imageUrl });
  };

  const handleImageModalClose = () => {
    setImageModal({ open: false, imageUrl: "" });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading || loadingEditRequests) return <CircularProgress />;
  if (error) return <div>Error: {error}</div>;
  if (editRequestError)
    return <div>Error fetching edit requests: {editRequestError}</div>;

  let currentIndex = 0;
  let completedIndex = 0;

  const pendingRequests = editRequests.filter(
    (req) => req.status === "Pending"
  );
  const completedRequests = editRequests.filter(
    (req) => req.status !== "Pending"
  );

  const paginatedPending = pendingRequests.slice(
    currentPageCurrent * rowsPerPage,
    (currentPageCurrent + 1) * rowsPerPage
  );

  const paginatedCompleted = completedRequests.slice(
    currentPageCompleted * rowsPerPage,
    (currentPageCompleted + 1) * rowsPerPage
  );

  return (
    <>
      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        Current Details
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#DCDCDC" }}>
            <TableRow style={{ whiteSpace: "nowrap" }}>
              <TableCell>No.</TableCell>
              <TableCell>ID Proof</TableCell>
              <TableCell>Member Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Mobile No</TableCell>
              <TableCell>New Mobile Number</TableCell>
              <TableCell>New Email ID</TableCell>
              <TableCell>New Address</TableCell>
              <TableCell>Request Reason</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPending.map((request, index) => {
              if (request.status !== "Pending") return null;

              const member = combinedMembers.find(
                (member) => member.id === request.user_id
              );

              if (!member || member.approved === "Pending") return null;

              const isMobileSame =
                member?.mobile_number === request.new_mobile_number;
              const isEmailSame = member?.email === request.new_email_id;
              const isAddressSame =
                member?.street_name === request.new_address.street &&
                member?.city === request.new_address.city &&
                member?.state === request.new_address.state &&
                member?.pincode === request.new_address.zip;

              if (!isMobileSame || !isEmailSame || !isAddressSame) {
                currentIndex++;
                return (
                  <TableRow key={request.id}>
                    <TableCell>
                      {currentPageCurrent * rowsPerPage + index + 1}
                    </TableCell>

                    <TableCell>
                      {request.image ? (
                        <img
                          src={`${imageBaseURL}${request.image}`}
                          style={{ width: 50, height: 50, cursor: "pointer" }}
                          onClick={() =>
                            handleImageClick(`${imageBaseURL}${request.image}`)
                          }
                        />
                      ) : (
                        "No Image"
                      )}
                    </TableCell>
                    <TableCell>{member.full_name}</TableCell>
                    <TableCell>{member.role_name}</TableCell>
                    <TableCell>{member.mobile_number}</TableCell>
                    <TableCell>
                      {isMobileSame ? "-" : request.new_mobile_number}
                    </TableCell>
                    <TableCell
                      sx={{
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                        wordBreak: "break-word",
                      }}
                    >
                      {isEmailSame ? "-" : request.new_email_id}
                    </TableCell>
                    <TableCell>{`${request.new_address.street}, ${request.new_address.district}, ${request.new_address.state}, ${request.new_address.zip}`}</TableCell>
                    <TableCell>{request.request_reason}</TableCell>
                    <TableCell>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ display: "flex", gap: "5px" }}>
                          <IconButton
                            style={{
                              width: "45px",
                              height: "40px",
                              backgroundColor: "red",
                              color: "white",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
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
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              borderRadius: "6px",
                            }}
                            onClick={() => handleApprove(member.id)}
                          >
                            <DoneIcon />
                          </IconButton>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              }
              return null;
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "10px 0",
        }}
      >
        <Button
          onClick={() => setCurrentPageCurrent((prev) => Math.max(prev - 1, 0))}
          disabled={currentPageCurrent === 0}
        >
          Previous
        </Button>
        <Typography sx={{ margin: "0 15px" }}>
          Page {currentPageCurrent + 1}
        </Typography>
        <Button
          onClick={() =>
            setCurrentPageCurrent((prev) =>
              prev < Math.ceil(pendingRequests.length / rowsPerPage) - 1
                ? prev + 1
                : prev
            )
          }
          disabled={
            currentPageCurrent >=
            Math.ceil(pendingRequests.length / rowsPerPage) - 1
          }
        >
          Next
        </Button>
      </div>

      <div style={{ margin: "20px 0" }} />

      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        Accepted / Rejected Data
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#DCDCDC" }}>
            <TableRow style={{ whiteSpace: "nowrap" }}>
              <TableCell>No.</TableCell>
              <TableCell>ID Proof</TableCell>
              <TableCell>Member Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Mobile Number</TableCell>
              <TableCell>Email ID</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Request Reason</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCompleted.map((request, index) => {
              const member = combinedMembers.find(
                (member) => member.id === request.user_id
              );
              if (!member) return null;

              if (request.status === "Completed" || request.status === "Rejected") {
                completedIndex++;
                return (
                  <TableRow key={request.id}>
                    <TableCell>
                      {currentPageCompleted * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell>
                      {request.image ? (
                        <img
                          src={`${imageBaseURL}${request.image}`}
                          style={{ width: 50, height: 50, cursor: "pointer" }}
                          onClick={() =>
                            handleImageClick(`${imageBaseURL}${request.image}`)
                          }
                        />
                      ) : (
                        "No Image"
                      )}
                    </TableCell>
                    <TableCell>{member.full_name}</TableCell>
                    <TableCell>{member.role_name}</TableCell>
                    <TableCell>{request.new_mobile_number}</TableCell>
                    <TableCell
                      sx={{
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                        wordBreak: "break-word",
                      }}
                    >
                      {request.new_email_id}
                    </TableCell>
                    <TableCell>{`${request.new_address.street}, ${request.new_address.city}, ${request.new_address.state}, ${request.new_address.zip}`}</TableCell>
                    <TableCell>{request.request_reason}</TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          color:
                            request.status === "Completed"
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
              }
              return null;
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "10px 0",
        }}
      >
        <Button
          onClick={() =>
            setCurrentPageCompleted((prev) => Math.max(prev - 1, 0))
          }
          disabled={currentPageCompleted === 0}
        >
          Previous
        </Button>
        <Typography sx={{ margin: "0 15px" }}>
          Page {currentPageCompleted + 1}
        </Typography>
        <Button
          onClick={() =>
            setCurrentPageCompleted((prev) =>
              prev < Math.ceil(completedRequests.length / rowsPerPage) - 1
                ? prev + 1
                : prev
            )
          }
          disabled={
            currentPageCompleted >=
            Math.ceil(completedRequests.length / rowsPerPage) - 1
          }
        >
          Next
        </Button>
      </div>

      <Modal open={imageModal.open} onClose={handleImageModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Full Image
          </Typography>
          <img
            src={imageModal.imageUrl}
            alt="Full size"
            style={{ width: "100%", maxHeight: "400px" }}
          />
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
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