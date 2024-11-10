

// import React, { useState } from 'react';
// import { TextField, Button, Snackbar, Alert } from '@mui/material';
// import axios from 'axios';

// const SetOrderLimit = () => {
//   const [hours, setHours] = useState('');
//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState('');
//   const [snackbarSeverity, setSnackbarSeverity] = useState('success');

//   const handleChange = (e) => {
//     setHours(e.target.value);
//   };

//   const handleCloseSnackbar = () => {
//     setOpenSnackbar(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent the default form submission behavior
//     const orderLimitData = { hours: parseInt(hours, 10) }; // Prepare data for the request

//     try {
//       const response = await axios.post('http://88.222.245.236:3002/api/order-limits/create', orderLimitData);
//       console.log('Success:', response.data);
//       setSnackbarMessage('Order limit set successfully!');
//       setSnackbarSeverity('success');
//     } catch (error) {
//       console.error('Error setting time limit:', error);
//       setSnackbarMessage('Error setting order limit. Please try again.');
//       setSnackbarSeverity('error');
//     } finally {
//       setOpenSnackbar(true); // Open the snackbar to show the message
//       setHours(''); // Clear the input field
//     }
//   };

//   return (
//     <div style={{ maxWidth: 400, margin: '0 auto', padding: '20px' }}>
//       <h2>Set Order Time Limit</h2>
//       <form onSubmit={handleSubmit}>
//         <TextField
//           label="Time Limit (hours)"
//           type="number"
//           value={hours}
//           onChange={handleChange}
//           variant="outlined"
//           fullWidth
//           margin="normal"
//           required
//         />
//         <Button 
//           variant="contained" 
//           color="primary" 
//           type="submit" 
//           fullWidth
//         >
//           Set Limit
//         </Button>
//       </form>
//       <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
//         <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// };

// export default SetOrderLimit;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PDFDownloadLink, Document, Page, Image, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Button, CircularProgress, Typography, Box, Card, CardContent, IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/CloudDownload';

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { display: 'flex', flexDirection: 'row', alignItems: 'flex-start', padding: 10 },
  image: { width: 150, height: 150, marginRight: 20 },
  textContainer: { flexGrow: 1 },
  title: { fontSize: 20, marginBottom: 10, fontWeight: 'bold' },
  label: { fontSize: 12, fontWeight: 'bold', marginBottom: 2 },
  value: { fontSize: 12, marginBottom: 5 },
});

const MyDocument = ({ data, imageUrl }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Image src={imageUrl} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{data.heading}</Text>
          <Text style={styles.label}>Document ID: {data.documentID}</Text>
          <Text style={styles.label}>Description: {data.description}</Text>
          <Text style={styles.label}>From Date : {data.fromDate}</Text>
          <Text style={styles.label}>To Date : {data.toDate}</Text>

          {/* Add additional text fields as needed */}
        </View>
      </View>
    </Page>
  </Document>
);

const DocumentComponent = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://88.222.245.236:3002/announcements');
        const documentList = response.data.data;
        setDocuments(documentList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching documents:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={3}>
      <Typography variant="h5" gutterBottom>Downloads</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        documents.map((doc, index) => (
          <Card key={index} sx={{ mb: 2, width: '100%', maxWidth: 400 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{doc.heading}</Typography>
                <Typography variant="body2">{doc.description}</Typography>
              </Box>
              <PDFDownloadLink
                document={<MyDocument data={doc} imageUrl={`http://88.222.245.236:3002/uploads/${doc.image}`} />}
                fileName={`${doc.heading.replaceAll(" ", "_")}.pdf`}
              >
                {({ loading }) =>
                  loading ? (
                    <IconButton disabled>
                      <CircularProgress size={24} />
                    </IconButton>
                  ) : (
                    <IconButton color="success" size="large">
                      <DownloadIcon />
                    </IconButton>
                  )
                }
              </PDFDownloadLink>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default DocumentComponent;
