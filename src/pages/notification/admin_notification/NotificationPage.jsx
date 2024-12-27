import React, { useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  CircularProgress,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { fetchNotificationsStart } from "../../../redux/slices/notification-slice/notificationsSlice";
import { useSelector, useDispatch } from "react-redux";

const NotificationPage = () => {
  const dispatch = useDispatch();

  // Get logged-in user's ID from localStorage
  const loginUser = JSON.parse(localStorage.getItem("user"));
  const loginUserRole = loginUser?.id || null;

  // Redux state
  const { notifications, loading, error } = useSelector((state) => state.notifications);

  // Fetch notifications on component mount
  useEffect(() => {
    if (loginUserRole) {
      dispatch(fetchNotificationsStart(loginUserRole));
    }
  }, [loginUserRole, dispatch]);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(
        `http://88.222.245.236:3002/month_notifications/notifications/read/${loginUserRole}/${notificationId}`,
        { method: "PUT" }
      );

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      // Optimistic update in Redux (or trigger re-fetch)
      dispatch(fetchNotificationsStart(loginUserRole));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Styles
  const styles = {
    container: {
      mt: 4,
      p: 2,
      borderRadius: 2,
      backgroundColor: "#f9f9f9",
      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    },
    title: {
      fontWeight: 600,
      fontFamily: "'Roboto', sans-serif",
      color: "#333",
      mb: 3,
      textAlign: "center",
    },
    listItem: (isRead) => ({
      alignItems: "flex-start",
      p: 2,
      borderRadius: 3,
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      backgroundColor: isRead ? "#fff" : "#e3f9f9",
      "&:hover": {
        backgroundColor: isRead ? "#f4f4f4" : "#e3f9f9",
        boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
      },
      mb: 2,
    }),
    avatar: {
      color: "#fff",
      backgroundColor: "#00796b",
    },
  };

  // Render loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Typography
        variant="body1"
        sx={{
          fontFamily: "'Roboto', sans-serif",
          color: "#f00",
          textAlign: "center",
          mt: 4,
        }}
      >
        Failed to load notifications. Please try again later.
      </Typography>
    );
  }

  return (
    <Container maxWidth="md" sx={styles.container}>
      {/* Page Title */}
      <Typography variant="h4" sx={styles.title}>
        Notifications
      </Typography>

      {/* Notification List */}
      <List>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <React.Fragment key={notification.id}>
              <ListItem
                sx={styles.listItem(notification.is_read)}
                onClick={() => !notification.is_read && markAsRead(notification.id)}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={styles.avatar}
                    src={
                      notification.photo
                        ? `http://88.222.245.236:3002/uploads/notification-images/${notification.photo}`
                        : null
                    }
                  >
                    {!notification.photo && <NotificationsIcon />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 500, fontFamily: "'Roboto', sans-serif", color: "#444" }}
                    >
                      {notification.message}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: "'Roboto', sans-serif", color: "#666" }}
                      >
                        {notification.detail?.role} | Status: {notification.detail?.status}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: "'Roboto', sans-serif", color: "#666" }}
                      >
                        User: {notification.detail?.user_name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: "'Roboto', sans-serif",
                          color: "#aaa",
                          display: "block",
                          mt: 0.5,
                        }}
                      >
                        {new Date(notification.created_at).toLocaleString()}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))
        ) : (
          <Typography
            variant="body1"
            sx={{
              fontFamily: "'Roboto', sans-serif",
              color: "#666",
              textAlign: "center",
              mt: 2,
            }}
          >
            No notifications available.
          </Typography>
        )}
      </List>
    </Container>
  );
};

export default NotificationPage;
