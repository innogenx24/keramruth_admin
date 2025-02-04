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
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_END_POINT_IMG } from "../../../constants/ApiConstant";

const rowsPerPage = 10;

const MemberDocumenttable = () => {
  const [documents, setDocuments] = useState([]);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;
  const imageBaseURL = `${API_END_POINT_IMG}/uploads/`;

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");

      const response = await axios.get(`${API_END_POINT}/documents`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const sortedDocuments = response.data.data.sort((a, b) => b.id - a.id);
      setDocuments(sortedDocuments);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDownload = (file) => {
    const fileURL = `${API_END_POINT_IMG}/uploads/${file}`;
    const link = document.createElement("a");
    link.href = fileURL;
    link.setAttribute("download", file);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        Documents
      </Typography>

      <TableContainer component={Paper} style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#DCDCDC" }}>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Document Image</TableCell>
              <TableCell>Heading</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Download Link</TableCell>
              <TableCell>Download File</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((document, index) => (
              <TableRow key={document.id}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>
                  {document.file ? (
                    <img
                      src={`${imageBaseURL}${document.file}`}
                      alt="Document"
                      style={{ width: "80px", height: "auto", borderRadius: "10px" }}
                    />
                  ) : (
                    <span style={{ color: "#999" }}>No Image Available</span>
                  )}
                </TableCell>
                <TableCell>{document.heading}</TableCell>
                <TableCell>{document.description}</TableCell>
                <TableCell>
                  <a href={document.link} target="_blank" rel="noopener noreferrer" style={{ color: "#1c96c5" }}>
                    {document.link}
                  </a>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    href={`${API_END_POINT_IMG}/uploads/${document.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    Download
                  </Button>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MemberDocumenttable;