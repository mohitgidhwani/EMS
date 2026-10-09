import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

// Wraps every authenticated page with the Navbar + Sidebar chrome.
// Register/Login render outside this layout as standalone pages.
function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Navbar onMenuClick={() => setSidebarOpen((o) => !o)}></Navbar>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)}></Sidebar>
      <Outlet />
    </>
  );
}

export default Layout;
