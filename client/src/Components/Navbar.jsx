import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { LogOut, UserRound, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import axiosInstance from "../axiosinterceptor";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("logintoken");
    const userRole = localStorage.getItem("role");
    setIsLoggedIn(!!token);
    setRole(userRole);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // const handleLogout = () => {
  //   localStorage.removeItem("logintoken");
  //   localStorage.removeItem("role");
  //   setIsLoggedIn(false);
  //   setRole(null);
  //   navigate("/login");
  // };
  const handleLogout = async () => {
  try {
    // Send logout activity to backend
    await axiosInstance.post("/users/logout");

    // Clear local storage and UI state
    localStorage.removeItem("logintoken");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole(null);
    navigate("/login");
  } catch (err) {
    console.error("Error during logout:", err);
  }
};

  const commonLinks = (
    <>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/contact">Contact</Link>
    </>
  );

  const roleBasedLink = () => {
    switch (role) {
      case "admin":
        return <Link to="/admin/dashboard">Dashboard</Link>;
      case "user":
        return <Link to="/userdashboard">Dashboard</Link>;
      default:
        return null;
    }
  };

  const profileDropdown = (
    <div className="relative">
      <button
        onClick={() => setShowProfile(!showProfile)}
        className="flex items-center gap-1 border px-3 py-1 rounded-full hover:bg-gray-100"
      >
        <UserRound size={18} />
        Profile
        <ChevronDown size={16} />
      </button>

      {showProfile && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border rounded-md py-2 z-10">
          <Link
            to="/change-password"
            className="block px-4 py-2 text-sm hover:bg-gray-100"
            onClick={() => setShowProfile(false)}
          >
            Reset Password
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setShowProfile(false);
            }}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  );

  return (
    <nav className="bg-white shadow-lg px-6 py-4">
      <div className="max-w-9xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/assets/LOGO.png" alt="logo" className="h-10" />
          <h1 className="text-lg font-medium">ICTAK-Dataset Gallery</h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
          {commonLinks}
          {isLoggedIn && roleBasedLink()}
          {isLoggedIn ? profileDropdown : (
            <Link
              to="/login"
              className=" px-4 py-1  text-blue-500 hover:bg-blue-100"
            >
              <i className="fa fa-user mr-1" /> Log In
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col items-start gap-4 px-4 text-sm font-medium">
          {commonLinks}
          {isLoggedIn && roleBasedLink()}
          {isLoggedIn ? (
            <>
              <Link to="/change-password" onClick={toggleMenu}>
                Reset Password
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="text-red-500 border border-red-500 px-4 py-1 rounded-full"
              >
                <LogOut size={16} className="inline-block mr-1" />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={toggleMenu}
              className="border border-blue-500 px-4 py-1 rounded-full text-blue-500 hover:bg-blue-100"
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
