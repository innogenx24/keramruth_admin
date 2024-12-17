import { TextField, Box } from "@mui/material";

const SearchBox = ({ value, onSearchChange }) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
      <TextField
        label="Search name"
        variant="outlined"
        value={value}
        onChange={onSearchChange} // Pass the event directly
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

export default SearchBox;
