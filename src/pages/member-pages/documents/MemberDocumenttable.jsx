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
import { FaFilePdf, FaFileArchive, FaFileExcel } from "react-icons/fa";

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

  const handleDownload = (image) => {
    const fileURL = `${API_END_POINT_IMG}/uploads/${image}`;
    const link = document.createElement("a");
    link.href = fileURL;
    link.setAttribute("download", image);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        Documents
      </Typography>

      <TableContainer
        component={Paper}
        style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}
      >
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
            {documents.length > 0 ? (
              documents
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((document, index) => (
                  <TableRow key={document.id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell style={{ width: 100, textAlign: "center" }}>
                      {document.image ? (
                        document.image.endsWith(".pdf") ? (
                          <FaFilePdf size={40} color="red" />
                        ) : document.image.endsWith(".zip") ? (
                          <FaFileArchive size={40} color="blue" />
                        ) : document.image.endsWith(".xlsx") ||
                          document.image.endsWith(".csv") ? (
                          <FaFileExcel size={40} color="green" />
                        ) : (
                          <img
                            src={`${imageBaseURL}${document.image}`}
                            style={{
                              width: "80px",
                              height: "auto",
                              objectFit: "contain",
                              border: "1px solid #ccc",
                              boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
                              borderRadius: "10px",
                              marginRight: "10px",
                            }}
                          />
                        )
                      ) : (
                        <span style={{ color: "#999" }}>
                          No Image Available
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{document.heading}</TableCell>
                    <TableCell
                      sx={{
                        wordBreak: "break-word",
                        whiteSpace: "normal",
                        overflow: "visible",
                        maxWidth: "none",
                        minWidth: "250px",
                      }}
                    >
                      {document.description}
                    </TableCell>
                    <TableCell>
                      <a
                        href={document.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#1c96c5" }}
                      >
                        {document.link}
                      </a>
                    </TableCell>
                    <TableCell>
                      {document.image ? (
                        <a
                          href={`${API_END_POINT_IMG}/uploads/${document.image}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          style={{ textDecoration: "none" }}
                        >
                          <Button
                            variant="contained"
                            style={{
                              backgroundColor: "#28a745",
                              color: "white",
                              fontWeight: "bold",
                              borderRadius: "5px",
                            }}
                          >
                            Download
                          </Button>
                        </a>
                      ) : (
                        <span style={{ color: "#999" }}>No File</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  style={{ textAlign: "center", color: "#999" }}
                >
                  No Document Data Available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MemberDocumenttable;
