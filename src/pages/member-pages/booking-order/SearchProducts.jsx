import { TextField, Box } from "@mui/material";

const SearchProducts = ({ value, onSearchChange }) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
      <TextField
        label="Search Product Name"
        variant="outlined"
        value={value}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{
          borderRadius: "20px", 
          "& .MuiOutlinedInput-root": {
            borderRadius: "20px", 
          },
        }}
      />
    </Box>
  );
};

export default SearchProducts;
