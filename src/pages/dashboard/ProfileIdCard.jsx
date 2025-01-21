import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent, Typography, Avatar, Box, Button } from '@mui/material';
import { styled } from '@mui/system';
import backgroundImg from '../../assets/profile-id.png';
import { useSelector, useDispatch } from "react-redux";
import { fetchUsersRequest } from "../../redux/slices/user-profile-slice/UserGetSlice";
import { API_END_POINT_IMG } from "../../constants/ApiConstant";
import html2canvas from 'html2canvas';

const StyledCard = styled(Card)(({ theme }) => ({
  width: '350px',
  height: '500px',
  margin: 'auto',
  borderRadius: '15px',
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: 'transparent',
  boxShadow: 'none', 
  backgroundImage: `url(${backgroundImg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}));

const ProfileImageContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '-60px',
});

const ProfileImage = styled(Avatar)({
  marginTop: '98px',
  width: '149px',
  height: '150px',
  border: '3px solid #fff',
});

const InfoBox = styled(Box)(({ theme }) => ({
  marginTop: '10px',
  padding: '61px',
  borderRadius: '10px',
  textAlign: 'center',
}));

const FullName = styled(Typography)({
  fontSize: '1.2rem',
  fontWeight: 'bold',
  color: 'black',
});

const RoleName = styled(Typography)({
  fontSize: '1rem',
  fontStyle: 'italic',
  color: 'black',
});

export default function ProfileCard() {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);
  const [selectedImage, setSelectedImage] = useState("");
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;
  const imageBaseURL = `${API_END_POINT_IMG}/uploads/`;

  // Ref to capture the card content
  const cardRef = useRef(null);

  useEffect(() => {
    if (users?.image) {
      const imageUrl = users.image.includes("http")
        ? users.image
        : `${imageBaseURL}${users.image}`;
      setSelectedImage(imageUrl);
    }
  }, [users]);

  useEffect(() => {
    dispatch(fetchUsersRequest());
  }, [dispatch]);

  // Download function using html2canvas
  const handleDownload = () => {
    if (cardRef.current) {
      html2canvas(cardRef.current).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png'); 
        link.download = 'profile-id-card.png';
        link.click();
      });
    }
  };

  return (
    <Box>
      {/* Profile Card */}
      <StyledCard ref={cardRef}>
        <CardContent>
          <ProfileImageContainer>
            <ProfileImage
              src={selectedImage || "default-avatar.jpg"} 
              alt={users?.full_name}
            />
          </ProfileImageContainer>

          <Box textAlign="center" mt={3}>
            <FullName>{users?.full_name}</FullName>
            <RoleName>{users?.role_name}</RoleName>
          </Box>

          <InfoBox style={{ textAlign: 'left' }}>
            <Typography variant="body2">Email: {users?.email}</Typography>
            <Typography variant="body2">Phone: {users?.mobile_number}</Typography>
            <Typography variant="body2">
              Address: {users?.building_no_name}, {users?.street_name}, {users?.city},{' '}
              {users?.state},{users?.pincode}.
            </Typography>
          </InfoBox>
        </CardContent>
      </StyledCard>

      {/* Download Button */}
      <Box textAlign="center" mt={3}>
        <Button
          variant="contained"
          sx={{ backgroundColor: 'green' }}
          onClick={handleDownload}
        >
          Download Profile ID Card
        </Button>
      </Box>
    </Box>
  );
}
