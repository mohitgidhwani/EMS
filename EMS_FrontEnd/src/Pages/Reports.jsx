import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { motion, pageVariants, staggerContainer, staggerItem } from "../motion/Animated";
import Analytics from "./Analytics";

function Reports() {

  const [reportData, setReportData] = useState([])
  const [filter, setfilter] = useState({ name: "", status: "" });
  const [activeTab, setActiveTab] = useState("reports");

  const handleFilter = (e) => {
    e.preventDefault();
    setfilter({ ...filter, [e.target.name]: e.target.value });
  };

  const filterData = reportData.filter((report) => {
    console.log(report)
    const matchName = report.name?.toLowerCase().includes(filter.name.toLowerCase());
    const matchStatus = filter.status === "All Reports" || filter.status === "" ? true : report.reportStatus === filter.status;
    return matchName && matchStatus
  });

  useEffect(() => {
    axios.get("https://localhost:7238/api/Report/AllReports", { withCredentials: true })
      .then((data) => { setReportData(data.data) })
      .catch((err) => { console.log(err) })
  }, [])

  // Function to return color based on status
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed": return "#d4edbc";
      case "pending": return "#ffe5a0";
      case "issue": return "#ffcfc9";
    }
  };

  

  return (
    <motion.div className="main-content" variants={pageVariants} initial="hidden" animate="visible">

      <h2 className="fw-bold mb-4">Reports</h2>

      {/* Tab Switcher */}
      <ul className="nav nav-pills mb-4 report-tabs">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "reports" ? "active" : ""}`} onClick={() => setActiveTab("reports")}>
            Project Reports
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "analytics" ? "active" : ""}`} onClick={() => setActiveTab("analytics")}>
            Analytics
          </button>
        </li>
      </ul>

      {activeTab === "analytics" ? (
        <Analytics />
      ) : (
      <>
      {/* Search Bar */}
      <div className="d-flex gap-3 mb-4 align-items-center">
        <input
          type="text"
          className="form-control rounded-pill p-3"
          placeholder="Search reports..."
          style={{ maxWidth: "350px" }}
          name="name"
          onChange={handleFilter}
        />

        <select className="form-select rounded-pill p-3" style={{ maxWidth: "200px" }} name="status" onChange={handleFilter}>
          <option value={"All Reports"}>Status Filter</option>
          <option value={"Completed"}>Completed</option>
          <option value={"Pending"}>Pending</option>
          <option value={"Issue"}>Issue</option>
        </select>
      </div>

      {/* Cards Wrapper */}
      <motion.div className="row g-4" variants={staggerContainer} initial="hidden" animate="visible">

        {reportData.length === 0 ? 
          (<h1 className="text-center fs-2 fw-bold py-4">No Report Added</h1>) :
          (filterData.map((reportCard) => {
            return (
              <motion.div className="col-md-4" key={reportCard.reportId} variants={staggerItem}>
                <div className="card p-4 shadow-sm rounded-4 border-0">
                  <h5 className="fw-bold">{reportCard.projectName} <span className="badge bg-secondary ms-2">{reportCard.name}</span></h5>
                  <p className="text-muted">{reportCard.report}</p>
  
                  <div className="mt-2">
                    <span className="badge rounded-pill px-3 py-2 text-dark" style={{ backgroundColor: getStatusColor(reportCard.reportStatus) }}>
                      {reportCard.reportStatus}
                    </span>
                  </div>
  
                  <p className="mt-3 small d-block text-truncate">
                    {reportCard.issueDetails == "" ? "No issues reported." : reportCard.issueDetails}
                  </p>
  
                  <div className="d-flex justify-content-between mt-3">
                    <span className="text-muted small">Priority: {reportCard.priority}</span>
                    <Link to={`ReportViewPopup/${reportCard.reportId}`} className="btn btn-primary btn-sm rounded-pill px-3">
                      View
                    </Link>
                  </div>
                </div>
              </motion.div>
            )
          }))
          
        }

        
      </motion.div>
      </>
      )}
      <Outlet></Outlet>
    </motion.div>
  );
}

export default Reports;
