import React, { useContext } from 'react';
import './App.css';
import { AuthCon } from './AuthFile/AuthContext';
import { motion, pageVariants } from './motion/Animated';

function Navbar({ onMenuClick }) {


  const { user, registeredUsers: loggedIn } = useContext(AuthCon);


  return (
    <motion.nav
      className="navbar navbar-expand-lg custom-navbar shadow-sm"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container-fluid">
        {/* Sidebar Toggle (mobile/tablet only) */}
        <button
          className="sidebar-toggle-btn d-lg-none me-2"
          type="button"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <i className="fa-solid fa-bars"></i>
        </button>

        {/* Brand / Logo */}
        <a className="navbar-brand fw-bold text-white fs-4" href="#">
          EMS
        </a>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler text-white"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">

            {/* Search Box */}
            <form className="d-flex ms-3 me-4" role="search">
              <input
                className="form-control search-input rounded-pill bg-white"
                type="search"
                placeholder="Search..."
                aria-label="Search"
              />
            </form>

            {/* Profile Section */}
            <li className="nav-item d-flex align-items-center">
              <div className="me-2 text-white text-end">
                <div className="fw-semibold">{user?.name}</div>
                <small className="text-light"> {user?.role}</small>
              </div>
              {loggedIn.map((data) => {
                if (data.authName === user?.name && data.authRole === user?.role) {
                  return (
                    <img
                      key={data.id}
                      src={data.profilePicture}
                      alt="profile"
                      className="rounded-circle border border-light profile-pic me-3"
                    />
                  )
                }
              }
              )

              }
            </li>
          </ul>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
