import React, { useEffect, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import Collapse from "@mui/material/Collapse";
import "./AdminDashboard.scss";
import ProductIcon from "@mui/icons-material/Store";
import MembersIcon from "@mui/icons-material/Group";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { Avatar, Badge } from "@mui/material";
import { signOut } from "../../redux/slices/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsersRequest } from "../../redux/slices/user-profile-slice/UserGetSlice";
import { FaCodePullRequest } from "react-icons/fa6";
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import DescriptionIcon from '@mui/icons-material/Description';
import EditNoteIcon from '@mui/icons-material/EditNote'; // If you want an edit note icon
import NotificationsIcon from '@mui/icons-material/Notifications'; // Bell style icon
import TrackChangesIcon from '@mui/icons-material/TrackChanges'; // Target icon
import GroupsIcon from '@mui/icons-material/Groups'; // Represents a community or club
import CategoryIcon from '@mui/icons-material/Category'; // Icon for categories
import BusinessIcon from '@mui/icons-material/Business'; // Business sector
import TimerIcon from '@mui/icons-material/Timer'; // Specific timer icon
import { FaUserTie } from 'react-icons/fa';  // FontAwesome Role Icon (Professional Role)
import { RiFeedbackFill } from "react-icons/ri";
import { BiBook } from "react-icons/bi";
import { FaBook } from "react-icons/fa";
import { FaHeadset } from 'react-icons/fa';
// import HomeIcon from "@mui/icons-material/Home";
import { Home as HomeIcon } from '@mui/icons-material'; // Import the HomeIcon from MUI
import { FaShoppingCart, FaCheckCircle } from 'react-icons/fa'; // Importing shopping cart icon
import ReportIcon from "@mui/icons-material/Assessment";
import { fetchNotificationsStart } from "../../redux/slices/notification-slice/notificationsSlice";
import { API_END_POINT_IMG } from "../../constants/ApiConstant";
import AppLogo from "../../assets/logo/AppLogo";
import NewLogo from "../../assets/logo/NewLogo.png";
import DishaImgLogo from "../../assets/logo/DishaImgLogo.png";
import "./Style.css"
// Drawer width
// const drawerWidth = 240;
const drawerWidth = 300;

// Mixin for opened Drawer
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  backgroundColor: "#F1F3FF",
});

// Mixin for closed Drawer
const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: "#F1F3FF",
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

// Styled DrawerHeader
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

// Styled AppBar
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: "#F1F3FF",
  boxShadow: "none",
  padding: "0 16px",
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

// Styled Drawer
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

