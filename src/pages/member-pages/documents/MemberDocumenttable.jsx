import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const rowsPerPage = 10; // Number of rows per page

const MemberDocumenttable = () => {
  const [documents, setDocuments] = useState([]);
  const [page, setPage] = useState(0); // Pagination state
  const navigate = useNavigate();

  const imageBaseURL = "http://88.222.245.236:3002/uploads/";

  // Fetching documents and sorting them by ID in descending order
  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      if (!token) throw new Error("Token not found");

      const response = await axios.get("http://88.222.245.236:3002/documents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Sort documents by ID in descending order
      const sortedDocuments = response.data.data.sort((a, b) => b.id - a.id);
      setDocuments(sortedDocuments);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleAddClick = () => {
    navigate("add-document");
  };

  const renderPagination = () => (
    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "15px", padding: "15px" }}>
      <Button
        onClick={() => setPage((prev) => prev - 1)}
        disabled={page === 0}
        variant="outlined"
      >
        Previous
      </Button>
      <Typography variant="body1" style={{ minWidth: "60px", textAlign: "center" }}>
        Page {page + 1}
      </Typography>
      <Button
        onClick={() => setPage((prev) => prev + 1)}
        disabled={page >= Math.ceil(documents.length / rowsPerPage) - 1}
        variant="outlined"
      >
        Next
      </Button>
    </div>
  );

  // Calculate the documents to display on the current page
  const displayedDocuments = documents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div style={{ padding: "20px" }}>
      <TableContainer component={Paper} style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "15px",
            borderBottom: "1px solid #ddd",
          }}
        >
          <h2 style={{ margin: 0 }}>All Documents</h2>
          {/* <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            style={{
              backgroundColor: "#28a745",
              color: "white",
              fontWeight: "bold",
              borderRadius: "5px",
            }}
          >
            CREATE DOCUMENT
          </Button> */}
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Document Image</TableCell>
              <TableCell>Heading</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Applying On</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedDocuments.map((document, index) => (
              <TableRow key={document.id}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell style={{ width: 100, textAlign: "center" }}>
                  {document.image ? (
                    <img
                      src={`${imageBaseURL}${document.image}`}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <span style={{ color: "#999" }}>No Image Available</span>
                  )}
                </TableCell>
                <TableCell>{document.heading}</TableCell>
                <TableCell
                  sx={{
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                    wordBreak: 'break-word',
                  }}
                >
                  {document.description}
                </TableCell>
                <TableCell>
                  {Array.isArray(document.receiver)
                    ? document.receiver.join(", ")
                    : document.receiver && typeof document.receiver === 'string' && document.receiver.startsWith('[')
                    ? JSON.parse(document.receiver).join(", ")
                    : document.receiver}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ padding: "0px" }}>
        {renderPagination()}
      </div>
    </div>
  );
};

export default MemberDocumenttable;
