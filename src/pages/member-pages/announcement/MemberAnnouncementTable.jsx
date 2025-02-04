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
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_END_POINT_IMG } from "../../../constants/ApiConstant";

const AnnouncementTable = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [page, setPage] = useState(0); // Current page number
  const [rowsPerPage] = useState(10); // Rows per page
  const navigate = useNavigate();
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  const imageBaseURL = `${API_END_POINT_IMG}/uploads/`;

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");
      const response = await axios.get(`${API_END_POINT}/announcements`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Sort announcements by ID in descending order
      const sortedAnnouncements = response.data.data.sort((a, b) => b.id - a.id);
      setAnnouncements(sortedAnnouncements);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);



  const getImageURL = (imagePath) => {
    if (!imagePath) return "";
    const imageName = imagePath.includes("\\") ? imagePath.split("\\").pop() : imagePath;
    return `${imageBaseURL}${imageName}`;
  };

  // Pagination logic
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedAnnouncements = announcements.slice(startIndex, endIndex);

  const renderPagination = (page, setPage, totalRows) => (
    <div style={{ display: "flex", justifyContent: "right", alignItems: "center", gap: "15px" }}>
      <Button
        onClick={() => setPage(page - 1)}
        disabled={page === 0}
        variant="outlined"
      >
        Previous
      </Button>
      <Typography variant="body1" style={{ minWidth: "60px", textAlign: "center" }}>
        Page {page + 1}
      </Typography>
      <Button
        onClick={() => setPage(page + 1)}
        disabled={page >= Math.ceil(totalRows / rowsPerPage) - 1}
        variant="outlined"
      >
        Next
      </Button>
    </div>
  );

  return (
    <div>
      <TableContainer component={Paper}>
        <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
          Announcements
        </Typography>

        <Table>
          <TableHead sx={{ backgroundColor: "#DCDCDC" }}>
            <TableRow style={{ whiteSpace: 'nowrap' }}>
              <TableCell>No.</TableCell>
              <TableCell>Announcement Image</TableCell>
              <TableCell>Announcement Heading</TableCell>
              <TableCell style={{ maxWidth: 300, wordWrap: "break-word" }}>Description</TableCell>
              <TableCell style={{ maxWidth: 200, wordWrap: "break-word" }}>Announcement Link</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAnnouncements.map((announcement, index) => (
              <TableRow key={announcement.id}>
                <TableCell>{startIndex + index + 1}</TableCell>
                <TableCell style={{ width: 100, textAlign: "center" }}>
                  {announcement.file ? (
                    <img
                      src={getImageURL(announcement.file)}
                      alt="Announcement"
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
                <TableCell>{announcement.heading}</TableCell>
                <TableCell
                  sx={{
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 4,
                    wordBreak: 'break-word',
                    maxWidth: '250px'
                  }}
                >
                  {announcement.description}
                </TableCell>
                <TableCell style={{ maxWidth: 200, wordWrap: "break-word" }}>
                  <a href={announcement.link} target="_blank" rel="noopener noreferrer"
                    style={{ color: '#1c96c5', textDecoration: 'none' }}
                  >
                    {announcement.link}
                  </a>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ marginTop: "10px" }}>
        {renderPagination(page, setPage, announcements.length)}
      </div>
    </div>
  );
};

export default AnnouncementTable;
