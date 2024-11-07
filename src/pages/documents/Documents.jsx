import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Switch,
} from "@mui/material";
import { Delete, Edit, Add as AddIcon } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DocumentsTable = () => {
  const [documents, setDocuments] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [isTableVisible, setIsTableVisible] = useState(true);
  const navigate = useNavigate();
  
  // Base URL for images
  const imageBaseURL = "http://88.222.245.236:3002/uploads/";

  // Fetch documents from API
  const fetchDocuments = async () => {
    try {
      const response = await axios.get("http://88.222.245.236:3002/documents");
      setDocuments(response.data.data); // Adjust according to your API response structure
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    fetchDocuments(); // Call the fetch function on component mount
  }, []);

  const handleAddClick = () => {
    navigate("add-document"); // Navigate to the add document page
  };

  const handleEditClick = (document) => {
    navigate("edit-document", { state: { document } }); // Pass document to the edit form
  };

  // Open delete confirmation modal
  const handleDeleteOpen = (document) => {
    setDocumentToDelete(document);
    setDeleteModalOpen(true);
  };

  // Close delete confirmation modal
  const handleDeleteClose = () => {
    setDeleteModalOpen(false);
    setDocumentToDelete(null);
  };

  // Confirm deletion of the document
  const confirmDelete = async () => {
    if (documentToDelete) {
      try {
        await axios.delete(`http://88.222.245.236:3002/documents/${documentToDelete.id}`);
        setDocuments((prevDocuments) => 
          prevDocuments.filter((doc) => doc.id !== documentToDelete.id)
        );
        handleDeleteClose();
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    }
  };

  // Handle toggle switch for activate status
  const handleToggleSwitch = async (document) => {
    const updatedStatus = !document.activateStatus; // Toggle the current status

    try {
      // Update status on the server
      await axios.patch(`http://88.222.245.236:3002/documents/${document.id}`, {
        activateStatus: updatedStatus,
      });

      // Update local state
      setDocuments((prevDocuments) =>
        prevDocuments.map((doc) =>
          doc.id === document.id ? { ...doc, activateStatus: updatedStatus } : doc
        )
      );
    } catch (error) {
      console.error("Error updating document status:", error);
    }
  };

  return (
    <div>
      {isTableVisible && ( 
        <TableContainer component={Paper}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px",
              alignItems: "center",
            }}
          >
            <h2 style={{ margin: 0 }}>All Documents</h2>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddClick}
              style={{
                backgroundColor: "#28a745",
                color: "white",
              }}
            >
              CREATE DOCUMENT
            </Button>
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Document ID</TableCell>
                <TableCell>Heading</TableCell>
                <TableCell>File Size (KB)</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Applying On</TableCell>
                <TableCell>Activate Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.map((document, index) => (
                <TableRow key={document.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell style={{ display: "flex", alignItems: "center" }}>
                    {document.image ? (
                      <img
                        src={`${imageBaseURL}${document.image}`} // Use the base URL
                        style={{ width: 50, height: 50, marginRight: 10, borderRadius: 2 }}
                        alt={document.heading}
                      />
                    ) : (
                      <span>No Image Available</span>
                    )}
                    <span>{document.documentID}</span>
                  </TableCell>
                  <TableCell>{document.heading}</TableCell>
                  <TableCell>{document.imageSize}</TableCell>
                  <TableCell style={{ maxWidth: 200 }}>
                    {document.description.length > 50
                      ? `${document.description.substring(0, 50)}...`
                      : document.description}
                  </TableCell>
                  <TableCell>{document.receiver}</TableCell>
                  <TableCell>
                    <Switch
                      checked={document.activateStatus}
                      onChange={() => handleToggleSwitch(document)}
                      color="success"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditClick(document)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteOpen(document)} color="secondary">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onClose={handleDeleteClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the document with ID "
            {documentToDelete?.documentID}" and heading "
            {documentToDelete?.heading}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DocumentsTable;
