import React, { useEffect, useState } from "react";
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
  Paper,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get the logged-in user's ID from localStorage
  const loginUser = JSON.parse(localStorage.getItem("user"));
  const loginUserRole = loginUser ? loginUser.id : null;

  // Fetch notifications from the API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `http://88.222.245.236:3002/month_notifications/notifications/${loginUserRole}`
        );
        if (response.ok) {
          const data = await response.json();
          setNotifications(data.notifications); // Set the notifications array
        } else {
          console.error("Failed to fetch notifications");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    if (loginUserRole) {
      fetchNotifications();
    }
  }, [loginUserRole]);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    const userId = loginUserRole;
    try {
      const response = await fetch(
        `http://88.222.245.236:3002/month_notifications/notifications/read/${userId}/${notificationId}`,
        {
          method: "PUT",
        }
      );
      if (response.ok) {
        // Update the notification state to reflect the read status
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.id === notificationId
              ? { ...notification, is_read: true }
              : notification
          )
        );
      } else {
        console.error("Failed to mark notification as read");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

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

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 4,
        p: 2,
        borderRadius: 2,
        backgroundColor: "#f9f9f9",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Page Title */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 600,
          fontFamily: "'Roboto', sans-serif",
          color: "#333",
          mb: 3,
          textAlign: "center",
        }}
      >
        Notifications
      </Typography>

      {/* Notification List */}
      <List>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <React.Fragment key={notification.id}>
              <ListItem
                sx={{
                  alignItems: "flex-start",
                  p: 2,
                  borderRadius: 3,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  backgroundColor: notification.is_read ? "#fff" : "#e3f9f9",
                  "&:hover": {
                    backgroundColor: notification.is_read ? "#f4f4f4" : "#e3f9f9",
                    boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
                  },
                  mb: 2, // Add some space between the items
                }}
                onClick={() => {
                  if (!notification.is_read) {
                    markAsRead(notification.id); // Mark as read on click
                  }
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      color: "#fff",
                      backgroundColor: "#00796b",
                    }}
                    src={`http://88.222.245.236:3002/uploads/notifiation-images/${notification.photo}`}
                    alt={notification.detail.user_name}
                  >
                    <NotificationsIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 500,
                        fontFamily: "'Roboto', sans-serif",
                        color: "#444",
                      }}
                    >
                      {notification.message}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "'Roboto', sans-serif",
                          color: "#666",
                        }}
                      >
                        {notification.detail?.role} | Status: {notification.detail?.status}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "'Roboto', sans-serif",
                          color: "#666",
                        }}
                      >
                        {/* Order ID: {notification.detail?.order_id} | User: {notification.detail?.user_name} */}
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
