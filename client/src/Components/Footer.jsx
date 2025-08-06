import { Link, useNavigate } from "react-router-dom";
import { FaLinkedin, FaEnvelope, FaGlobe } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleNav = (path) => {
    if (token) {
      if (path === "/") {
        navigate(role === "admin" ? "/admin/dashboard" : "/userdashboard");
      } else {
        navigate(path);
      }
    } else {
      navigate(path);
    }
  };

  return (
    <footer className="animated-footer text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand */}
        <div className="flex flex-col items-start">
          {/* Logo */}
          <img 
            src="/assets/LOGO.png"
            alt="ICTAK LearnSphere Logo" 
            className="w-16 h-16 object-contain mb-2"
          />
          <h2 className="text-2xl font-bold">ICTAK LearnSphere</h2>
          <p className="mt-2 text-gray-200 text-sm">
            Explore curated datasets, alumni projects, and resources to enhance your learning journey.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-white-200 text-sm">
            {!token && (
              <>
                <li><button onClick={() => handleNav("/")} className=" font-semibold hover:text-white">Home</button></li>
                <li><button onClick={() => handleNav("/about")} className="font-semibold hover:text-white">About</button></li>
                <li><button onClick={() => handleNav("/contact")} className="font-semibold hover:text-white">Contact</button></li>
              </>
            )}

            {token && role === "admin" && (
              <>
                <li><Link to="/admin/dashboard" className="hover:text-white">Admin Dashboard</Link></li>
                <li><Link to="/admin/datasets" className="hover:text-white">Manage Datasets</Link></li>
              </>
            )}

            {token && role === "user" && (
              <>
                <li><Link to="/userdashboard" className="hover:text-white">My Dashboard</Link></li>
                <li><Link to="/category/all" className="hover:text-white">Browse Categories</Link></li>
              </>
            )}
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-bold mb-3">Connect with Us</h3>
          <div className="flex space-x-4">
            <a href="https://ictkerala.org/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
              <FaGlobe size={20} />
            </a>
            <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-white">
              <FaLinkedin size={20} />
            </a>
            <a href="mailto:info@ictkerala.org" className="text-gray-200 hover:text-white">
              <FaEnvelope size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-600 mt-6 pt-4 text-center text-gray-300 text-sm">
        © {new Date().getFullYear()} ICTAK LearnSphere. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
