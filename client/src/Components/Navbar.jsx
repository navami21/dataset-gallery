// import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("logintoken");
    const userRole = localStorage.getItem("role");
    setIsLoggedIn(!!token);
    setRole(userRole);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    localStorage.removeItem("logintoken");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole(null);
    navigate("/login");
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
        return <Link to="/admin/datasets/add">Add Datasets</Link>;
      case "user":
        return <Link to="/user/dashboard">Dashboard</Link>;
      default:
        return null;
    }
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/assets/LOGO.png" alt="logo" className="h-10" />
          <h1 className="text-lg font-medium">ICTAK-Dataset Gallery</h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {commonLinks}
          {isLoggedIn && roleBasedLink()}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-red-500 border border-red-500 px-4 py-1 rounded-full hover:bg-red-50"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="border border-blue-500 px-4 py-1 rounded-full text-blue-500 hover:bg-blue-100"
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
            <button
              onClick={() => {
                handleLogout();
                toggleMenu();
              }}
              className="text-red-500 border border-red-500 px-4 py-1 rounded-full"
            >
              Logout
            </button>
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