// Main AdminDashboard component
export default function AdminDashboard() {
  const theme = useTheme();
  const matches = useMediaQuery("(min-width:600px)");
  const [open, setOpen] = React.useState(matches);
  const [openExpand, setOpenExpand] = React.useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);
  // console.log("users", users);
  const [selectedImage, setSelectedImage] = useState(""); // Initialize the selectedImage state
  const [showProfile, setShowProfile] = useState(false); // Add this line
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  useEffect(() => {
    dispatch(fetchUsersRequest());
  }, [dispatch]);
  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(signOut());
    navigate('/signin');
  };

  React.useEffect(() => {
    setOpen(matches);
  }, [matches]);

  React.useEffect(() => {
    // Automatically expand the menu item that matches the current route
    const path = location.pathname;
    const defaultExpand = menuItems.find(
      (item) =>
        item.subItems && item.subItems.some((subItem) => subItem.path === path)
    );
    if (defaultExpand) {
      setOpenExpand((prev) => ({
        ...prev,
        [defaultExpand.text]: true,
      }));
    }
  }, [location.pathname]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleAvatarClick = () => {
    navigate("/dashboard/profile");
    setShowProfile(!showProfile); // Toggle profile visibility
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClick = (text) => {
    setOpenExpand((prev) => ({
      ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
      [text]: !prev[text],
    }));

    // Determine which menu array to use based on the role
    const selectedMenu = loginUserRole === "Admin"
      ? menuItems
      : loginUserRole === "Customer"
        ? customermenuItems
        : menuItemsUsers;

    // Navigate to the default route of the selected item
    const selectedItem = selectedMenu.find((item) => item.text === text);
    if (selectedItem && selectedItem.subItems) {
      const defaultSubItem = selectedItem.subItems.find((sub) => sub.default);
      if (defaultSubItem) {
        navigate(defaultSubItem.path);
      }
    } else if (selectedItem) {
      navigate(selectedItem.path);
    }
  };

  const imageBaseURL = `${API_END_POINT_IMG}/uploads/`;

  // Set the selected image to the existing image if present
  useEffect(() => {
    if (users?.image) {
      const imageUrl = users.image.includes("http")
        ? users.image
        : `${imageBaseURL}${users.image}`;
      setSelectedImage(imageUrl);
    }
  }, [users]);
  const handleItemClick = (path) => {
    navigate(path);
  };

  let loginUser = JSON.parse(localStorage.getItem('user'));
  let loginUserRole = loginUser ? loginUser.role : null;




  /////**********Notification count Logics***********/////

  const loginUserID = loginUser ? loginUser.id : null;

  const handleNotificationClick = () => {
    navigate('/dashboard/notification')
  };


  // Fetch notifications using Redux
  const { notifications, loading, error } = useSelector(
    (state) => state.notifications
  );


  useEffect(() => {
    if (loginUserRole) {
      dispatch(fetchNotificationsStart(loginUserID));
    }
  }, [loginUserRole, dispatch]);

  // Calculate unread notifications count
  const unreadCount = notifications.filter((notification) => !notification.is_read).length;





  const customermenuItems = [

    {
      text: "Book Order",
      path: "/dashboard/book-orders",
      icon: <FaShoppingCart />,
    },
    {
      text: "My Orders",
      path: "/dashboard/place-orders",
      icon: <FaCheckCircle />,
    },
    {
      text: "Announcements",
      path: "/dashboard/announcement-member",
      icon: <NotificationsIcon />,
    },

    {
      text: "Downloads",
      path: "/dashboard/documents-member",
      icon: <DescriptionIcon />,
    },
    {
      text: "Customer Support",
      path: "/dashboard/customer-support",
      icon: <FaHeadset />,
    },
  ]


  const menuItemsUsers = [
    {
      text: "HomePage",
      path: "/dashboard",
      icon: <HomeIcon />,
    },
    {
      text: "Products",
      path: "/dashboard/members-products",
      icon: <ProductIcon />,
    },

    {
      text: "Members",
      path: "/dashboard/members",
      icon: <MembersIcon />,
    },
    {
      text: "Requested Orders",
      path: "/dashboard/pending-orders-member",
      icon: <PendingActionsIcon />,
    },
    {
      text: "Book Order",
      path: "/dashboard/book-orders",
      icon: <FaShoppingCart />,
    },
    {
      text: "My Orders",
      path: "/dashboard/place-orders",
      icon: <FaCheckCircle />,
    },
    {
      text: "Feedback",
      path: "/dashboard/feedback",
      icon: <RiFeedbackFill />,
    },
    {
      text: "Announcements",
      path: "/dashboard/announcement-member",
      icon: <NotificationsIcon />,
    },

    {
      text: "Downloads",
      path: "/dashboard/documents-member",
      icon: <DescriptionIcon />,
    },
    {
      text: "Member Reports",
      path: "/dashboard/report",
      icon: <ReportIcon />,

    },
    {
      text: "My Report",
      path: "/dashboard/targets",
      icon: <TrackChangesIcon />,
    },
  ]
  const menuItems = [
    {
      text: "HomePage",
      path: "/dashboard",
      icon: <HomeIcon />,
    },
    {
      text: "Products",
      path: "/dashboard/products",
      icon: <ProductIcon />,
    },
    {
      text: "Members",
      path: "/dashboard/members",
      icon: <MembersIcon />,
    },
    {
      text: "Orders",
      path: "/dashboard/pending-orders",
      icon: <FaShoppingCart />,
    },
    {
      text: "Feedback",
      path: "/dashboard/feedback",
      icon: <RiFeedbackFill />,
    },
    {
      text: "Announcements",
      path: "/dashboard/announcement",
      icon: <NotificationsIcon />,
    },

    {
      text: "Downloads",
      path: "/dashboard/documents",
      icon: <DescriptionIcon />,
    },
    {
      text: "Member Reports",
      path: "/dashboard/report",
      icon: <ReportIcon />,

    },
    {
      text: "Requests",
      icon: <FaCodePullRequest />,
      subItems: [
        {
          text: "Edit Request",
          path: "/dashboard/edit-request",
          default: true,
          icon: <EditNoteIcon />,
        },
      ],
    },
    {
      text: "Masters",
      icon: <AdminPanelSettingsIcon />,
      subItems: [,
        // {
        //   text: "Sales Target",
        //   path: "/dashboard/sales-target",
        //   icon: <TrackChangesIcon />,
        // },
        {
          text: "Sales/Target",
          path: "/dashboard/sales-target-form",
          icon: <TrackChangesIcon />,
        },
        { text: "Club", path: "/dashboard/club", icon: <GroupsIcon /> },
        { text: "Category", path: "/dashboard/category", icon: <CategoryIcon /> },
        {
          text: "Sector",
          path: "/dashboard/sector",
          icon: <BusinessIcon />,
        },
        { text: "Roles", path: "/dashboard/role", icon: <FaUserTie /> },
        {
          text: "Set Time",
          path: "/dashboard/orders_time_set",
          icon: <TimerIcon />,
        },
      ],
    },
  ];

  ///
  // const MenuItem = ({
  //   item,
  //   openExpand,
  //   handleClick,
  //   handleItemClick,
  //   location,
  // }) => (
  //   <React.Fragment>
  //     <ListItem
  //       disablePadding
  //       sx={{
  //         "&:hover": { backgroundColor: "transparent" },
  //         ...(openExpand[item.text]
  //           ? {
  //             background: "linear-gradient(90deg, #01C572 0%, #187E53 100%)",
  //             color: "#000",
  //             borderRadius: "4px 4px 0 0",
  //           }
  //           : {}),
  //       }}
  //     >
  //       <ListItemButton
  //         onClick={() => handleClick(item.text)}
  //         sx={{ width: "100%", pl: 2 }}
  //       >
  //         <ListItemIcon
  //           sx={{
  //             color:
  //               location.pathname === item.path || openExpand[item.text]
  //                 ? "#000"
  //                 : "#000",
  //           }}
  //         >
  //           {item.icon}
  //         </ListItemIcon>
  //         <ListItemText primary={item.text} />
  //         {item.subItems ? (
  //           openExpand[item.text] ? (
  //             <ExpandLess />
  //           ) : (
  //             <ExpandMore />
  //           )
  //         ) : null}
  //       </ListItemButton>
  //     </ListItem>
  //     {item.subItems && (
  //       <Collapse in={openExpand[item.text]} timeout="auto" unmountOnExit>
  //         <List
  //           component="div"
  //           disablePadding
  //           sx={{
  //             background: "linear-gradient(90deg, #01C572 0%, #187E53 100%)",
  //             borderRadius: "0 0 4px 4px",
  //           }}
  //         >
  //           {item.subItems.map((subItem) => (
  //             <ListItem
  //               key={subItem.text}
  //               disablePadding
  //               sx={{ px: 4, py: 0.5 }}
  //             >
  //               <ListItemButton
  //                 selected={location.pathname === subItem.path}
  //                 onClick={() => handleItemClick(subItem.path)}
  //                 sx={{
  //                   height: "38px",
  //                   "&:hover": { backgroundColor: "rgba(1, 197, 114, 0.2)" }, // Add hover effect
  //                   "&.Mui-selected": {
  //                     background: "#fff",
  //                     color: "green",
  //                     borderRadius: "4px",
  //                   },
  //                   "&:not(.Mui-selected)": {
  //                     color: "#000", // Clear text color for unselected items
  //                     backgroundColor: "transparent", // Clear background
  //                   },
  //                 }}
  //               >
  //                 <ListItemIcon
  //                   sx={{
  //                     color:
  //                       location.pathname === subItem.path ? "#000" : "#000",
  //                   }}
  //                 >
  //                   {subItem.icon}
  //                 </ListItemIcon>
  //                 <ListItemText
  //                   primary={subItem.text}
  //                   sx={{
  //                     fontFamily: "Inter",
  //                     fontWeight: 500,
  //                     fontSize: "16px",
  //                     color:
  //                       location.pathname === subItem.path ? "#000" : "#2a2a2a", // Adjust text color for selected state
  //                   }}
  //                 />
  //               </ListItemButton>
  //             </ListItem>
  //           ))}
  //         </List>
  //       </Collapse>
  //     )}
  //   </React.Fragment>
  // );

  const MenuItem = ({
    item,
    openExpand,
    handleClick,
    handleItemClick,
    location,
  }) => {
    const isActive = location.pathname === item.path; // Active if exact path matches
    const isParentActive =
      item.subItems && item.subItems.some((sub) => location.pathname === sub.path); 
  
    return (
      <React.Fragment>
        {/* Main Menu Item */}
        <ListItem
          disablePadding
          sx={{
            "&:hover": { backgroundColor: "transparent" },
            ...(isActive || isParentActive || openExpand[item.text]
              ? {
                  background: "linear-gradient(90deg, #01C572 0%, #187E53 100%)",
                  color: "#000",
                  borderRadius: "4px 4px 0 0",
                }
              : {}),
          }}
        >
          <ListItemButton
            onClick={() => handleClick(item.text)}
            sx={{ width: "100%", pl: 2 }}
          >
            <ListItemIcon
              sx={{
                color:
                  isActive || isParentActive || openExpand[item.text]
                    ? "#000"
                    : "#000",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
            {item.subItems ? (
              openExpand[item.text] ? <ExpandLess /> : <ExpandMore />
            ) : null}
          </ListItemButton>
        </ListItem>
  
        {/* Submenu Items */}
        {item.subItems && (
          <Collapse in={openExpand[item.text]} timeout="auto" unmountOnExit>
            <List
              component="div"
              disablePadding
              sx={{
                background: "linear-gradient(90deg, #01C572 0%, #187E53 100%)",
                borderRadius: "0 0 4px 4px",
              }}
            >
              {item.subItems.map((subItem) => (
                <ListItem
                  key={subItem.text}
                  disablePadding
                  sx={{ px: 4, py: 0.5 }}
                >
                  <ListItemButton
                    selected={location.pathname === subItem.path}
                    onClick={() => handleItemClick(subItem.path)}
                    sx={{
                      height: "38px",
                      "&:hover": { backgroundColor: "rgba(1, 197, 114, 0.2)" }, // Hover effect
                      "&.Mui-selected": {
                        background: "#fff",
                        color: "green",
                        borderRadius: "4px",
                      },
                      "&:not(.Mui-selected)": {
                        color: "#000",
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color:
                          location.pathname === subItem.path ? "#000" : "#000",
                      }}
                    >
                      {subItem.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={subItem.text}
                      sx={{
                        fontFamily: "Inter",
                        fontWeight: 500,
                        fontSize: "16px",
                        color:
                          location.pathname === subItem.path ? "#000" : "#2a2a2a",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };


  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="black"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, color: "#989FA9" }}
          >
            {loginUserRole === "Admin" ? "Admin Dashboard" : "User Dashboard"}
          </Typography>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Avatar */}
            <Avatar
              alt="Profile Picture"
              src={selectedImage}
              onClick={handleAvatarClick}
              style={{
                cursor: "pointer",
                width: 40,
                height: 40, // Consistent size
              }}
            />

            {/* User Name */}
            <Typography
              variant="body1"
              sx={{
                color: "#989FA9",
                fontWeight: 500,
                fontSize: "1rem", // Adjusted font size for better visibility
              }}
            >
              {users?.full_name}
            </Typography>

            {/* Notifications Icon */}
            <IconButton
              onClick={handleNotificationClick}
            >
              <Badge
                badgeContent={unreadCount > 0 ? unreadCount : null}
                color="primary"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: "0.8rem", // Smaller badge size
                    backgroundColor: "#d32f2f", // Red badge
                    color: "white", // White text in the badge
                  },
                }}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* Logout */}
            <Typography
              variant="body2"
              onClick={handleLogout}
              sx={{
                cursor: "pointer",
                color: "#d32f2f", // Red color for logout
                fontWeight: 500,
                "&:hover": {
                  textDecoration: "underline", // Hover effect for better UX
                },
              }}
            >
              Logout
            </Typography>
          </div>


        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
        <Box
  sx={{
    display: "flex",
    justifyContent: "space-between", // Ensure images are spaced out evenly
    alignItems: "center",
    width: "100%",
  }}
>
  <Box>
    <img
      src={DishaImgLogo}
      alt="Login"
      style={{
        width: "115px", // Set the same width for both images
        height: "50px", // Set the same height for both images
        borderRadius: "8px",
        objectFit: "contain", // Ensures images don't get distorted
      }}
    />
  </Box>
  <Box>
    <img
      src={NewLogo}
      alt="Login"
      style={{
        width: "130px", // Set the same width for both images
        height: "50px", // Set the same height for both images
        borderRadius: "8px",
        objectFit: "contain", // Ensures images don't get distorted
      }}
    />
  </Box>
</Box>

          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <List sx={{ padding: '15px' }}>

          {/* {menuItems.map((item) => (
            <MenuItem
              key={item.text}
              item={item}
              openExpand={openExpand}
              handleClick={handleClick}
              handleItemClick={handleItemClick}
              location={location}
            />
          ))} */}

          {loginUserRole === 'Admin' ? (
            menuItems.map((item) => (
              <MenuItem
                key={item.text}
                item={item}
                openExpand={openExpand}
                handleClick={handleClick}
                handleItemClick={handleItemClick}
                location={location}
              />
            ))
          ) : loginUserRole === 'Customer' ? (
            customermenuItems.map((item) => (
              <MenuItem
                key={item.text}
                item={item}
                openExpand={openExpand}
                handleClick={handleClick}
                handleItemClick={handleItemClick}
                location={location}
              />
            ))
          ) : (
            menuItemsUsers.map((item) => (
              <MenuItem
                key={item.text}
                item={item}
                openExpand={openExpand}
                handleClick={handleClick}
                handleItemClick={handleItemClick}
                location={location}
              />
            ))
          )}




        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}
///
