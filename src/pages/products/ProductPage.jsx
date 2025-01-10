import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Switch,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TablePagination,
  Box,
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import EditProductForm from "./EditProductForm";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ProductPriceModal from "./ProductPriceModal";
import { fetchProductsRequest } from "../../redux/slices/product-slice/ProductGetSlice";
import { deleteProductRequest } from "../../redux/slices/product-slice/ProductDeleteSlice";
import SearchProducts from "../member-pages/booking-order/SearchProducts"
import DeleteButton from "../../assets/actions/DeleteButton.svg"
import EditButton from "../../assets/actions/EditButton.svg"
import TurnOn from "../../assets/actions/TurnOn.svg"
import TurnOff from "../../assets/actions/TurnOff.svg"
import { API_END_POINT_IMG } from "../../constants/ApiConstant";
const ProductPage = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const productsList = Array.isArray(products) ? products : [products];
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editProduct, setEditProduct] = useState(null); // State for the product being edited
  const [openDeleteModal, setOpenDeleteModal] = useState(false); // State for the delete modal
  const [productToDelete, setProductToDelete] = useState(null); // State for the product to be deleted
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;
  const imageBaseURL = `${API_END_POINT_IMG}/uploads/`;
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(0); // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page

  useEffect(() => {
    dispatch(fetchProductsRequest());
  }, [dispatch]);

  const handleViewClick = (product) => {
    setIsOpen(true);
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleAddProductClick = () => {
    setEditProduct(null); // Reset editProduct when adding a new product
    setShowAddProduct(true);
    navigate("add-product");
  };

  const handleEditProductClick = (product) => {
    setEditProduct(product);
    navigate("edit-product", { state: { product } });
  };

  const handleBackToProducts = () => {
    setShowAddProduct(false);
  };

  const handleDeleteProductClick = (product) => {
    setProductToDelete(product); // Set the product to delete
    setOpenDeleteModal(true); // Open the delete confirmation modal
  };

  const handleConfirmDelete = () => {
    dispatch(deleteProductRequest(productToDelete?.id));
    setOpenDeleteModal(false);
    setProductToDelete(null);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false); // Close the delete modal
    setProductToDelete(null); // Reset product to delete
  };

  const handleToggleStockStatus = async (product) => {
    try {
      const updatedStatus = !product.status; // Toggle the current status
      const response = await fetch(`${API_END_POINT}/products/${product.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...product, status: updatedStatus }),
      });

      if (response.ok) {
        dispatch(fetchProductsRequest()); // Refetching for simplicity; consider updating state directly if needed
      } else {
        console.error("Failed to update product status");
      }
    } catch (error) {
      console.error("Error updating product status:", error);
    }
  };

  const sortedProducts = [...productsList].sort((a, b) => b.id - a.id); // Sort by ID in descending order

  const columns = [
    { id: 'no', label: 'No.' },
    { id: 'image', label: 'Product Image' },
    { id: 'name', label: 'Product Name' },
    { id: 'stock_quantity', label: 'Product Stock' },
    { id: 'category_name', label: 'Category Name' },
    { id: 'productVolume', label: 'Product Volume' },
    { id: 'price', label: 'MRP' },
    { id: 'price', label: 'Distributors Prices' },
    { id: 'stock_status', label: 'Stock Status' },
    { id: 'action', label: 'Action' }
  ];

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when changing rows per page
  };


  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );


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
        Page {page + 1} of {Math.ceil(totalRows / rowsPerPage)}
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
      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        All Products
      </Typography>
      <Box sx={{ width: "100%", marginBottom: 2 }}>
        <SearchProducts value={searchQuery} onSearchChange={setSearchQuery} />
      </Box>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddProductClick}
          startIcon={<Add />}
          style={{
            backgroundColor: "#28a745",
            color: "white",
            fontWeight: "bold",
            borderRadius: "5px",
          }}
        >
          Add Product
        </Button>
      </div>

      <TableContainer component={Paper} >
        <Table aria-label="product table">
          <TableHead sx={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#DCDCDC" }}>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Apply pagination
              .map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell> {/* Adjust row number */}
                  <TableCell>
                    {product.image ? (
                      <img
                        src={`${imageBaseURL}${product.image}`}
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
                      <span>No Image Available</span>
                    )}
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.stock_quantity}</TableCell>
                  <TableCell>{product.category_name}</TableCell>
                  <TableCell>{product.productVolume}{product.quantity_type}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleViewClick(product)}>View</Button>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleToggleStockStatus(product)}
                      color={product.status ? "primary" : "default"}
                    >
                      <img
                        src={product.status ? TurnOn : TurnOff}
                        alt={product.status ? "Turn On" : "Turn Off"}
                        style={{
                          width: "70px",
                          height: "30px",
                          objectFit: "contain",
                          transform: "scale(1.5)",
                        }}
                      />
                    </IconButton>
                  </TableCell>

                  <TableCell>
                    <div style={{ display: "flex" }}>
                      <IconButton
                        onClick={() => handleDeleteProductClick(product)}
                        color="secondary"
                        style={{ marginRight: "5px" }}
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

                      <IconButton
                        onClick={() => handleEditProductClick(product)}
                        color="primary"
                      >
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
                </TableRow>
              ))}
          </TableBody>

        </Table>
      </TableContainer>

      <div style={{ marginTop: "10px" }}>
        {renderPagination(page, setPage, filteredProducts.length)}
      </div>






      {isOpen && (
        <ProductPriceModal
          product={selectedProduct}
          isOpen={isOpen}
          onClose={handleCloseModal}
        />
      )}

      <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the product with ID "
            <strong>{productToDelete?.id}</strong>" and name "
            <strong>{productToDelete?.name}</strong>"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal} color="primary">
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

export default ProductPage;
