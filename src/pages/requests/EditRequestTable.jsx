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
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllMembersRequest } from "../../redux/slices/member-slice/GetAllmemberSlices";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import IconButton from "@mui/material/IconButton";

const MemberTable = () => {
  const dispatch = useDispatch();
  const { allmembers, loading, error } = useSelector((state) => state.allmembers);
  const [editRequests, setEditRequests] = useState([]);
  const [loadingEditRequests, setLoadingEditRequests] = useState(true);
  const [editRequestError, setEditRequestError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar open state

  useEffect(() => {
    dispatch(fetchAllMembersRequest());
    fetchEditRequests();
  }, [dispatch]);

  const fetchEditRequests = async () => {
    try {
      const response = await fetch("http://88.222.245.236:3002/edit-requests");
      const data = await response.json();

      if (data.success) {
        const mostRecentRequests = data.data.reduce((acc, request) => {
          const existingRequest = acc[request.user_id];
          if (!existingRequest || new Date(request.updated_at) > new Date(existingRequest.updated_at)) {
            acc[request.user_id] = request;
          }
          return acc;
        }, {});

        const sortedRequests = Object.values(mostRecentRequests).sort((a, b) => {
          return new Date(b.updated_at) - new Date(a.updated_at);
        });

        setEditRequests(sortedRequests);
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
    const requestToApprove = editRequests.find((request) => request.user_id === memberId);

    if (!requestToApprove) {
      console.error("Request not found:", memberId);
      return;
    }

    const updatedData = {
      mobile_number: requestToApprove.new_mobile_number,
      email: requestToApprove.new_email_id,
      state: requestToApprove.new_address.state,
      city: requestToApprove.new_address.city,
      street_name: requestToApprove.new_address.street,
      pincode: requestToApprove.new_address.zip,
    };

    try {
      const response = await fetch(`http://88.222.245.236:3002/api/member-update/update/${memberId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

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
      const response = await fetch(`http://88.222.245.236:3002/edit-requests/reject/${requestId}`, {
        method: "POST",
      });
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

  // Function to close the snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading || loadingEditRequests) return <CircularProgress />;
  if (error) return <div>Error: {error}</div>;
  if (editRequestError) return <div>Error fetching edit requests: {editRequestError}</div>;

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Date Of Joining</TableCell>
              <TableCell>Mobile No</TableCell>
              <TableCell>New Mobile Number</TableCell>
              <TableCell>New Email ID</TableCell>
              <TableCell>New Address</TableCell>
              <TableCell>Request Reason</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {editRequests.map((request) => {
              const member = combinedMembers.find((member) => member.id === request.user_id);

              // Check if the existing and new data are the same
              const isMobileSame = member?.mobile_number === request.new_mobile_number;
              const isEmailSame = member?.email === request.new_email_id;
              const isAddressSame =
                member?.street_name === request.new_address.street &&
                member?.city === request.new_address.city &&
                member?.state === request.new_address.state &&
                member?.pincode === request.new_address.zip;

              // Only display the row if any of the mobile number, email, or address fields differ
              if (member && (!isMobileSame || !isEmailSame || !isAddressSame)) {
                return (
                  <TableRow key={request.id}>
                    <TableCell>{request.user_id}</TableCell>
                    <TableCell>{member.full_name}</TableCell>
                    <TableCell>{member.role_name}</TableCell>
                    <TableCell>{new Date(member.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{member.mobile_number}</TableCell>
                    <TableCell>{isMobileSame ? "-" : request.new_mobile_number}</TableCell>
                    <TableCell>{isEmailSame ? "-" : request.new_email_id}</TableCell>
                    <TableCell>{`${request.new_address.street}, ${request.new_address.city}, ${request.new_address.state}, ${request.new_address.zip}`}</TableCell>
                    <TableCell>{request.request_reason}</TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                        <IconButton style={{ color: "red" }} onClick={() => handleReject(request.id)}>
                          <ClearIcon />
                        </IconButton>
                        <IconButton style={{ color: "green" }} onClick={() => handleApprove(request.user_id)}>
                          <CheckIcon />
                        </IconButton>
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

      {/* Snackbar for success message */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MemberTable;
