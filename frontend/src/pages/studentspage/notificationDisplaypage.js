import { useState, useEffect } from "react";
import axios from "axios";
import { Bell } from 'lucide-react'; // Assuming you're using lucide-react for icons
import '../../css/notification.css'

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);

  // Fetch notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        return;
      }
      
      const response = await axios.get("/api/v1/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // The backend adds an isRead property for each notification
      setNotifications(response.data);
      
      // Count unread notifications
      const unread = response.data.filter(notification => !notification.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mark a notification as read
  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      
      await axios.patch(`/api/v1/notifications/${notificationId}/read`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification._id === notificationId 
            ? { ...notification, isRead: true } 
            : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prevCount => Math.max(0, prevCount - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      
      await axios.patch("/api/v1/notifications/read-all", {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, isRead: true }))
      );
      
      // Reset unread count
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Toggle notification dropdown
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    
    // If opening the dropdown, fetch latest notifications
    if (!showDropdown) {
      fetchNotifications();
    }
  };

  // Close notification dropdown
  const closeDropdown = () => {
    setShowDropdown(false);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Toggle between showing all notifications or only unread
  const toggleShowAll = () => {
    setShowAllNotifications(!showAllNotifications);
  };

  // Get notifications to display based on filter
  const getDisplayedNotifications = () => {
    if (showAllNotifications) {
      return notifications;
    } else {
      return notifications.filter(notification => !notification.isRead);
    }
  };

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
    
    // Optional: Set up polling to check for new notifications
    const interval = setInterval(fetchNotifications, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      const container = document.querySelector('.notification-bell-container');
      if (container && !container.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const displayedNotifications = getDisplayedNotifications();

  return (
    <div className="notification-bell-container">
      <div className="notification-bell" onClick={toggleDropdown}>
        {/* Simple bell icon using emoji */}
        <div className="bell-icon">
          🔔
        </div>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </div>
      
      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            <div className="notification-actions">
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="mark-all-read">
                  Mark all as read
                </button>
              )}
              <button onClick={toggleShowAll} className="toggle-view">
                {showAllNotifications ? "Show unread only" : "Show all"}
              </button>
              <button onClick={closeDropdown} className="close-button" aria-label="Close">
                ✕
              </button>
            </div>
          </div>
          
          <div className="notification-list">
            {loading ? (
              <p className="notification-message">Loading notifications...</p>
            ) : displayedNotifications.length === 0 ? (
              <p className="notification-message">
                {showAllNotifications 
                  ? "No notifications" 
                  : "No unread notifications"}
              </p>
            ) : (
              displayedNotifications.map(notification => (
                <div 
                  key={notification._id} 
                  className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                  onClick={() => markAsRead(notification._id)}
                >
                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    <span className="notification-time">
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;