// components/Sidebar.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Users, Calendar, FileText, Briefcase, LogOut } from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: <Home className="w-5 h-5" />, path: "/" },
  { label: "Clients", icon: <Users className="w-5 h-5" />, path: "/clients" },
  { label: "Jobs", icon: <Briefcase className="w-5 h-5" />, path: "/jobs" },
  { label: "Calendar", icon: <Calendar className="w-5 h-5" />, path: "/calendar" },
  { label: "Invoices", icon: <FileText className="w-5 h-5" />, path: "/invoices" }
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-green-800 text-white flex flex-col">
      <div className="text-2xl font-bold p-4 border-b border-green-700">LandFlow</div>
      <nav className="flex-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2 hover:bg-green-700 transition-colors ${
              location.pathname === item.path ? "bg-green-700" : ""\            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
      <button className="px-4 py-3 bg-green-700 hover:bg-green-600 text-left">Logout</button>
    </aside>
  );
};
