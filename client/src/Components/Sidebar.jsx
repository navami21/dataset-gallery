

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
  FilePlus,
  PackagePlus,
  MessageSquare,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { FaBriefcase } from "react-icons/fa";

const navItems = [
  { label: "Dashboard", icon: <LayoutDashboard size={30} />, to: "/admin/dashboard" },
  { label: "Category", icon: <Folder size={30} />, to: "/admin/category" },
  { label: "Add Category", icon: <FolderPlus size={30} />, to: "/admin/category/add" },
  { label: "Data Sets", icon: <Sheet size={30} />, to: "/admin/datasets" },
  { label: "Add Data Set", icon: <PackagePlus size={30} />, to: "/admin/datasets/add" },
  { label: "All Projects", icon: <FaBriefcase size={30} />, to: "/admin/projects" },
  { label: "Add Project", icon: <FilePlus size={30} />, to: "/admin/projects/add" },
  { label: "Add User", icon: <UserPlus size={30} />, to: "/admin/users/add" },
  { label: "User Messages", icon: <MessageSquare />, to: "/admin/messages" },
  { label: "Activity Logs", icon: <FileBarChart size={30} />, to: "/admin/user-activity" },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  return (
    <div
      className={`h-screen flex flex-col shadow-2xl border-r border-gray-200 transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #f3f4f6 100%)",
      }}
    >
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 border-b border-gray-200">
        {isOpen && (
          <div className="flex items-center gap-2 text-gray-600">
          <ShieldCheck size={18} />
          {isOpen && <span className="font-semibold text-lg">Administrator</span>}
        </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-600 hover:text-[#0099cc] transition"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto mt-4">
        {navItems.map((item, idx) => {
          const isActive = location.pathname === item.to;
          return (
            <div key={idx} className="relative group">
              <Link
                to={item.to}
                className={`flex items-center space-x-4 px-4 py-3 mx-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-[#0099cc] to-[#00b4d8]  text-white shadow-lg"
                    : "text-gray-700 hover:text-[#0099cc]"
                }`}
              >
                <span
                  className={`transition-transform duration-300 ${
                    isActive ? "text-white" : "text-gray-600 group-hover:text-[#0099cc]"
                  }`}
                >
                  {item.icon}
                </span>
                {isOpen && (
                  <span
                    className={`text-lg font-medium ${
                      isActive ? "text-white" : "text-gray-700 group-hover:text-[#0099cc]"
                    }`}
                  >
                    {item.label}
                  </span>
                )}
              </Link>

              {/* Tooltip */}
              {!isOpen && (
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 bg-gray-900 text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 shadow-md z-20 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
