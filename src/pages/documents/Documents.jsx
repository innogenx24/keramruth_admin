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
  const navigate = useNavigate();
  
  const imageBaseURL = "http://88.222.245.236:3002/uploads/";

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      if (!token) throw new Error("Token not found");
  
      const response = await axios.get("http://88.222.245.236:3002/documents/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setDocuments(response.data.data);
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

  const handleEditClick = (document) => {
    navigate("edit-document", { state: { document } });
  };

  const handleDeleteOpen = (document) => {
    setDocumentToDelete(document);
    setDeleteModalOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteModalOpen(false);
    setDocumentToDelete(null);
  };

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

  const handleToggleSwitch = async (document) => {
    const updatedStatus = !document.activateStatus;

    try {
      await axios.patch(`http://88.222.245.236:3002/documents/${document.id}`, {
        activateStatus: updatedStatus,
      });
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
          <Button
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
          </Button>
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Document Image</TableCell>
              <TableCell>Heading</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Applying On</TableCell>
              {/* <TableCell>Activate Status</TableCell> */}
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {documents.map((document, index) => (
    <TableRow key={document.id}>
      <TableCell>{index + 1}</TableCell>
      <TableCell style={{ width: 100, textAlign: "center" }}>
        {document.image ? (
          <img
            src={`${imageBaseURL}${document.image}`}
            alt={document.heading}
            style={{
              width: "80px",
              height: "80px",
              objectFit: "cover",
              borderRadius: "5px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            }}
          />
        ) : (
          <span style={{ color: "#999" }}>No Image Available</span>
        )}
      </TableCell>
      <TableCell>{document.heading}</TableCell>
      <TableCell style={{ maxWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {document.description}
      </TableCell>
      <TableCell>{document.receiver}</TableCell>
      {/* <TableCell>
        <Switch
          checked={document.activateStatus}
          onChange={() => handleToggleSwitch(document)}
          color="success"
        />
      </TableCell> */}
      <TableCell>
      <div style={{ display: "flex" }}>
      <IconButton onClick={() => handleEditClick(document)} color="primary">
          <Edit />
        </IconButton>
        <IconButton onClick={() => handleDeleteOpen(document)} color="secondary">
          <Delete />
        </IconButton>

      </div>
       
      </TableCell>
    </TableRow>
  ))}
</TableBody>

        </Table>
      </TableContainer>

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
