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
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { API_END_POINT_IMG } from "../../../constants/ApiConstant";

const NotificationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  // Get logged-in user's ID from localStorage
  const loginUser = JSON.parse(localStorage.getItem("user"));
  const loginUserID = loginUser?.id || null;
  const loginUserRole = loginUser?.role;

  // Redux state
  const { notifications, loading, error } = useSelector(
    (state) => state.notifications
  );

  // Fetch notifications on component mount
  useEffect(() => {
    if (loginUserID) {
      dispatch(fetchNotificationsStart(loginUserID));
    }
  }, [loginUserID, dispatch]);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(
        `${API_END_POINT}/month_notifications/notifications/read/${loginUserID}/${notificationId}`,
        { method: "PUT" }
      );

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      // Optimistic update in Redux (or trigger re-fetch)
      dispatch(fetchNotificationsStart(loginUserID));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Navigate based on type
  const handleNavigation = (type) => {
    switch (type) {
      case "announcement":
        navigate("/dashboard/announcement-member");
        break;
      case "order_request":
        const loginUser = JSON.parse(localStorage.getItem("user"));
        if (loginUser?.role === "Admin") {
          navigate("/dashboard/pending-orders");
        } else {
          navigate("/dashboard/pending-orders-member");
        }
        break;
      case "order_acceptReject":
        navigate("/dashboard/place-orders");
        break;
      case "document":
        navigate("/dashboard/documents-member");
        break;
      case "feedback":
        navigate("/dashboard/feedback");
        break;
      case "product":
        const loginUserForProduct = JSON.parse(localStorage.getItem("user"));
        if (loginUserForProduct?.role === "Customer") {
          navigate("/dashboard/book-orders");
        } else {
          navigate("/dashboard/members-products");
        }
        break;
      case "media_news":
        navigate("/dashboard/media-news");
        break;
      case "profile_edite_request":
        navigate("/dashboard/edit-request");
        break;
      case "profile_delete_request":
        navigate("/dashboard/delete-request");
        break;
      case "profile_edit_request_approved":
      case "profile_edit_request_rejected":
        navigate("/dashboard/profile");
        break;
      default:
        console.warn("Unknown notification type:", type);
        break;
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
          notifications
            .filter((notification) => {
              // Only include notifications of specific types
              const allowedTypes = ["media_news", "announcement", "document"];
              if (allowedTypes.includes(notification.detail?.type)) {
                return notification.detail?.receiver?.includes(loginUserRole);
              }
              return true; // Include other notifications without filtering
            })
            .map((notification) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  sx={styles.listItem(notification.is_read)}
                  onClick={() => {
                    if (!notification.is_read) markAsRead(notification.id);
                    handleNavigation(notification.detail?.type);
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        ...styles.avatar,
                        backgroundColor:
                          notification.detail?.type ===
                          "profile_edit_request_rejected"
                            ? "red"
                            : "green",
                      }}
                      src={
                        notification.detail?.type ===
                          "profile_delete_request" && notification.photo
                          ? `${API_END_POINT_IMG}/uploads/${notification.photo}`
                          : notification.photo
                          ? `${API_END_POINT_IMG}/uploads/notification-images/${notification.photo}`
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
                        {/* For Profile Edit Request */}
                        {notification.detail?.type ===
                          "profile_edite_request" && (
                          <>
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: "'Roboto', sans-serif",
                                color: "#666",
                              }}
                            >
                              Role: {notification.detail?.role}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: "'Roboto', sans-serif",
                                color: "#666",
                              }}
                            >
                              User: {notification.detail?.user_name}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: "'Roboto', sans-serif",
                                color: "#666",
                              }}
                            >
                              Reason: {notification.detail?.request_reason}
                            </Typography>
                          </>
                        )}

                        {notification.detail?.type ===
                          "profile_delete_request" && (
                          <>
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: "'Roboto', sans-serif",
                                color: "#666",
                              }}
                            >
                              Role: {notification.detail?.role}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: "'Roboto', sans-serif",
                                color: "#666",
                              }}
                            >
                              User: {notification.detail?.user_name}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: "'Roboto', sans-serif",
                                color: "#666",
                              }}
                            >
                              Reason: {notification.detail?.request_reason}
                            </Typography>
                          </>
                        )}

                        {/* For Feedback */}
                        {notification.detail?.type === "feedback" && (
                          <>
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: "'Roboto', sans-serif",
                                color: "#666",
                              }}
                            >
                              Feedback from: {notification.detail?.user_name}
                            </Typography>
                          </>
                        )}

                        {/* Media News */}
                        {notification.detail?.type === "media_news" && (
                          <>
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: "'Roboto', sans-serif",
                                color: "#1c96c5",
                              }}
                            >
                              <a
                                href={notification.detail?.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  textDecoration: "none",
                                  color: "#1c96c5",
                                }}
                              >
                                View Media / News
                              </a>
                            </Typography>
                          </>
                        )}

                        {/* Announcement */}
                        {notification.detail?.type === "announcement" && (
                          <>
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: "'Roboto', sans-serif",
                                color: "#1c96c5",
                              }}
                            >
                              <a
                                href={notification.detail?.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  textDecoration: "none",
                                  color: "#1c96c5",
                                }}
                              >
                                View Announcement
                              </a>
                            </Typography>
                          </>
                        )}

                        {/* Document */}
                        {notification.detail?.type === "document" && (
                          <>
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily:
                                  "'Roboto', sans-serif', color: '#1c96c5",
                              }}
                            >
                              <a
                                href={notification.detail?.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  textDecoration: "none",
                                  color: "#1c96c5",
                                }}
                              >
                                View Document
                              </a>
                            </Typography>
                          </>
                        )}

                        {notification.detail?.type === "order_acceptReject" && (
                          <>
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: "'Roboto', sans-serif",
                                color: "#666",
                              }}
                            >
                              {notification.detail?.role} | Status:{" "}
                              {notification.detail?.status}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: "'Roboto', sans-serif",
                                color: "#666",
                              }}
                            >
                              Order ID: {notification.detail?.orderUniqueId}
                            </Typography>
                          </>
                        )}
                        {/* For Order Request */}
                        {notification.detail?.type === "order_request" && (
                          <>
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: "'Roboto', sans-serif",
                                color: "#666",
                              }}
                            >
                              {notification.detail?.role} | Status:{" "}
                              {notification.detail?.status}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: "'Roboto', sans-serif",
                                color: "#666",
                              }}
                            >
                              Order ID: {notification.detail?.orderUniqueId}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: "'Roboto', sans-serif",
                                color: "#666",
                              }}
                            >
                              User: {notification.detail?.user_name}
                            </Typography>
                          </>
                        )}

                        {notification.detail?.type === "product" && (
                          <>
                            {notification.detail?.image && (
                              <img
                                src={`${API_END_POINT_IMG}/uploads/${notification.detail?.image}`}
                                alt="Product Image"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  objectFit: "cover",
                                  marginTop: "10px",
                                }}
                              />
                            )}
                          </>
                        )}

                        {/* Timestamp */}
                        <Typography
                          variant="caption"
                          sx={{
                            fontFamily: "'Roboto', sans-serif",
                            color: "#aaa",
                            display: "block",
                            mt: 0.5,
                          }}
                        >
                          {new Date(notification.created_at).toLocaleDateString(
                            "en-GB"
                          )}
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
