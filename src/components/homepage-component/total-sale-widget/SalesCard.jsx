import React from "react";
import { Box, Typography } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";

const roleColors = {
  "Company Total Sales:": "#FFD700", // Gold
  "Area Development Officer": "#01C572", // Greenish
  "Master Distributor": "#FF9500", // Orange
  "Super Distributor": "#8A2BE2", // Yellow
  Distributor: "#0280F5", // Blue
  Customer: "#FF4C4C", // Red
};

const SalesCard = ({
  title,
  sales,
  target,
  growth,
  icon,
  roleName,
  customerBuyedAmmount,
}) => {
  // Assign a constant color based on the role
  const roleColor = roleColors[roleName] || "#0280F5"; // Default to blue if roleName is not found

  const displaySales =
    roleName === "Customer"
      ? `Rs.${new Intl.NumberFormat("en-IN").format(customerBuyedAmmount || 0)}`
      : sales;
  const displayTarget = roleName === "Customer" ? null : target;

  // Set dynamic color based on growth value
  let growthColor = "";
  if (growth >= 75) {
    growthColor = "green"; // Green for 75-100% growth
  } else if (growth >= 50) {
    growthColor = "orange"; // Orange for 50-75% growth
  } else {
    growthColor = "red"; // Red for 0-50% growth
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        p: { xs: "4% 6%", sm: "4% 8%", md: "4% 10%" },
        backgroundColor: "#f4f5ff",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        width: "100%",
        maxWidth: "400px",
        height: { xs: "auto", sm: "110px", md: "120px" },
        boxSizing: "border-box",
        flexDirection: { xs: "column", sm: "row" },
        overflow: "hidden",
      }}
    >
      <Box
        sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            width: "60%",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#7e84a3",
              fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.85rem" },
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              textAlign: "left",
            }}
            // title={title}
          >
            {title}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "baseline" }}>
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.85rem" },
              }}
            >
              {displaySales}
              {displayTarget && `/`}
              {displayTarget && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "#7e84a3",
                    fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.75rem" },
                    ml: "1%",
                  }}
                >
                  {displayTarget}
                </Typography>
              )}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              backgroundColor: growth >= 0 ? roleColor : "#FF4C4C", // Positive growth shows roleColor, negative growth shows red
              borderRadius: "10px",
              width: "35px",
              height: "35px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              mb: "1%",
              mt:
                roleName === "Customer" || roleName === "Company Total Sales:"
                  ? "-10px"
                  : "0px", // Adjust margin-top for 'Customer' or 'Company Total Sales'
            }}
          >
            {icon || <PeopleIcon sx={{ fontSize: "1.1rem" }} />}
          </Box>

          {roleName !== "Customer" && roleName !== "Company Total Sales:" && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="body2"
                sx={{
                  color: growthColor, // Apply the dynamic color for growth
                  fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.75rem" },
                  mr: "1%",
                }}
              >
                {growth >= 0 ? `+${growth}%` : `${growth}%`}{" "}
                {/* Show growth with positive/negative sign */}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#7e84a3", // Color for the arrow
                  fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.75rem" },
                }}
              >
                {growth >= 0 ? "↑" : "↓"}{" "}
                {/* Arrow up or down depending on the growth */}
              </Typography>
            </Box>
          )}

          <Typography
            variant="body2"
            sx={{
              color: "#7e84a3",
              fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.75rem" },
            }}
          ></Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SalesCard;

// import React from 'react';
// import { Box, Typography } from '@mui/material';
// import PeopleIcon from '@mui/icons-material/People';

// const colors = [
//   'linear-gradient(180deg, #01C572 0%, #187E53 100%)',
//   'var(--Colors-Orange, #FF9500)',
//   '#FFC600',
//   '#0280F5'
// ];

// const getRandomColor = () => {
//   return colors[Math.floor(Math.random() * colors.length)];
// };

// const SalesCard = ({ title, sales, target, growth, icon }) => {
//   console.log(target,"dd");

//   const istyle = {
//     background: getRandomColor(),
//   };

//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         justifyContent: 'center',
//         p: { xs: '4% 6%', sm: '4% 8%', md: '4% 10%' }, // Adjusted padding for better fit
//         backgroundColor: '#f4f5ff',
//         borderRadius: '10px',
//         boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//         width: '100%',
//         maxWidth: '400px', // Max width to avoid cards stretching too wide
//         height: { xs: 'auto', sm: '110px', md: '120px' }, // Adjusted card height for mobile
//         boxSizing: 'border-box',
//         flexDirection: { xs: 'column', sm: 'row' }, // Stack on mobile, row on larger screens
//         overflow: 'hidden',
//       }}
//     >
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
//         <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', width: '60%' }}>
//           <Typography
//             variant="body2"
//             sx={{
//               color: '#7e84a3',
//               fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.85rem' }, // Minimized font size for all screens
//               overflow: 'hidden',
//               textOverflow: 'ellipsis',
//               cursor: 'pointer',
//               whiteSpace: 'nowrap',
//               textAlign: 'left',
//             }}
//             title={title}
//           >
//             {title}
//           </Typography>
//           <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
//             <Typography
//               variant="body2"
//               sx={{
//                 fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.85rem' }, // Minimized font size for sales
//               }}
//             >
//               {sales}/
//               <Typography
//                 variant="body2"
//                 sx={{
//                   color: '#7e84a3',
//                   fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.75rem' }, // Minimized font size for target
//                   ml: '1%',
//                 }}
//               >
//                {target}
//               </Typography>
//             </Typography>
//           </Box>
//         </Box>

//         <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
//           <Box
//             sx={{
//               backgroundColor: growth >= 0 ? '#01C572' : '#FF4C4C',
//               borderRadius: '10px',
//               width: '35px', // Smaller icon size
//               height: '35px', // Smaller icon size
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               color: '#fff',
//               mb: '1%',
//               background: istyle.background, // Random gradient
//             }}
//           >
//             {icon || <PeopleIcon sx={{ fontSize: '1.1rem' }} />} {/ Smaller icon /}
//           </Box>
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             <Typography
//               variant="body2"
//               sx={{
//                 color: growth >= 0 ? '#01C572' : '#FF4C4C',
//                 fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.75rem' }, // Minimized font size for growth
//                 mr: '1%',
//               }}
//             >
//               {growth >= 0 ? `+${growth}%` : `${growth}%`}
//             </Typography>
//             <Typography
//               variant="body2"
//               sx={{
//                 color: '#7e84a3',
//                 fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.75rem' }, // Minimized font size for arrow
//               }}
//             >
//               {growth >= 0 ? '↑' : '↓'}
//             </Typography>
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default SalesCard;
