import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Construction, CalendarClock, Factory, BarChart2 } from 'lucide-react';
import './Layout.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Industry 4.1</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/users" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Users size={20} />
          <span>Users</span>
        </NavLink>
        <NavLink to="/machines" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Construction size={20} />
          <span>Machines</span>
        </NavLink>
        <NavLink to="/shifts" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <CalendarClock size={20} />
          <span>Shifts</span>
        </NavLink>
        <NavLink to="/production" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Factory size={20} />
          <span>Production</span>
        </NavLink>
        <NavLink to="/reports" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <BarChart2 size={20} />
          <span>Reports</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
