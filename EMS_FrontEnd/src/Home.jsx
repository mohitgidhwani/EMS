import axios from 'axios';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import "./App.css";
import { Link } from 'react-router-dom';
import { AuthCon } from './AuthFile/AuthContext';
import { motion, pageVariants, staggerContainer, staggerItem } from './motion/Animated';
import DashboardCharts from './Pages/DashboardCharts';

function Home() {
  const [empData, setEmpdata] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [filter, setfilter] = useState({ name: "", country: "", gender: "" });
  const { user } = useContext(AuthCon);

  useEffect(() => {
    axios.get("https://localhost:7238/api/Employee", { withCredentials: true })
      .then((data) => setEmpdata(data.data));
  }, [user]);

  const stats = useMemo(() => {
    const total = empData.length;
    const totalSalary = empData.reduce((sum, e) => sum + (Number(e.empSalary) || 0), 0);
    const countries = new Set(empData.map((e) => e.empCountry).filter(Boolean)).size;
    const avgAge = total ? Math.round(empData.reduce((sum, e) => sum + (Number(e.empAge) || 0), 0) / total) : 0;
    return { total, totalSalary, countries, avgAge };
  }, [empData]);

  const openDeleteModal = (id) => {
    setDeleteId(id);
    const modal = new window.bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    modal.show();
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    axios.delete(`https://localhost:7238/api/Employee/${deleteId}`, { withCredentials: true })
      .then(() => {
        setEmpdata(empData.filter((data) => data.id !== deleteId));
      });
    setDeleteId(null);
  };

  const handleFilter = (e) => {
    e.preventDefault();
    setfilter({ ...filter, [e.target.name]: e.target.value });
  };

  const filterData = empData.filter((emp) => {
    const matchName = emp.empName.toLowerCase().includes(filter.name.toLowerCase());
    const matchCountries = filter.country === "All Countries" || filter.country === "" ? true : emp.empCountry === filter.country;
    const matchGender = filter.gender === "All Genders" || filter.gender === "" ? true : emp.empGender === filter.gender;
    return matchName && matchCountries && matchGender;
  });

  return (
    <>
      <div className="dashboard-container">
        <motion.div className="main-content" variants={pageVariants} initial="hidden" animate="visible">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="page-title">Dashboard</h2>
            {user?.role === "Admin" ? <Link to={"/addEmployee"} className="btn btn-primary rounded-pill px-4">Add Employee</Link> : ""}
          </div>

          {/* Stat cards */}
          <motion.div className="row g-3 mb-4" variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div className="col-6 col-lg-3" variants={staggerItem}>
              <div className="stat-card shadow-sm rounded-4 p-3">
                <div className="stat-label">Total Employees</div>
                <div className="stat-value">{stats.total}</div>
              </div>
            </motion.div>
            <motion.div className="col-6 col-lg-3" variants={staggerItem}>
              <div className="stat-card shadow-sm rounded-4 p-3">
                <div className="stat-label">Countries</div>
                <div className="stat-value">{stats.countries}</div>
              </div>
            </motion.div>
            <motion.div className="col-6 col-lg-3" variants={staggerItem}>
              <div className="stat-card shadow-sm rounded-4 p-3">
                <div className="stat-label">Average Age</div>
                <div className="stat-value">{stats.avgAge || "—"}</div>
              </div>
            </motion.div>
            {user?.role === "Admin" && (
              <motion.div className="col-6 col-lg-3" variants={staggerItem}>
                <div className="stat-card shadow-sm rounded-4 p-3">
                  <div className="stat-label">Total Payroll</div>
                  <div className="stat-value">₹{stats.totalSalary.toLocaleString()}</div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {empData.length > 0 && <DashboardCharts empData={empData} showSalary={user?.role === "Admin"} />}

          <h2 className="page-title mb-3">Employees</h2>
          <div className="filter-bar shadow-sm p-3 mb-4 bg-card-theme rounded-4">
            <div className="row g-2 align-items-center">
              <div className="col-md-5">
                <input type="text" className="form-control rounded-pill" value={filter.name} name='name' onChange={handleFilter} placeholder="Search by name..." />
              </div>
              <div className="col-md-3">
                <select className="form-select rounded-pill" name='country' value={filter.country} onChange={handleFilter}>
                  <option value="All Countries">All Countries</option>
                  <option value="India">India</option>
                  <option value="USA">USA</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>
              <div className="col-md-2">
                <select className="form-select rounded-pill" name='gender' value={filter.gender} onChange={handleFilter}>
                  <option value="All Genders">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="col-md-2">
                <button className="btn btn-outline-primary w-100 rounded-pill">Search</button>
              </div>
            </div>
          </div>

          {user?.role ? (
            <div className="table-responsive bg-card-theme rounded-4 shadow-sm p-3">
              <table className="table align-middle table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Employee Name</th>
                    <th>Country</th>
                    <th>Age</th>
                    <th>Gender</th>
                    {user.role == "Admin" ? <th className="">Salary</th> : ""}
                    <th>Email</th>
                    {user.role == "Admin" ? <th className="text-end">Actions</th> : ""}
                    
                  </tr>
                </thead>
                <motion.tbody variants={staggerContainer} initial="hidden" animate="visible">
                  {empData.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center fs-2 fw-bold py-4">No Employee Added</td>
                    </tr>
                  ) : (
                    filterData.map((value, index) => (
                      <motion.tr variants={staggerItem} key={index}>
                        <td>{value.id}</td>
                        <td>{value.empName}</td>
                        <td>{value.empCountry}</td>
                        <td>{value.empAge}</td>
                        <td>{value.empGender}</td>
                        {user.role == "Admin" ? <td className="">₹  {value.empSalary}</td> : ""}
                        <td>{value.empEmail}</td>
                        {user.role == "Admin" ? <td className="text-end">
                          <Link className="btn btn-sm btn-outline-primary me-2 rounded-pill px-3" to={`/editEmployee/${value.id}`}>Edit</Link>
                          <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => openDeleteModal(value.id)}>Delete</button>
                        </td> : ""}
                      </motion.tr>
                    ))
                  )}
                </motion.tbody>
              </table>
            </div>
          ) : (
            <div className="text-center fs-2 fw-bold py-4">Unauthorized</div>
          )}
        </motion.div>
      </div>

      {/* Confirm Delete Modal */}
      <div className="modal fade" id="confirmDeleteModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4 shadow">
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold">Confirm Delete</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body text-center">
              <p className="fs-5">Are you sure you want to delete this employee?</p>
            </div>
            <div className="modal-footer border-0 d-flex justify-content-end">
              <button className="btn btn-outline-secondary rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
              <button className="btn btn-danger rounded-pill px-4" data-bs-dismiss="modal" onClick={confirmDelete}>Confirm</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;