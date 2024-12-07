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
  Switch,
  Typography,
  TablePagination,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import { fetchProductsRequest } from "../../redux/slices/product-slice/ProductGetSlice";
import { fetchProductsRequest } from "../../../redux/slices/product-slice/ProductGetSlice";
import ProductPriceModal from "../../products/ProductPriceModal";

const MemberProductPage = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const productsList = Array.isArray(products) ? products : [products];
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [page, setPage] = useState(0); // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page
  const navigate = useNavigate();
  const imageBaseURL = "http://88.222.245.236:3002/uploads/";
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // Add this line

  useEffect(() => {
    dispatch(fetchProductsRequest());
  }, [dispatch]);

  const handleAddProductClick = () => {
    setShowAddProduct(true);
    navigate("add-product");
  };

  const handleViewClick = (product) => {
    setIsOpen(true);  // This will open the modal
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setIsOpen(false);  // This will close the modal
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when changing rows per page
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
  ];

  return (
    <div>
      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        All Products
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

      <TableContainer component={Paper}>
        <Table aria-label="product table">
          <TableHead sx={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "white" }}>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedProducts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Slice data for pagination
              .map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {product.image ? (
                      <img
                        src={`${imageBaseURL}${product.image}`}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
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
                    <Switch
                      checked={product.status}
                      onChange={() => handleToggleStockStatus(product)}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[]} // Disable the rows per page dropdown
        component="div"
        count={sortedProducts.length} // Total number of products
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelDisplayedRows={() => ""} // Remove default range text
        ActionsComponent={({ count, page, rowsPerPage, onPageChange }) => (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
            <Button
              onClick={(event) => onPageChange(event, page - 1)}
              disabled={page === 0}
              variant="outlined"
            >
              Previous
            </Button>
            <Typography variant="body1" style={{ minWidth: "60px", textAlign: "center" }}>
              Page {page + 1}
            </Typography>
            <Button
              onClick={(event) => onPageChange(event, page + 1)}
              disabled={page >= Math.ceil(count / rowsPerPage) - 1}
              variant="outlined"
            >
              Next
            </Button>
          </div>
        )}
      />
      {isOpen && (
        <ProductPriceModal
          product={selectedProduct}
          isOpen={isOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default MemberProductPage;
