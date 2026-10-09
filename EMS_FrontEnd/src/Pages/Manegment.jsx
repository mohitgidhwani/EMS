import axios from "axios";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { AuthCon } from "../AuthFile/AuthContext";
import { motion, pageVariants, staggerContainer, staggerItem } from "../motion/Animated";
import OrgChart from "./OrgChart";

function Manegment() {

  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const { user, registeredUsers: loggedIn } = useContext(AuthCon);

  useEffect(() => {
    axios.get("https://localhost:7238/api/Employee", { withCredentials: true })
      .then((data) => { setEmployees(data.data) })
      .catch((err) => { console.log("Error fetching employees: " + err) })
  }, [])

  const highlightId = useMemo(() => {
    if (!search.trim()) return null;
    const match = employees.find((e) => e.empName?.toLowerCase().includes(search.trim().toLowerCase()));
    return match ? match.id : null;
  }, [search, employees]);


  return (
    <motion.div className="main-content" variants={pageVariants} initial="hidden" animate="visible">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <h2 className="page-title mb-0">Management — Org Chart</h2>
        <input
          type="text"
          className="form-control rounded-pill"
          style={{ maxWidth: "280px" }}
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card shadow-sm rounded-4 p-4 mb-5">
        {employees.length === 0 ? (
          <p className="text-secondary mb-0">No employees added yet — add one with a Reporting Manager to start building the chart.</p>
        ) : (
          <OrgChart employees={employees} highlightId={highlightId} />
        )}
      </div>

      <h4 className="mb-3">Admins</h4>
      <motion.div className="row g-4" variants={staggerContainer} initial="hidden" animate="visible">
        {!user ? <div className="text-center fs-2 fw-bold py-4">Log In First</div> : loggedIn.map((value) => {
          if (value.authRole == "Admin") {
            return (
              <motion.div className="col-md-4" key={value.id} variants={staggerItem}>
                <div className="card shadow-sm text-center rounded-4 p-4 border-0">
                  <div className="d-flex justify-content-center">
                    <img
                      src={value.profilePicture}
                      alt="Profile"
                      className="profile-img"
                    />
                  </div>
                  <h5 className="mt-3 mb-1 fw-semibold">{value.authName}</h5>
                  <p className="text-muted mb-0">{value.authRole}</p>
                </div>
              </motion.div>
            )
          }
        })}

      </motion.div>
    </motion.div>
  );
}

export default Manegment;
