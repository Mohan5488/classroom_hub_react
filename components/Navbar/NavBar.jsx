import React, { useEffect, useState } from "react";
import { FaBarsStaggered, FaBookmark } from "react-icons/fa6";
import { IoMdLogIn } from "react-icons/io";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Logout from "@mui/icons-material/Logout";
import { NavLink, useNavigate } from "react-router-dom";
import "../Navbar/NavBar.css";
import { MdPassword } from "react-icons/md";

const NavBar = ({setCategory, setIsClick, setLoggedIn, isLoggedIn }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [bar, setBar] = useState(false);
  const open = Boolean(anchorEl);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const navigate = useNavigate();
  const user = localStorage.getItem('username');
  const name = localStorage.getItem('name');
  const token = localStorage.getItem("token");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotifClose = () => setNotifAnchorEl(null);

  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
      fetchNotifications();
    }
  },[]);

  const handleNavigation = (postId, category) => {
    navigate(`/posts/${category}/${postId}/`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setCategory(0)
    navigate("/");
  };
  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/notifications/", {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
    
      setNotifications(Array.isArray(data) ? data : []);
      setUnreadCount(data.filter((n) => !n.notification?.is_read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    }
  };
  

  const handleMarkAsRead = async () => {
    try {
      await fetch("http://localhost:8000/api/notifications/mark_as_read/", {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
      setUnreadCount(0);
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, notification: { ...n.notification, is_read: true } }))
      );
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const handleNavigate = ()=>{
    navigate('/profile')
  }


  return (
    <nav>
      <div className="logo">
        <FaBarsStaggered 
          className="bars" 
          onClick={() => setIsClick(prev => !prev)}
        />
        <img onClick={() => navigate('/dashboard')} style={{cursor:"pointer", width:"200px"}}  src="src/assets/logo-removebg-preview.png" alt="" />
      </div>

      {isLoggedIn ? (
        <div className="left">
          <Tooltip title="Notifications">
            <IconButton onClick={(e) => setNotifAnchorEl(e.currentTarget)}>
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Menu anchorEl={notifAnchorEl} open={Boolean(notifAnchorEl)} onClose={handleNotifClose}>
            {notifications.length === 0 ? (
              <MenuItem className="no-notifications">No new notifications</MenuItem>
            ) : (
              notifications.map((notif, index) => (
                <MenuItem key={index} onClick={handleNotifClose}>
                  <p
                    className={notif.notification.is_read ? "read-notification" : "unread-notification"}
                    onClick={() => handleNavigation(notif.post.id, notif.post.category)}
                  >
                    {notif.notification.message}
                  </p>
                </MenuItem>
              ))
            )}
            <Divider />
            <MenuItem onClick={handleMarkAsRead}>Mark all as read</MenuItem>
          </Menu>
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleClick}
              size="medium"
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleNavigate} >
              <Avatar /> My account
            </MenuItem>
            <Divider />
            
            <MenuItem onClick={()=> navigate('/saved')}>
              <ListItemIcon>
                <FaBookmark />
              </ListItemIcon>
              Saved Posts
            </MenuItem>
            <MenuItem onClick={()=> navigate('/change-password')}>
              <ListItemIcon>
              <MdPassword />
              </ListItemIcon>
              Change Password
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>

          <div className="details">
            <h3>{user || "Guest"}</h3>
            <p>{name || "Guest"}</p>
          </div>

          <div className="createBtn">
            <Tooltip title="Create new post">
              <NavLink to="/create-post">
                <IconButton style={{ border: '1px solid #ccc' }} size="medium">
                  <PersonAdd />
                </IconButton>
              </NavLink>
            </Tooltip>
          </div>

          
        </div>
      ) : (
        <NavLink className="loginBtn" to="/login">
  Login <IoMdLogIn className="icon" size={20} />
</NavLink>

      
      )}
    </nav>
  );
};

export default NavBar;
