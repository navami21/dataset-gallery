
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

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
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link
            to="/login"
            className="border border-blue-500 px-4 py-1 rounded-full text-blue-500 hover:bg-blue-100 transition"
          >
            <i className="fa fa-user mr-1" /> Log In
          </Link>
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
          <Link to="/" onClick={toggleMenu}>Home</Link>
          <Link to="/about" onClick={toggleMenu}>About</Link>
          <Link to="/contact" onClick={toggleMenu}>Contact</Link>
          <Link
            to="/login"
            onClick={toggleMenu}
            className="border border-blue-500 px-4 py-1 rounded-full text-blue-500 hover:bg-blue-100 transition"
          >
            <i className="fa fa-user mr-1" /> Log In
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FiMenu, FiX } from "react-icons/fi";

// const Navbar = () => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [userRole, setUserRole] = useState(null); // 'admin' or 'user'
//   const navigate = useNavigate();

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (user) setUserRole(user.role); // assuming user has { role: 'admin' }
//   }, []);

//   const toggleMenu = () => setMenuOpen(!menuOpen);

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   return (
//     <nav className="bg-white shadow-md px-6 py-4">
//       <div className="max-w-7xl mx-auto flex justify-between items-center">
//         {/* Logo */}
//         <div className="flex items-center gap-2">
//           <img src="/assets/LOGO.png" alt="logo" className="h-10" />
//           <h1 className="text-xl font-semibold">ICTAK-Dataset Gallery</h1>
//         </div>

//         {/* Desktop Menu */}
//         <div className="hidden md:flex items-center gap-8 text-lg font-semibold">
//           {userRole === "admin" ? (
//             <>
//               <Link to="/">Home</Link>
//               <Link to="/add-dataset">Add Dataset</Link>
//               <button onClick={handleLogout}>Logout</button>
//             </>
//           ) : userRole === "user" ? (
//             <>
//               <Link to="/">Home</Link>
//               <Link to="/categories">Categories</Link>
//               <button onClick={handleLogout}>Logout</button>
//             </>
//           ) : (
//             <>
//               <Link to="/">Home</Link>
//               <Link to="/about">About</Link>
//               <Link to="/contact">Contact</Link>
//               <Link
//                 to="/login"
//                 className="border border-blue-500 px-4 py-1 rounded-full text-blue-500 hover:bg-blue-100 transition"
//               >
//                 <i className="fa fa-user mr-1" /> Log In
//               </Link>
//             </>
//           )}
//         </div>

//         {/* Mobile Hamburger */}
//         <div className="md:hidden">
//           <button onClick={toggleMenu}>
//             {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Dropdown Menu */}
//       {menuOpen && (
//         <div className="md:hidden mt-4 flex flex-col items-start gap-4 px-4 text-lg font-semibold">
//           {userRole === "admin" ? (
//             <>
//               <Link to="/" onClick={toggleMenu}>Home</Link>
//               <Link to="/add-dataset" onClick={toggleMenu}>Add Dataset</Link>
//               <button onClick={handleLogout}>Logout</button>
//             </>
//           ) : userRole === "user" ? (
//             <>
//               <Link to="/" onClick={toggleMenu}>Home</Link>
//               <Link to="/categories" onClick={toggleMenu}>Categories</Link>
//               <button onClick={handleLogout}>Logout</button>
//             </>
//           ) : (
//             <>
//               <Link to="/" onClick={toggleMenu}>Home</Link>
//               <Link to="/about" onClick={toggleMenu}>About</Link>
//               <Link to="/contact" onClick={toggleMenu}>Contact</Link>
//               <Link
//                 to="/login"
//                 onClick={toggleMenu}
//                 className="border border-blue-500 px-4 py-1 rounded-full text-blue-500 hover:bg-blue-100 transition"
//               >
//                 <i className="fa fa-user mr-1" /> Log In
//               </Link>
//             </>
//           )}
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;
