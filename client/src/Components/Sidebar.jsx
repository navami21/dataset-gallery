import React, { useState } from "react";
import {
  LayoutDashboard,
  FolderPlus,
  Folder,
  UserPlus,
  FileBarChart,
  Menu,
  Sheet,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
// import LogoImg from "../assets/cropped-LOGO_ICTAK-Small.png";

const navItems = [
  { label: "Dashboard", icon: <LayoutDashboard />, to: "/admin/dashboard" },
  { label: "Category", icon: <Folder />, to: "/admin/category" },
  { label: "Add category", icon: <FolderPlus />, to: "/admin/category/add" },
  { label: "Data sets", icon: <Sheet />, to: "/admin/datasets" },
  { label: "Add user", icon: <UserPlus />, to: "/admin/users/add" },
  { label: "Activity logs", icon: <FileBarChart />, to: "/admin/activity" },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`h-screen bg-[#F6F6F6] shadow-2xl border-r border-gray-200 transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      } flex flex-col relative`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {/* <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <img
            src="/assets/LOGO.png"
            alt="Logo"
            className="h-8 w-8 object-contain flex-shrink-0"
          />
          {isOpen && (
            <span className="text-sm font-bold text-gray-700 truncate">
              ICTAK Dataset Gallery
            </span>
          )}
        </div> */}

        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
          <Menu />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 space-y-1 mt-6 relative">
        {navItems.map((item, idx) => (
          <div key={idx} className="relative group">
            <Link
              to={item.to}
              className="flex items-center space-x-4 px-4 py-3 hover:bg-blue-100 text-gray-700 transition"
            >
              <span className="text-black-700 semi-bold">{item.icon}</span>
              {isOpen && <span className="text-sm font-bold">{item.label}</span>}
            </Link>

            {/* Tooltip */}
            {!isOpen && (
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 bg-black text-white text-xs px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition z-20 whitespace-nowrap">
                {item.label}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <hr className="border-t border-gray-300 mx-4 mb-3" />
    <div className="p-4 text-gray-700 mt-auto">
  <div className="flex items-center gap-2">
    <ShieldCheck size={18} className="text-gray-700" />
    {isOpen && <span className="font-bold text-sm">Administrator</span>}
  </div>
</div>
    </div>
  );
};

export default Sidebar;
