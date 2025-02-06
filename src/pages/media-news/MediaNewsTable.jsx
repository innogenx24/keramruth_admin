import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
    IconButton,
    Button,
    Box,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
} from "@mui/material";
import { Delete, Edit, Add as AddIcon } from "@mui/icons-material";

import DeleteButton from "../../assets/actions/DeleteButton.svg";
import EditButton from "../../assets/actions/EditButton.svg";
import { useNavigate } from "react-router-dom";
import { API_END_POINT_IMG } from "../../constants/ApiConstant";
import axios from "axios";

const MediaNewsTable = () => {
    const navigate = useNavigate();
    const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;
    const imageBaseURL = `${API_END_POINT_IMG}/uploads/`;

    const [mediaNews, setMediaNews] = useState([]);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);
    const [page, setPage] = useState(0);
    const rowsPerPage = 10;
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role;
    const fetchMediaNews = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Token not found");
            const response = await axios.get(`${API_END_POINT}/media-news`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const sortedMediaNews = response.data.data.sort((a, b) => b.id - a.id);
            setMediaNews(sortedMediaNews);
        } catch (error) {
            console.error("Error fetching media news:", error);
        }
    };

    useEffect(() => {
        fetchMediaNews();
    }, []);

    const handleDeleteClick = (news) => {
        setSelectedNews(news);
        setOpenDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedNews) {
            try {
                const token = localStorage.getItem("token");
                await axios.delete(`${API_END_POINT}/media-news/${selectedNews.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setMediaNews((prev) => prev.filter((item) => item.id !== selectedNews.id));
                setSelectedNews(null);
                setOpenDeleteModal(false);
            } catch (error) {
                console.error("Error deleting news:", error);
            }
        }
    };

    const handleCancelDelete = () => {
        setOpenDeleteModal(false);
        setSelectedNews(null);
    };

    const handleEditClick = (news) => {
        navigate("edit-media-news", { state: { news } });
    };

    const handleAddMediaNewsClick = () => {
        navigate("add-media-news");
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const renderPagination = () => (
        <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "15px", padding: "15px" }}>
            <Button onClick={() => handlePageChange(page - 1)} disabled={page === 0} variant="outlined">
                Previous
            </Button>
            <Typography variant="body1" sx={{ minWidth: "60px", textAlign: "center" }}>
                Page {page + 1}
            </Typography>
            <Button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= Math.ceil(mediaNews.length / rowsPerPage) - 1}
                variant="outlined"
            >
                Next
            </Button>
        </Box>
    );

    return (
        <div>
            <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
                Media / News
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddMediaNewsClick}
                    style={{
                        backgroundColor: "#28a745",
                        color: "white",
                        fontWeight: "bold",
                        borderRadius: "5px",
                    }}
                >
                    Add Media / News
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ backgroundColor: "#DCDCDC" }}>
                        <TableRow style={{ whiteSpace: 'nowrap' }}>
                            <TableCell>No.</TableCell>
                            <TableCell>Media / News Heading</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Event Date</TableCell>
                            <TableCell>Media / News Link</TableCell>
                            {role === "Admin" && <TableCell>Action</TableCell>}
                            {role !== "Admin" && <TableCell>Download File</TableCell>}

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mediaNews
                            .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                            .map((news, index) => (
                                <TableRow key={news.id}>
                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell>{news.heading}</TableCell>
                                    <TableCell>{news.description}</TableCell>
                                    <TableCell>
                                        {new Date(news.event_date).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        })}
                                    </TableCell>
                                    <TableCell style={{ maxWidth: 200, wordWrap: "break-word" }}>
                                        <a
                                            href={news.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: "#1c96c5", textDecoration: "none" }}
                                        >
                                            {news.link}
                                        </a>
                                    </TableCell>

                                    {role === "Admin" && (
                                        <TableCell>
                                            <div style={{ display: "flex" }}>
                                                <IconButton
                                                    onClick={() => handleDeleteClick(news)}
                                                    sx={{ marginRight: "5px" }}
                                                >
                                                    <img
                                                        src={DeleteButton}
                                                        alt="Delete"
                                                        style={{
                                                            width: "30px",
                                                            height: "30px",
                                                            objectFit: "contain",
                                                            transform: "scale(1.5)",
                                                        }}
                                                    />
                                                </IconButton>
                                                <IconButton onClick={() => handleEditClick(news)}>
                                                    <img
                                                        src={EditButton}
                                                        alt="Edit"
                                                        style={{
                                                            width: "30px",
                                                            height: "30px",
                                                            objectFit: "contain",
                                                            transform: "scale(1.5)",
                                                        }}
                                                    />
                                                </IconButton>
                                            </div>
                                        </TableCell>
                                    )}

                                    {role !== "Admin" && (
                                        <TableCell>
                                            {news.image ? (
                                                <a
                                                    href={`${API_END_POINT_IMG}/uploads/${news.image}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
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
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            window.open(
                                                                `${API_END_POINT_IMG}/uploads/${news.image}`,
                                                                "_blank"
                                                            );
                                                        }}
                                                    >
                                                        Download
                                                    </Button>
                                                </a>
                                            ) : (
                                                <span style={{ color: "#999" }}>No File</span>
                                            )}
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                    </TableBody>

                </Table>
            </TableContainer>
            {renderPagination()}

            <Dialog open={openDeleteModal} onClose={handleCancelDelete}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete the Media/News "{selectedNews?.heading}"?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default MediaNewsTable;
