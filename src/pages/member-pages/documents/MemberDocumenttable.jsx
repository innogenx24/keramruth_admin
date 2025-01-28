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
import { API_END_POINT_IMG } from "../../../constants/ApiConstant";

const rowsPerPage = 10; // Number of rows per page

const MemberDocumenttable = () => {
  const [documents, setDocuments] = useState([]);
  const [page, setPage] = useState(0); // Pagination state
  const navigate = useNavigate();
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  const imageBaseURL = `${API_END_POINT_IMG}/uploads/`;

  // Fetching documents and sorting them by ID in descending order
  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      if (!token) throw new Error("Token not found");

      const response = await axios.get(`${API_END_POINT}/documents`, {
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
      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        Documents
      </Typography>

      <TableContainer component={Paper} style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>

        <Table>
          <TableHead sx={{ backgroundColor: "#DCDCDC" }}>
            <TableRow style={{ whiteSpace: 'nowrap' }}>
              <TableCell>No.</TableCell>
              <TableCell>Document Image</TableCell>
              <TableCell>Heading</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Download Link</TableCell>
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
                        width: "80px",
                        height: "auto",
                        objectFit: "contain",
                        border: "1px solid #ccc",
                        boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
                        borderRadius: "10px",
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
                <TableCell style={{ maxWidth: 200, wordWrap: "break-word" }}>
                  <a href={document.link} target="_blank" rel="noopener noreferrer"
                    style={{ color: '#1c96c5', textDecoration: 'none' }}
                  >
                    {document.link}
                  </a>
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
