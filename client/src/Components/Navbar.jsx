import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { LogOut, UserRound, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import axiosInstance from "../axiosinterceptor";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  // Get token + role on first load
  useEffect(() => {
    const token = localStorage.getItem("logintoken");
    const userRole = localStorage.getItem("role");
    setIsLoggedIn(!!token);
    setRole(userRole);
  }, []);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (isLoggedIn && role === "user") {
          const res = await axiosInstance.get("/contact/my-messages");
          // Only count replies that are unread
          const unreadCount = res.data.filter(
            (msg) => msg.reply && msg.reply.trim() !== "" && !msg.isRead
          ).length;
          setNotificationCount(unreadCount);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
  }, [isLoggedIn, role]);

  // When visiting /notifications, mark as read
  useEffect(() => {
    const markAsRead = async () => {
      if (location.pathname === "/notifications" && isLoggedIn && role === "user") {
        try {
          await axiosInstance.put("/contact/mark-read");
          setNotificationCount(0); 
        } catch (err) {
          console.error("Error marking notifications as read:", err);
        }
      }
    };
    markAsRead();
  }, [location.pathname, isLoggedIn, role]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/users/logout");
      localStorage.removeItem("logintoken");
      localStorage.removeItem("role");
      setIsLoggedIn(false);
      setRole(null);
      navigate("/login");
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  const publicLinks = (
    <>
      <Link to="/" className="hover:text-blue-500 transition">Home</Link>
      <Link to="/about" className="hover:text-blue-500 transition">About</Link>
      <Link to="/contact" className="hover:text-blue-500 transition">Contact</Link>
    </>
  );

  const sharedLinks = (
    <>
    </>
  );

  const roleBasedLink = () => {
    if (role === "admin") {
      return<> <Link to="/admin/dashboard" className="hover:text-blue-500 transition">Dashboard</Link>
              <Link to="/admin/user-activity" className="hover:text-blue-500 transition">Activity Logs</Link>
      </> 
    }
    if (role === "user") {
      return (
        <>
          <Link to="/userdashboard" className="hover:text-blue-500 transition">Dashboard</Link>
          <Link to="/category/all" className="hover:text-blue-500 transition">Category</Link>
          <Link to="/contact" className="hover:text-blue-500 transition">Contact</Link>
          <Link to="/notifications" className="relative hover:text-blue-500 transition">
            Notifications
            {notificationCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {notificationCount}
              </span>
            )}
          </Link>
        </>
      );
    }
    return null;
  };

 const profileDropdown = (
  <div className="relative">
    <button
      onClick={() => setShowProfile(!showProfile)}
      className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#0099cc] text-[#0099cc] 
                 hover:bg-gradient-to-r from-[#0099cc] to-[#00b4d8] hover:text-white 
                 transition-colors duration-300 ease-in-out hover:scale-105"
    >
      <UserRound size={16} /> 
      <span className="text-sm md:text-base font-medium">Profile</span> {/* smaller text */}
      <ChevronDown size={16} /> 
    </button>
    {showProfile && (
      <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border rounded-lg py-2 z-10">
        <Link
          to="/change-password"
          className="block px-4 py-2 text-sm hover:bg-blue-50 hover:text-[#0099cc] transition"
          onClick={() => setShowProfile(false)}
        >
          Reset Password
        </Link>
        <button
          onClick={() => {
            handleLogout();
            setShowProfile(false);
          }}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition"
        >
          <LogOut size={14} /> {/* smaller logout icon */}
          Logout
        </button>
      </div>
    )}
  </div>
);


  return (
    <nav className="bg-white shadow-md py-3 sticky top-0 z-50 border-b border-gray-100">
      <div className="px-4 md:px-6 max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/assets/LOGO_ICTAK-ENG-Black-Text.png" alt="logo" className="h-10" />
          
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          {isLoggedIn ? sharedLinks : publicLinks}
          {isLoggedIn && roleBasedLink()}
          {isLoggedIn ? profileDropdown : (
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#0099cc] text-[#0099cc] hover:bg-gradient-to-r from-[#0099cc] to-[#00b4d8] hover:text-white transition-colors duration-300"
            >
              <UserRound size={18} />
              <span>Log In</span>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-700">
            {menuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col items-start gap-4 px-4 font-semibold text-gray-700">
          {isLoggedIn ? sharedLinks : publicLinks}
          {isLoggedIn && roleBasedLink()}
          {isLoggedIn ? (
            <>
              <Link to="/change-password" onClick={toggleMenu} className="hover:text-blue-500 transition">
                Reset Password
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="flex items-center gap-2 text-red-500 border border-red-500 px-4 py-1 rounded-full hover:bg-red-50 transition"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={toggleMenu}
              className="border border-blue-500 px-4 py-1 rounded-full text-blue-500 hover:bg-blue-500 hover:text-white transition"
            >
              <i className="fa fa-user mr-1" /> Log In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
