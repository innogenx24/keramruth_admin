import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
    Box,
    IconButton,
    Typography,
    Modal,
  } from "@mui/material";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

const ProductPriceModal = ({ product, isOpen, onClose }) => {
    const [open, setOpen] = useState(isOpen);

    const handleClose = () => {
        setOpen(false);
        onClose();
    };

    return (
        <>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="product-price-modal"
                aria-describedby="product-price-modal-description"
            >
            
                <Box sx={style}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                
                    <Typography id="product-price-modal" variant="h6" component="h2">
                        Distributors Price: 
                    </Typography>
                
                    <Typography id="product-price-modal-description" sx={{ mt: 2 }}>

                        <div>
                            <div style={{flex:1, flexDirection:"row", justifyContent: "space-between"}}>
                            <h6>{product?.name}</h6>
                            <h6>({product?.productVolume})</h6>
                            </div>
                            <table>
                                
                                <tbody>

                                    <tr>
                                        <td>Area Development Officer (ADO)</td>
                                        <td>₹{product?.adoPrice}</td>
                                    </tr>

                                    <tr>
                                        <td>Master Distributor (MD)</td>
                                        <td>₹{product?.mdPrice}</td>
                                    </tr>

                                    <tr>
                                        <td>Super Distributor (SD)</td>
                                        <td>₹{product?.sdPrice}</td>
                                    </tr>

                                    <tr>
                                        <td>Distributor</td>
                                        <td>₹{product?.distributorPrice}</td>
                                    </tr>
                                    
                                </tbody>
                                
                            </table>

                        </div>
                    
                    </Typography>
                </Box>

            </Modal>
        </>
    );
};

export default ProductPriceModal;