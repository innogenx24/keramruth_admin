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
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SearchProducts from "../booking-order/SearchProducts";

const MemberProductPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0); // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page
  const imageBaseURL = "http://88.222.245.236:3002/uploads/";
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch products from API
  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token not found. Please log in.");
      return;
    }

    try {
      const response = await axios.get(
        "http://88.222.245.236:3002/products/user_product",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const sortedProducts = response.data.sort((a, b) => b.id - a.id);

      setProducts(sortedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when changing rows per page
  };

  const sortedProducts = [...products].sort((a, b) => b.id - a.id); // Sort by ID in descending order

  const columns = [
    { id: 'no', label: 'No.' },
    { id: 'image', label: 'Product Image' },
    { id: 'name', label: 'Product Name' },
    { id: 'stock_quantity', label: 'Stock Quantity' },
    { id: 'category_name', label: 'Category Name' },
    { id: 'productVolume', label: 'Product Volume' },
    { id: 'price', label: 'MRP' },
  ];


  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
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
            {filteredProducts
              .map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {product.image ? (
                      <img
                        src={`${imageBaseURL}${product.image}`}
                        style={{
                          width: "100px",
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

                  <TableCell>{product.super1 && product.super1 !== '0.00' ? product.super1 : product.originalPrice}</TableCell>

                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>


    </div>
  );
};

export default MemberProductPage;
