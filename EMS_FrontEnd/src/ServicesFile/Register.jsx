import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import axios from 'axios';
import { motion, overlayVariants, modalVariants } from '../motion/Animated';

function Register() {
  const [userData, setUserData] = useState({
    authName: "",
    authRole: "",
    passwordHash: "",
    country: "",
    age: "",
    gender: "",
    salary: "",
    joiningDate: "",
    ProfilePicture: ""
  });

  const navigate = useNavigate();

  // Raw camera/phone photos can be several MB — stored as-is that bloats
  // every GetAllRegisterUser response (and every future page that lists
  // users). Downscaling to a small square avatar before it ever becomes
  // base64 keeps each stored image in the tens-of-KB range instead.
  const resizeImageToBase64 = (file, maxDim = 300, quality = 0.75) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          let { width, height } = img;
          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          canvas.getContext("2d").drawImage(img, 0, 0, width, height);

          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleChange = async (e) => {
    if (e.target.name === "ProfilePicture") {
      const file = e.target.files[0];

      if (file) {
        try {
          const compressed = await resizeImageToBase64(file);
          setUserData((prev) => ({ ...prev, ProfilePicture: compressed }));
        } catch {
          // Fall back to the original behaviour if resizing fails for any reason.
          const reader = new FileReader();
          reader.onloadend = () => {
            setUserData((prev) => ({ ...prev, ProfilePicture: reader.result }));
          };
          reader.readAsDataURL(file);
        }
      }
    } else {
      setUserData({ ...userData, [e.target.name]: e.target.value });
    }
  };




  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (!userData.authName || !userData.authRole || !userData.passwordHash) {
      setError("Username, role and password are required.");
      return;
    }

    try {
      setSubmitting(true);
      await axios.post("https://localhost:7238/api/Auth/Register", userData, { withCredentials: true });
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      setError(err?.response?.data || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="auth-page-bg">
    <motion.div className="register-overlay-fixed d-flex justify-content-center align-items-center" variants={overlayVariants} initial="hidden" animate="visible">
      <motion.div className="register-modal p-4" variants={modalVariants} initial="hidden" animate="visible">

        <h2 className="register-title text-center mb-1">Create Your Account</h2>
        <p className="text-center auth-subtitle mb-4">Join the Employee Management System</p>

        <div className="register-card p-4">
          {error && <div className="alert alert-danger rounded-3 py-2 small">{String(error)}</div>}
          <form>

            {/* Profile Image */}
            <div className="mb-3">
              <label className="form-label">Profile Image</label>
              <input
                type="file"
                className="form-control rounded-pill input-styled"
                name="ProfilePicture"
                accept="image/*"
                onChange={handleChange}
              />
            </div>

            <div className="row g-3">

              {/* User Name */}
              <div className="col-md-6">
                <label className="form-label">User Name</label>
                <input
                  type="text"
                  className="form-control rounded-pill input-styled"
                  placeholder="Enter your username"
                  name="authName"
                  value={userData.authName}
                  onChange={handleChange}
                />
              </div>

              {/* Role */}
              <div className="col-md-6">
                <label className="form-label">Role</label>
                <select
                  className="form-select rounded-pill input-styled"
                  name="authRole"
                  value={userData.authRole}
                  onChange={handleChange}
                >
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Employee">Employee</option>
                </select>
              </div>

              {/* Password */}
              <div className="col-md-6">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control rounded-pill input-styled"
                  placeholder="Enter your password"
                  name="passwordHash"
                  value={userData.passwordHash}
                  onChange={handleChange}
                />
              </div>

              {/* Country */}
              <div className="col-md-6">
                <label className="form-label">Country</label>
                <input
                  type="text"
                  className="form-control rounded-pill input-styled"
                  placeholder="Enter Country"
                  name="country"
                  value={userData.country}
                  onChange={handleChange}
                />
              </div>

              {/* Age */}
              <div className="col-md-6">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  className="form-control rounded-pill input-styled"
                  placeholder="Enter Age"
                  name="age"
                  value={userData.age}
                  onChange={handleChange}
                />
              </div>

              {/* Gender */}
              <div className="col-md-6">
                <label className="form-label">Gender</label>
                <select
                  className="form-select rounded-pill input-styled"
                  name="gender"
                  value={userData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Salary */}
              <div className="col-md-6">
                <label className="form-label">Salary</label>
                <input
                  type="number"
                  className="form-control rounded-pill input-styled"
                  placeholder="Enter Salary"
                  name="salary"
                  value={userData.salary}
                  onChange={handleChange}
                />
              </div>

              {/* Joining Date */}
              <div className="col-md-6">
                <label className="form-label">Joining Date</label>
                <input
                  type="date"
                  className="form-control rounded-pill input-styled"
                  name="joiningDate"
                  value={userData.joiningDate}
                  onChange={handleChange}
                />
              </div>

            </div>

            <div className="d-flex justify-content-between align-items-center mt-4">
              <span className="small">
                Already have an account? <Link to="/login">Login</Link>
              </span>

              <button
                onClick={handleSubmit}
                type="button"
                disabled={submitting}
                className="btn btn-primary rounded-pill px-4"
              >
                {submitting ? "Creating..." : "Register"}
              </button>
            </div>

          </form>
        </div>

      </motion.div>
    </motion.div>
    </div>
  );

}

export default Register;
