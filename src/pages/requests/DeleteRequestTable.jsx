import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import { fetchAllMembersRequest } from "../../redux/slices/member-slice/GetAllmemberSlices";

const DeleteRequestTable = () => {
  const dispatch = useDispatch();
  const { allmembers = {}, loading, error } = useSelector((state) => state.allmembers); // Default to an empty object

  useEffect(() => {
    dispatch(fetchAllMembersRequest());
  }, [dispatch]);

  const handleApprove = (userId) => {
    console.log("Approve request for User ID:", userId);
    setSnackbarOpen(true);
  };

  const handleReject = (requestId) => {
    console.log("Reject request for Request ID:", requestId);
    setSnackbarOpen(true);
  };

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Combine all members into one array
  const combinedMembers = [
    ...(allmembers.ADOs || []),
    ...(allmembers.MDs || []),
    ...(allmembers.SDs || []),
    ...(allmembers.Ds || []),
    ...(allmembers.Cs || []),

  ];

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Club</TableCell>
              <TableCell>MD</TableCell>
              <TableCell>SD</TableCell>
              <TableCell>Distributor</TableCell>
              <TableCell>Customers</TableCell>
              <TableCell>Date Of Joining</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Delete Reason</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && combinedMembers.length > 0 ? (
              combinedMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.id}</TableCell>
                  <TableCell>{member.full_name}</TableCell>
                  <TableCell>{member.role_name}</TableCell>
                  <TableCell>{member.club || "-"}</TableCell>
                  <TableCell>{member.superior_md || "-"}</TableCell>
                  <TableCell>{member.superior_sd || "-"}</TableCell>
                  <TableCell>{member.superior_d || "-"}</TableCell>
                  <TableCell>{member.superior_d || "-"}</TableCell>

                  <TableCell>{new Date(member.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{member.mobile_number}</TableCell>
                  <TableCell>{member.delete_reason || "N/A"}</TableCell>
                  <TableCell>
                  <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
              <IconButton
                style={{ color: "red" }}
                onClick={() => handleReject(member.id)}
              >
                <ClearIcon />
              </IconButton>
              <IconButton
                style={{ color: "green" }}
                onClick={() => handleApprove(member.id)}
              >
                <CheckIcon />
              </IconButton>
            </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} align="center">
                  {loading ? "Loading..." : error ? `Error: ${error}` : "No members available."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar for success message */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: "100%" }}>
          Update successful!
        </Alert>
      </Snackbar>
    </>
  );
};

export default DeleteRequestTable;
