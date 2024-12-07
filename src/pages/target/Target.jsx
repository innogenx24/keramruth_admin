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
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
// import EditProductForm from "./EditProductForm";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import ProductPriceModal from "./ProductPriceModal";
import { fetchProductsRequest } from "../../redux/slices/product-slice/ProductGetSlice";
import { deleteProductRequest } from "../../redux/slices/product-slice/ProductDeleteSlice";
import { Doughnut } from "react-chartjs-2";


const TargetPage = () => {
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
  const imageBaseURL = "http://88.222.245.236:3002/uploads/";

  const [page, setPage] = useState(0); // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page

  const targetData = {
    totalTarget: 5000,
    done: 2200,
    pending: 2800,
    history: [
      { month: "Last Month", percentage: 100 },
      { month: "Jun", percentage: 60 },
      { month: "May", percentage: 30 },
      { month: "Apr", percentage: 100 },
      { month: "Mar", percentage: 100 },
      { month: "Feb", percentage: 100 },
    ],
  };

  const doughnutData = {
    labels: ["Done", "Pending"],
    datasets: [
      {
        data: [targetData.done, targetData.pending],
        backgroundColor: ["#4CAF50", "#FF7043"],
        hoverBackgroundColor: ["#388E3C", "#E64A19"],
      },
    ],
  };

  const doughnutOptions = {
    cutout: "70%",
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw} L`;
          },
        },
      },
    },
  };

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
      const response = await fetch(`http://88.222.245.236:3002/products/${product.id}`, {
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
    { id: 'image', label: 'Member Image' },
    { id: 'name', label: 'Member Name' },
    // { id: 'category_name', label: 'Category Name' },
    // { id: 'productVolume', label: 'Product Volume' },
    // { id: 'price', label: 'MRP' },
    // { id: 'price', label: 'Distributors Prices' },
    { id: 'stock_status', label: 'Status' },
    // { id: 'action', label: 'Action' }
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

  return (
    <div>
      <Typography variant="h6" sx={{ marginBottom: "20px", color: "#989FA9" }}>
        All Targets
      </Typography>

      <div className="container my-4">
      {/* Card Container */}
      <div className="card shadow-sm p-4">
        {/* Target Section */}
        <div
  className="d-flex justify-content-between align-items-center"
  style={{ gap: "20px" }} // Add space between elements if needed
>
  {/* Left Content */}
  <div>
    <h5 className="mb-2">This Month</h5>
    <h6 className="mb-1">Target Litres</h6>
    <h4 style={{ color: "#4CAF50" }}>{targetData.totalTarget} Litres</h4>
    <p className="mb-1 text-success">● Done: {targetData.done} L</p>
    <p className="mb-1 text-danger">● Pending: {targetData.pending} L</p>
  </div>

  {/* Donut Chart */}
  <div
    style={{
      flexShrink: 0, // Prevent shrinking of the donut chart
      width: "150px",
      height: "150px",
    }}
  >
    <Doughnut data={doughnutData} options={doughnutOptions} />
  </div>
</div>


        {/* History Section */}
        <hr />
        <h6>Target History</h6>
        <div>
          {targetData.history.map((item, index) => (
            <div key={index} className="mb-2">
              <div className="d-flex justify-content-between">
                <span>{item.month}</span>
                <span>{item.percentage}%</span>
              </div>
              <div
                className="progress"
                style={{ height: "8px", background: "#f5f5f5" }}
              >
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor:
                      item.percentage >= 75
                        ? "#4CAF50"
                        : item.percentage >= 50
                        ? "#FFC107"
                        : "#FF7043",
                  }}
                  aria-valuenow={item.percentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-3">
          <small>
            <span className="text-success">● Done 100%</span> &nbsp; 
            <span className="text-warning">● 75%-50%</span> &nbsp; 
            <span className="text-danger">● 50%-0%</span>
          </small>
        </div>
      </div>
    </div>

      <div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "20px",
    gap: "10px", // Add spacing between buttons
  }}
>
  <Button
    variant="contained"
    color="primary"
  >
    Target Achieved
  </Button>
  <Button
    variant="contained"
    color="primary"
  >
    Target Not Achieved
  </Button>
</div>


      <TableContainer component={Paper} >
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
            <TableCell>{product.category_name}</TableCell>
            <TableCell>{product.productVolume}</TableCell>
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


      {/* {isOpen && (  
        <ProductPriceModal  
          product={selectedProduct}  
          isOpen={isOpen}  
          onClose={handleCloseModal}  
        />  
      )} */}

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

export default TargetPage;
