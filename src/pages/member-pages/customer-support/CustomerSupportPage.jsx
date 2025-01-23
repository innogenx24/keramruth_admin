import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LanguageIcon from "@mui/icons-material/Language";
import WhatsAppIcon from "@mui/icons-material/WhatsApp"; // Add WhatsApp Icon
import AppLogo from "../../../assets/logo/AppLogo";

const CustomerSupportPage = () => {
  const companyDetails = {
    name: "Keramruth Virgin Coconut Oil",
    address:
      "Sri Gurukrupavana Estate, Upparakalenahalli village, Javagal Hobali, Arsikere Taluk, Hassan District, Karnataka-573125.",
    phone: "+91 9844436655",
    email: "info.keramruth@gmail.com",
    supportHours: "Mon-Sat: 9:00 AM - 6:00 PM",
    website: "www.keramruth.com",
    mapsLocation: "https://www.google.com/maps?q=Upparakalenahalli+Village,+Javagal+Hobali,+Arsikere+Taluk,+Hassan+District,+Karnataka+573125", // Link to Google Maps
    whatsappLink: "https://wa.me/919019680789",
  };

  return (
    <Box sx={{ p: 3, minHeight: "100vh" }}>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2, color: "primary.main" }}>
          Company Details
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Company Name:
            </Typography>
            <Typography variant="body1">{companyDetails.name}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Address:
            </Typography>
            <Typography variant="body1">{companyDetails.address}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Phone:
            </Typography>
            <Typography variant="body1">{companyDetails.phone}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Email:
            </Typography>
            <Typography variant="body1">{companyDetails.email}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Website:
            </Typography>
            <Link
              href={companyDetails.website}
              target="_blank"
              rel="noopener"
              underline="hover"
              sx={{ color: "primary.main", fontWeight: "bold" }}
            >
              {companyDetails.website}
            </Link>
          </Grid>

        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" sx={{ mb: 2 }}>
          Contact Us
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <PhoneIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Call Us"
              secondary={
                <Link
                  href={`tel:${companyDetails.phone.replace(/\s+/g, '')}`}
                  target="_blank"
                  rel="noopener"
                  underline="hover"
                  sx={{ color: "primary.main", fontWeight: "bold" }}
                >
                  {companyDetails.phone}
                </Link>
              }
            />
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <WhatsAppIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="WhatsApp Us"
              secondary={
                <Link
                  href={companyDetails.whatsappLink}
                  target="_blank"
                  rel="noopener"
                  underline="hover"
                  sx={{ color: "primary.main", fontWeight: "bold" }}
                >
                  {companyDetails.phone}
                </Link>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <EmailIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Email Us"
              secondary={
                <Link
                  href={`mailto:${companyDetails.email}`}
                  underline="hover"
                  sx={{ color: "primary.main", fontWeight: "bold" }}
                >
                  {companyDetails.email}
                </Link>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <LocationOnIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Visit Us"
              secondary={
                <Link
                  href={companyDetails.mapsLocation}
                  target="_blank"
                  rel="noopener"
                  underline="hover"
                  sx={{ color: "primary.main", fontWeight: "bold" }}
                >
                  {companyDetails.address}
                </Link>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AccessTimeIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Working Hours"
              secondary={companyDetails.supportHours}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <LanguageIcon color="primary" />
            </ListItemIcon>
            <ListItemText>
              <Link
                href={companyDetails.website}
                target="_blank"
                rel="noopener"
                underline="hover"
                sx={{ color: "primary.main", fontWeight: "bold" }}
              >
                Visit Our Website
              </Link>
            </ListItemText>
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default CustomerSupportPage;
