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
  height: '555px',
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
  marginTop: '74px',
  width: '152px',
  height: '150px',
  border: '3px solid #90EE90',
});

const InfoBox = styled(Box)(({ theme }) => ({
  marginTop: '-5px',
  padding: '26px',
  borderRadius: '10px',
  textAlign: 'center',
}));

const FullName = styled(Typography)({
  marginTop: '-20px',

  fontSize: '1.2rem',
  fontWeight: 'bold',
  color: 'black',
});

const RoleName = styled(Typography)({
  fontSize: '1rem',
  fontStyle: 'italic',
  color: 'black',
});


const UserName = styled(Typography)({
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
  const website = "https://www.keramruth.com";

  return (
    <Box>
      {/* Profile Card */}
      <StyledCard ref={cardRef}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              marginTop: '60px', 
            }}
          >
            {users.role_name === 'Admin' ? 'Admin ID':'Distributor ID'}
          </Typography>
          <ProfileImageContainer>
            <ProfileImage
              src={selectedImage || "default-avatar.jpg"}
              alt={users?.full_name}
            />
          </ProfileImageContainer>

          <Box textAlign="center" mt={3}>
            <FullName>{users?.full_name}</FullName>
            <UserName style={{ color: "#1c96c5" }}>{users?.username}</UserName>
            <RoleName>{users?.role_name}</RoleName>
          </Box>

          <InfoBox >


            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', marginLeft: '35px' }}>
              <Typography variant="body2" style={{ fontStyle: 'italic', fontWeight: 'bold', marginRight: '8px' }}>
                M:
              </Typography>
              <Typography variant="body2" style={{ fontStyle: 'italic' }}>
                +91 {users?.mobile_number}
              </Typography>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', marginLeft: '35px' }}>
              <Typography variant="body2" style={{ fontStyle: 'italic', fontWeight: 'bold', marginRight: '8px' }}>
                E:
              </Typography>
              <Typography variant="body2" style={{ fontStyle: 'italic' }}>
                {users?.email}
              </Typography>
            </div>

            <div style={{ marginBottom: '8px', marginLeft: '35px' }}>
              <Typography
                variant="body2"
                style={{
                  fontStyle: 'italic',
                  fontWeight: 'bold',
                  marginBottom: '4px',
                  marginLeft: '-167px'
                }}
              >
              </Typography>
              <div style={{ marginLeft: '-10px', display: 'flex', flexDirection: 'column' }}>
                <Typography
                  variant="body2"
                  style={{
                    fontStyle: 'italic',
                    lineHeight: 1.6,
                    marginTop: '5px',
                    marginRight: '22px'
                  }}
                >
                  {users?.district ? users.district : users?.street_name}, {users?.city}, {users?.state}, {users?.pincode}.

                </Typography>
                
              </div>
            </div>

            <Typography variant="body2" style={{ fontStyle: 'italic', color: '#1E90FF', marginTop: '30px' }}>
            <a 
              href={website} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{
               fontStyle: 'italic',
               color: '#1E90FF',
               marginTop: '30px',
               textDecoration: 'none' 
              }}
            >
             {website}
            </a>

            </Typography>
          </InfoBox>
        </CardContent>

      </StyledCard>

      <Box textAlign="center" mt={3}>
        <Button
          variant="contained"
          sx={{ backgroundColor: 'green' }}
          onClick={handleDownload}
        >
          Download ID Card
        </Button>
      </Box>
    </Box>
  );
}





// import React, { useEffect, useState, useRef } from "react";
// import { Card, CardContent, Typography, Avatar, Box, Button } from '@mui/material';
// import { styled } from '@mui/system';
// import backgroundImg from '../../assets/profile-id.png';
// import { useSelector, useDispatch } from "react-redux";
// import { fetchUsersRequest } from "../../redux/slices/user-profile-slice/UserGetSlice";
// import { API_END_POINT_IMG } from "../../constants/ApiConstant";
// import html2canvas from 'html2canvas';
// import { RiDownload2Fill } from "react-icons/ri";
// import LoginImage from '../../assets/logo/LoginImage.png'
// const StyledCard = styled(Card)(({ theme }) => ({
//   width: '350px',
//   height: '535px',
//   margin: 'auto',
//   borderRadius: '15px',
//   position: 'relative',
//   overflow: 'hidden',
//   backgroundColor: 'transparent',
//   boxShadow: 'none',
//   backgroundImage: `url(${backgroundImg})`,
//   backgroundSize: 'cover',
//   backgroundPosition: 'center',
// }));

