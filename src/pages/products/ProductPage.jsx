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
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import EditProductForm from "./EditProductForm";
import "./product.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ProductPriceModal from "./ProductPriceModal";
import { fetchProductsRequest } from "../../redux/slices/product-slice/ProductGetSlice";
import { deleteProductRequest } from "../../redux/slices/product-slice/ProductDeleteSlice";

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
    window.location.reload();
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false); // Close the delete modal
    setProductToDelete(null); // Reset product to delete
  };

  if (showAddProduct) {
    return (
      <EditProductForm
        handleBackToProducts={handleBackToProducts}
        editProduct={editProduct} // Pass the product to be edited
      />
    );
  }

  return (
    <div>
      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        Products
      </Typography>
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
        >
          Add Product
        </Button>
      </div>
      <h2>All Products</h2>
      <TableContainer component={Paper}>
        <Table aria-label="product table">
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Product ID</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Product Volume</TableCell>
              <TableCell>MRP</TableCell>
              <TableCell>Distributor's Price</TableCell>
              <TableCell>Stock Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productsList.map((product, index)=> (
              <TableRow key={product.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell style={{ display: "flex", alignItems: "center" }}>
                  {product.image ? (
                    <img
                    src={product.image} // Use the base URL
                    style={{ width: 50, height: 50, marginRight: 10, borderRadius: 2 }}
                    />
                  ) : (
                    <span>No Image Available</span>
                  )}
                  <span>{product.id}</span>
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.productVolume}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>
                  <Button onClick={() => handleViewClick(product)}>View</Button>
                </TableCell>
                <TableCell>
                  <Switch checked={product.status} />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditProductClick(product)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDeleteProductClick(product)} 
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Product Price Modal */} 
      {isOpen && (  
        <ProductPriceModal  
          product={selectedProduct}  
          isOpen={isOpen}  
          onClose={handleCloseModal}  
        />  
      )}

      {/* Delete Confirmation Modal */}
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
