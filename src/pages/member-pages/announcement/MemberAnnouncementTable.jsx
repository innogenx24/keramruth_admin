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

const AnnouncementTable = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [page, setPage] = useState(0); // Current page number
  const [rowsPerPage] = useState(10); // Rows per page
  const navigate = useNavigate();

  const imageBaseURL = "http://88.222.245.236:3002/uploads/";

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");
      const response = await axios.get("http://88.222.245.236:3002/announcements", {
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0 }}>All Announcements</h2>
          
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Announcement Image</TableCell>
              <TableCell>Announcement Heading</TableCell>
              <TableCell style={{ maxWidth: 300, wordWrap: "break-word" }}>Description</TableCell>
              <TableCell style={{ maxWidth: 200, wordWrap: "break-word" }}>Applying on</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAnnouncements.map((announcement, index) => (
              <TableRow key={announcement.id}>
                <TableCell>{startIndex + index + 1}</TableCell>
                <TableCell style={{ width: 100, textAlign: "center" }}>
                  {announcement.image ? (
                    <img
                      src={getImageURL(announcement.image)}
                      alt="Announcement"
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
                  {announcement.receiver.join(", ")}
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