// const ProfileImageContainer = styled(Box)({
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'center',
//   marginTop: '-60px',
// });

// const ProfileImage = styled(Avatar)({
//   marginTop: '74px',
//   width: '152px',
//   height: '150px',
//   border: '3px solid #90EE90',
// });

// const InfoBox = styled(Box)(({ theme }) => ({
//   marginTop: '-10px',
//   padding: '26px',
//   borderRadius: '10px',
//   textAlign: 'center',
// }));

// const FullName = styled(Typography)({
//   marginTop: '-20px',

//   fontSize: '1.2rem',
//   fontWeight: 'bold',
//   color: 'black',
// });

// const RoleName = styled(Typography)({
//   fontSize: '1rem',
//   fontStyle: 'italic',
//   color: 'black',
// });


// const UserName = styled(Typography)({
//   fontSize: '1rem',
//   fontStyle: 'italic',
//   color: 'black',
// });


// export default function ProfileCard() {
//   const dispatch = useDispatch();
//   const { users } = useSelector((state) => state.users);
//   const [selectedImage, setSelectedImage] = useState("");
//   const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;
//   const imageBaseURL = `${API_END_POINT_IMG}/uploads/`;

//   // Ref to capture the card content
//   const cardRef = useRef(null);

//   useEffect(() => {
//     if (users?.image) {
//       const imageUrl = users.image.includes("http")
//         ? users.image
//         : `${imageBaseURL}${users.image}`;
//       setSelectedImage(imageUrl);
//     }
//   }, [users]);

//   useEffect(() => {
//     dispatch(fetchUsersRequest());
//   }, [dispatch]);

//   // Download function using html2canvas
//   const handleDownload = () => {
//     if (cardRef.current) {
//       html2canvas(cardRef.current).then(canvas => {
//         const link = document.createElement('a');
//         link.href = canvas.toDataURL('image/png');
//         link.download = 'profile-id-card.png';
//         link.click();
//       });
//     }
//   };
//   const website = "www.keramruth.com";


//   return (
//     <Box>
//       {/* Profile Card */}
//       <StyledCard ref={cardRef}>
//         <CardContent>
//           <Typography
//             variant="h6"
//             sx={{
//               textAlign: 'center',
//               marginTop: '50px', // Space between ID and image
//             }}
//           >
//             Distributor ID
//           </Typography>
//           <ProfileImageContainer>
//             <ProfileImage
//               src={selectedImage || "default-avatar.jpg"}
//               alt={users?.full_name}
//             />
//           </ProfileImageContainer>

//           <Box textAlign="center" mt={3}>
//             <FullName>{users?.full_name}</FullName>
//             <UserName style={{ color: "#1c96c5" }}>{users?.username}</UserName>
//             <RoleName>{users?.role_name}</RoleName>
//           </Box>

//           <InfoBox >
//             <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px',marginLeft:'35px' }}>
//               <Typography variant="body2" style={{ fontStyle: 'italic', fontWeight: 'bold', marginRight: '8px' }}>
//                 E:
//               </Typography>
//               <Typography variant="body2" style={{ fontStyle: 'italic' }}>
//                 {users?.email}
//               </Typography>
//             </div>

//             <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px',marginLeft:'35px' }}>
//               <Typography variant="body2" style={{ fontStyle: 'italic', fontWeight: 'bold', marginRight: '8px' }}>
//                 M:
//               </Typography>
//               <Typography variant="body2" style={{ fontStyle: 'italic' }}>
//                 +91 {users?.mobile_number}
//               </Typography>
//             </div>
            
//             <Typography variant="body2" style={{ fontStyle: 'italic', padding: '20px', width: '92%', marginTop: '-20px' }}>
//               {users?.street_name}, {users?.city}, {users?.state}, {users?.pincode}.
//             </Typography>
//             <Typography variant="body2" style={{ fontStyle: 'italic', color: '#1E90FF', marginTop: '-10px' }}>
//               {website}
//             </Typography>
//           </InfoBox>
//         </CardContent>

//       </StyledCard>

//       <Box textAlign="center" mt={3}>
//         <Button
//           variant="contained"
//           sx={{ backgroundColor: 'green' }}
//           onClick={handleDownload}
//         >
//           Download ID Card
//         </Button>
//       </Box>
//     </Box>
//   );
// }
