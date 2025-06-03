// components/Sidebar.tsx
import React from "react";
import { Link } from "react-router-dom";

export const Sidebar = () => (
  <div className="w-64 bg-green-100 min-h-screen p-4">
    <h2 className="text-xl font-bold mb-4">Landflow</h2>
    <ul className="space-y-2">
      <li><Link to="/clients" className="block hover:text-green-700">Clients</Link></li>
      <li><Link to="/jobs" className="block hover:text-green-700">Jobs</Link></li>
      <li><Link to="/invoices" className="block hover:text-green-700">Invoices</Link></li>
    </ul>
  </div>
);