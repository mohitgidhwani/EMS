import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthCon } from '../AuthFile/AuthContext';
import { ThemeCon } from '../ThemeContext';
import { motion, AnimatePresence, pageVariants, staggerContainer, staggerItem, dropdownVariants } from '../motion/Animated';

const THEME_INFO = {
    blue: { name: "Blue", color: "#3E6B8A" },
    purple: { name: "Purple", color: "#7B4B6B" },
    green: { name: "Green", color: "#4C7A4E" },
    red: { name: "Red", color: "#A8432E" },
    orange: { name: "Orange", color: "#C1652E" },
    pink: { name: "Pink", color: "#B25C6B" }
};

const Settings = () => {
    const { user, setUser, registeredUsers: loggedIn, refreshRegisteredUsers } = useContext(AuthCon);
    const { theme, toggleTheme, colorTheme, setColorTheme } = useContext(ThemeCon);
    const navigate = useNavigate();

    const [showColorDropdown, setShowColorDropdown] = useState(false);

    // Profile form
    const [profileForm, setProfileForm] = useState({ authName: "", email: "", country: "", age: "", gender: "" });
    const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });
    const [savingProfile, setSavingProfile] = useState(false);

    // Password form
    const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [pwMsg, setPwMsg] = useState({ type: "", text: "" });
    const [savingPw, setSavingPw] = useState(false);

    // Admin-only one-off maintenance: shrink profile pictures that were
    // uploaded before the resize-on-upload fix and are still full-size in the DB.
    const [compressing, setCompressing] = useState(false);
    const [compressMsg, setCompressMsg] = useState({ type: "", text: "" });

    const handleCompressImages = async () => {
        setCompressMsg({ type: "", text: "" });
        setCompressing(true);
        try {
            const res = await axios.post("https://localhost:7238/api/Auth/CompressExistingProfilePictures", {}, { withCredentials: true });
            setCompressMsg({ type: "success", text: res.data?.message || "Done." });
            refreshRegisteredUsers();
        } catch (err) {
            setCompressMsg({ type: "danger", text: err?.response?.data || "Failed to compress images." });
        } finally {
            setCompressing(false);
        }
    };

    useEffect(() => {
        const current = loggedIn.find((d) => d.authName === user?.name && d.authRole === user?.role);
        if (current) {
            setProfileForm({
                authName: current.authName || "",
                email: current.email || "",
                country: current.country || "",
                age: current.age ?? "",
                gender: current.gender || ""
            });
        }
    }, [loggedIn, user]);

    const handleColorThemeChange = (color) => {
        setColorTheme(color);
        setShowColorDropdown(false);
    };

    const handleLogout = () => {
        axios.post("https://localhost:7238/api/Auth/Logout", {}, { withCredentials: true })
            .then(() => {
                setUser(null);
                navigate("/login");
            })
            .catch((err) => console.error("Logout failed:", err));
    };

    const handleProfileChange = (e) => {
        setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    };

    const handleProfileSave = async () => {
        setProfileMsg({ type: "", text: "" });
        setSavingProfile(true);
        try {
            const res = await axios.put("https://localhost:7238/api/Auth/UpdateProfile", {
                authName: profileForm.authName,
                email: profileForm.email,
                country: profileForm.country,
                age: profileForm.age === "" ? null : Number(profileForm.age),
                gender: profileForm.gender
            }, { withCredentials: true });

            setProfileMsg({ type: "success", text: "Profile updated successfully." });
            refreshRegisteredUsers();

            // Username may have changed — refresh the session so the navbar/sidebar reflect it.
            if (res.data?.name && res.data.name !== user?.name) {
                const me = await axios.get("https://localhost:7238/api/Auth/LoggedInUser", { withCredentials: true });
                setUser(me.data);
            }
        } catch (err) {
            setProfileMsg({ type: "danger", text: err?.response?.data || "Failed to update profile." });
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePwChange = (e) => {
        setPwForm({ ...pwForm, [e.target.name]: e.target.value });
    };

    const handlePwSave = async () => {
        setPwMsg({ type: "", text: "" });

        if (!pwForm.currentPassword || !pwForm.newPassword) {
            setPwMsg({ type: "danger", text: "Please fill in both password fields." });
            return;
        }
        if (pwForm.newPassword !== pwForm.confirmPassword) {
            setPwMsg({ type: "danger", text: "New password and confirmation do not match." });
            return;
        }
        if (pwForm.newPassword.length < 6) {
            setPwMsg({ type: "danger", text: "New password must be at least 6 characters." });
            return;
        }

        setSavingPw(true);
        try {
            await axios.put("https://localhost:7238/api/Auth/ChangePassword", {
                currentPassword: pwForm.currentPassword,
                newPassword: pwForm.newPassword
            }, { withCredentials: true });

            setPwMsg({ type: "success", text: "Password changed successfully." });
            setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            setPwMsg({ type: "danger", text: err?.response?.data || "Failed to change password." });
        } finally {
            setSavingPw(false);
        }
    };

    const currentTheme = THEME_INFO[colorTheme] || THEME_INFO.blue;

    return (
        <motion.div className="main-content" variants={pageVariants} initial="hidden" animate="visible">
            <h1 className="mb-4 text-primary">Settings</h1>

            <motion.div className="row g-4" variants={staggerContainer} initial="hidden" animate="visible">
                {/* Left Panel - User Identity Card */}
                {user && loggedIn.map((data) => (
                    data.authName === user.name && data.authRole === user.role && (
                        <motion.div className="col-md-4" key={data.id} variants={staggerItem}>
                            <div className="card shadow-sm p-4 rounded-4 text-center h-100 d-flex flex-column justify-content-center">
                                <img
                                    src={data.profilePicture}
                                    alt="Profile"
                                    className="profile-img mb-3 d-block m-auto setting-profile-img"
                                />
                                <h5 className="fw-semibold mb-1">{user.name}</h5>
                                <p className="text-secondary mb-3">{user.role}</p>

                                <button
                                    className="btn btn-outline-danger rounded-pill w-100"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        </motion.div>
                    )
                ))}

                {/* Right Panel - Account Settings & Preferences */}
                <motion.div className={user ? "col-md-8" : "col-md-12"} variants={staggerItem}>
                    <div className="card shadow-sm p-4 rounded-4 mb-4">
                        <h5 className="mb-3 fw-semibold text-primary">Account Details</h5>

                        {profileMsg.text && (
                            <div className={`alert alert-${profileMsg.type === "success" ? "success" : "danger"} rounded-3 py-2 small`}>
                                {String(profileMsg.text)}
                            </div>
                        )}

                        <div className="mb-3">
                            <label className="form-label">Role</label>
                            <h4 className="text-primary">{user?.role}</h4>
                        </div>

                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Username</label>
                                <input
                                    type="text"
                                    name="authName"
                                    className="form-control rounded-pill"
                                    value={profileForm.authName}
                                    onChange={handleProfileChange}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control rounded-pill"
                                    placeholder="user@example.com"
                                    value={profileForm.email}
                                    onChange={handleProfileChange}
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    className="form-control rounded-pill"
                                    value={profileForm.country}
                                    onChange={handleProfileChange}
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Age</label>
                                <input
                                    type="number"
                                    name="age"
                                    min="0"
                                    className="form-control rounded-pill"
                                    value={profileForm.age}
                                    onChange={handleProfileChange}
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Gender</label>
                                <select
                                    name="gender"
                                    className="form-select rounded-pill"
                                    value={profileForm.gender}
                                    onChange={handleProfileChange}
                                >
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="text-end mt-4">
                            <button className="btn btn-primary rounded-pill px-5" onClick={handleProfileSave} disabled={savingProfile}>
                                {savingProfile ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>

                    <div className="card shadow-sm p-4 rounded-4 mb-4">
                        <h5 className="mb-3 fw-semibold text-primary">Change Password</h5>

                        {pwMsg.text && (
                            <div className={`alert alert-${pwMsg.type === "success" ? "success" : "danger"} rounded-3 py-2 small`}>
                                {String(pwMsg.text)}
                            </div>
                        )}

                        <div className="row g-3">
                            <div className="col-md-12">
                                <label className="form-label">Current Password</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    className="form-control rounded-pill"
                                    value={pwForm.currentPassword}
                                    onChange={handlePwChange}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    className="form-control rounded-pill"
                                    value={pwForm.newPassword}
                                    onChange={handlePwChange}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="form-control rounded-pill"
                                    value={pwForm.confirmPassword}
                                    onChange={handlePwChange}
                                />
                            </div>
                        </div>

                        <div className="text-end mt-4">
                            <button className="btn btn-primary rounded-pill px-5" onClick={handlePwSave} disabled={savingPw}>
                                {savingPw ? "Updating..." : "Update Password"}
                            </button>
                        </div>
                    </div>

                    <div className="card shadow-sm p-4 rounded-4">
                        <h5 className="mb-3 fw-semibold text-primary">Preferences</h5>

                        <div className="form-check form-switch mb-2">
                            <input className="form-check-input" type="checkbox" id="notifications" />
                            <label className="form-check-label" htmlFor="notifications">
                                Enable Notifications
                            </label>
                        </div>

                        <div className="form-check form-switch mb-2">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="darkmode"
                                checked={theme === "dark"}
                                onChange={toggleTheme}
                            />
                            <label className="form-check-label" htmlFor="darkmode">
                                Dark Mode
                            </label>
                        </div>

                        {/* COLOR THEME DROPDOWN */}
                        <div className="mb-3 mt-3">
                            <label className="form-label fw-semibold mb-2">Theme Color</label>
                            <div className="dropdown">
                                <button
                                    className="btn btn-outline-secondary dropdown-toggle w-100 rounded-pill d-flex align-items-center justify-content-between"
                                    type="button"
                                    onClick={() => setShowColorDropdown(!showColorDropdown)}
                                    aria-expanded={showColorDropdown}
                                >
                                    <div className="d-flex align-items-center gap-2">
                                        <div
                                            className="rounded-circle"
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                backgroundColor: currentTheme.color,
                                                border: '2px solid #fff',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                            }}
                                        ></div>
                                        <span>{currentTheme.name}</span>
                                    </div>
                                </button>

                                <AnimatePresence>
                                {showColorDropdown && (
                                    <motion.div
                                        className="dropdown-menu show w-100 rounded-3 p-2"
                                        style={{ display: 'block' }}
                                        variants={dropdownVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                    >
                                        <div className="d-flex flex-column gap-2">
                                            {Object.entries(THEME_INFO).map(([key, info]) => (
                                                <button
                                                    key={key}
                                                    className={`dropdown-item d-flex align-items-center gap-3 p-2 rounded-2 ${colorTheme === key ? 'bg-primary text-white' : ''}`}
                                                    onClick={() => handleColorThemeChange(key)}
                                                >
                                                    <div
                                                        className="rounded-circle"
                                                        style={{ width: '20px', height: '20px', backgroundColor: info.color }}
                                                    ></div>
                                                    <span>{info.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default Settings;
