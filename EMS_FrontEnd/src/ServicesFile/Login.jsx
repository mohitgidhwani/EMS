import axios from 'axios'
import React, { useContext, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthCon } from '../AuthFile/AuthContext'
import { motion, overlayVariants, modalVariants } from '../motion/Animated'

function Login() {

    const [userData, setserData] = useState({
        authName: "",
        passwordHash: ""
    })

    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const { setUser } = useContext(AuthCon);

    const navigate = useNavigate()
    const location = useLocation()
    const justRegistered = location.state?.registered

    const handleChange = (e) => {
        setserData({ ...userData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!userData.authName || !userData.passwordHash) {
            setError("Please enter both username and password.");
            return;
        }

        try {
            setSubmitting(true);
            await axios.post("https://localhost:7238/api/Auth/Login",
                userData,
                { withCredentials: true }
            )

            const res = await axios.get("https://localhost:7238/api/Auth/LoggedInUser", { withCredentials: true });
            setUser(res.data);
            navigate("/");
        }
        catch (err) {
            setError(err?.response?.data || "Invalid username or password.");
        }
        finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="auth-page-bg">
        <motion.div className="register-overlay-fixed d-flex justify-content-center align-items-center" variants={overlayVariants} initial="hidden" animate="visible">
            <motion.div className="register-modal" variants={modalVariants} initial="hidden" animate="visible">
                <h2 className="register-title text-center mb-1">Welcome Back</h2>
                <p className="text-center auth-subtitle mb-4">Sign in to access your dashboard</p>

                <div className="register-card p-4">
                    {justRegistered && <div className="alert alert-success rounded-3 py-2 small">Account created — please sign in.</div>}
                    {error && <div className="alert alert-danger rounded-3 py-2 small">{String(error)}</div>}
                    <form>
                        <div className="row g-4">
                            {/* Username */}
                            <div className="col-md-12">
                                <label className="form-label fw-semibold">User Name</label>
                                <input
                                    type="text"
                                    className="form-control rounded-pill"
                                    placeholder="Enter your username"
                                    name='authName'
                                    value={userData.authName}
                                    required
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Password */}
                            <div className="col-md-12">
                                <label className="form-label fw-semibold">Password</label>
                                <input
                                    type="password"
                                    className="form-control rounded-pill"
                                    placeholder="Enter your password"
                                    name='passwordHash'
                                    required
                                    value={userData.passwordHash}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Buttons */}
                            <div className="d-flex justify-content-between align-items-center mt-4">
                                <span className="small">
                                    Don't have an account? <Link to={"/register"}>Register</Link>
                                </span>
                                <button onClick={handleSubmit} type="submit" disabled={submitting} className="btn btn-primary rounded-pill px-4">
                                    {submitting ? "Signing in..." : "Login"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </motion.div>
        </motion.div>
        </div>
    )
}

export default Login