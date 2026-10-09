import React, { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthCon } from './AuthFile/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, staggerItem, dropdownVariants } from './motion/Animated';

const MotionNavLink = motion(NavLink);

function Sidebar({ open = false, onClose = () => {} }) {
    const { user } = useContext(AuthCon);
    const [newsOpen, setNewsOpen] = useState(false);

    return (
        <>
            {/* Backdrop — only shown on mobile/tablet while the drawer is open */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        className="sidebar-backdrop d-lg-none"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    />
                )}
            </AnimatePresence>

            <div className={`sidebar ${open ? 'open' : ''}`}>
                <motion.ul
                    className="nav flex-column"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >

                    <MotionNavLink variants={staggerItem} onClick={onClose} to={"/"} className={({ isActive }) => `nav-item text-decoration-none ${isActive ? 'active' : ''}`}>Dashboard</MotionNavLink>
                    <MotionNavLink variants={staggerItem} onClick={onClose} to={"/manegment"} className={({ isActive }) => `nav-item text-decoration-none ${isActive ? 'active' : ''}`}>Management</MotionNavLink>
                    <MotionNavLink variants={staggerItem} onClick={onClose} to={"/Projects"} className={({ isActive }) => `nav-item text-decoration-none ${isActive ? 'active' : ''}`}>Projects</MotionNavLink>
                    <MotionNavLink variants={staggerItem} onClick={onClose} to={"/reports"} className={({ isActive }) => `nav-item text-decoration-none ${isActive ? 'active' : ''}`}>Reports</MotionNavLink>
                    {user?.role === "Admin" && (
                        <MotionNavLink variants={staggerItem} onClick={onClose} to={"/logspage"} className={({ isActive }) => `nav-item text-decoration-none ${isActive ? 'active' : ''}`}>Logs</MotionNavLink>
                    )}

                    {/* News Dropdown */}
                    <motion.li variants={staggerItem} className="nav-item dropdown ">
                        <div
                            className="nav-link d-flex justify-content-between align-items-center text-decoration-none p-0 fw-normal"
                            style={{ cursor: 'pointer' }}
                            onClick={() => setNewsOpen(!newsOpen)}
                        >
                            <span>News</span>
                            <i
                                className={`fa-solid fa-chevron-down text-white dropdown-arrow ${newsOpen ? 'open' : ''}`}
                            ></i>
                        </div>
                        <AnimatePresence>
                            {newsOpen && (
                                <motion.ul
                                    className="dropdown-menu show mt-3"
                                    variants={dropdownVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                >
                                    <li>
                                       <NavLink onClick={onClose} to={"/latestnews"} className={({ isActive }) => `nav-item text-decoration-none ${isActive ? 'active' : ''}`}>Latest News</NavLink>
                                    </li>
                                    <li>
                                        <NavLink onClick={onClose} to="/news/company" className="dropdown-item text-primary">Company News</NavLink>
                                    </li>
                                    <li>
                                        <NavLink onClick={onClose} to="/news/industry" className="dropdown-item text-primary">Industry Updates</NavLink>
                                    </li>
                                </motion.ul>
                            )}
                        </AnimatePresence>
                    </motion.li>

                    <MotionNavLink variants={staggerItem} onClick={onClose} to={"/Settings"} className={({ isActive }) => `nav-item text-decoration-none ${isActive ? 'active' : ''}`}>Settings</MotionNavLink>

                </motion.ul>
            </div>
        </>
    );
}

export default Sidebar;
