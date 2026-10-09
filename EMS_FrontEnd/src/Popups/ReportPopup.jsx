import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthCon } from "../AuthFile/AuthContext";
import axios from "axios";
import { motion, AnimatePresence, overlayVariants, modalVariants } from "../motion/Animated";

function ReportPopup({ onClose }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthCon);
  const { id } = useParams();

  const [projectData, setProjectData] = useState([])
  const [showConfirm, setShowConfirm] = useState(false);
  const [issueField, setIssueField] = useState(false);

  const [ReportData, setReportData] = useState({
    report: "",
    reportStatus: "",
    issueDetails: "",
    priority: "",
    projectId: id,
    name: ""
  });


  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "reportStatus") {
      if (value === "Issue") {
        setIssueField(true);
      } else {
        setIssueField(false);
      }
    }

    setReportData({ ...ReportData, [name]: value });
  }

  useEffect(() => {
    axios.get(`https://localhost:7238/api/Project/${id}`, { withCredentials: true })
      .then((res) => { setProjectData(res.data) })
      .catch((err) => { console.log("Error fetching project data: ", err) })
  }, [])


  const handleAddReport = () => { 
    if(ReportData.report == "" || ReportData.reportStatus == "" || ReportData.report == "" || ReportData.name == "" || ReportData.priority == ""){
      
    }
    axios.post("https://localhost:7238/api/Report/AddReport", ReportData, { withCredentials: true })

    setShowConfirm(false); // close popup
    navigate("/Projects"); // redirect
  }

  return (
    <motion.div className="register-overlay" variants={overlayVariants} initial="hidden" animate="visible">
      <motion.div className="register-modal w-75 mx-auto position-relative" variants={modalVariants} initial="hidden" animate="visible">

        {/* Close Button */}
        <button className="close-btn" onClick={() => { navigate("/Projects") }}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        <h2 className="page-title mb-4 text-center text-primary">Project Report</h2>

        <div className="register-card shadow-sm bg-card-theme rounded-4 p-4 w-100">

          <form>
            <div className="row g-4">

              {/* Project Title */}
              <div className="col-md-12">
                <label className="form-label fw-semibold">Project Title</label>
                <h5 className="text-dark fs-5">{projectData?.projectName}</h5>
              </div>

              {/* Employee Name */}
              <div className="col-md-12">
                <label className="form-label fw-semibold">Employee Name</label>
                <input
                  type="text"
                  className="form-control rounded-4 p-3"
                  placeholder="Enter employee name"
                  value={ReportData.name}
                  name="name"
                  onChange={handleChange}
                />
              </div>

              {/* Comment */}
              <div className="col-md-12">
                <label className="form-label fw-semibold">Report</label>
                <textarea
                  className="form-control rounded-4 p-3"
                  rows="3"
                  placeholder="Enter your report comment"
                  value={ReportData.report}
                  name="report"
                  onChange={handleChange}
                ></textarea>
              </div>

              {/* Status (RADIO BUTTONS) */}
              <div className="col-md-12">
                <label className="form-label fw-semibold">Status</label>

                <div className="radio-group">

                  <label className="custom-radio">
                    <input type="radio" name="reportStatus" value="Completed" checked={ReportData.reportStatus === "Completed"} onChange={handleChange} />
                    <span>Completed</span>
                  </label>

                  <label className="custom-radio">
                    <input type="radio" name="reportStatus" value="Pending" checked={ReportData.reportStatus === "Pending"} onChange={handleChange} />
                    <span>Pending</span>
                  </label>

                  <label className="custom-radio">
                    <input type="radio" name="reportStatus" value="Issue" checked={ReportData.reportStatus === "Issue"} onChange={handleChange} />
                    <span>Issue</span>
                  </label>

                </div>
              </div>

              {issueField ?
                <div className="col-md-12">
                  <label className="form-label fw-semibold">Issue Details</label>
                  <textarea
                    className="form-control rounded-4 p-3"
                    rows="3"
                    placeholder="Describe the issue (if any)"
                    value={ReportData.issueDetails}
                    name="issueDetails"
                    onChange={handleChange}
                  ></textarea>
                </div> : ""}

              {/* Priority (RADIO BUTTONS) */}
              <div className="col-md-12">
                <label className="form-label fw-semibold">Priority</label>

                <div className="radio-group">

                  <label className="custom-radio">
                    <input type="radio" name="priority" value="High" onChange={handleChange} />
                    <span>High</span>
                  </label>

                  <label className="custom-radio">
                    <input type="radio" name="priority" value="Medium" onChange={handleChange} />
                    <span>Medium</span>
                  </label>

                  <label className="custom-radio">
                    <input type="radio" name="priority" value="Low" onChange={handleChange} />
                    <span>Low</span>
                  </label>
                </div>
              </div>


              {/* Buttons */}
              <div className="col-12 text-end mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill px-4 me-2"
                >
                  Clear
                </button>

                <button
                  type="button"
                  className="btn btn-primary rounded-pill px-4"
                  onClick={() => setShowConfirm(true)}
                >
                  Submit
                </button>
              </div>

            </div>
          </form>

        </div>
      </motion.div>
      <AnimatePresence>
        {
          showConfirm && (
            <motion.div className="confirm-overlay" variants={overlayVariants} initial="hidden" animate="visible" exit="hidden">
              <motion.div className="confirm-box rounded-4 p-4 shadow" variants={modalVariants} initial="hidden" animate="visible" exit="hidden">

                <h4 className="mb-3">Confirm Submission</h4>
                <p>Are you sure you want to submit this report?</p>

                <div className="mt-4 text-end">
                  <button
                    className="btn btn-outline-secondary rounded-pill px-4 me-2"
                    onClick={() => setShowConfirm(false)}
                  >
                    No
                  </button>

                  <button
                    className="btn btn-primary rounded-pill px-4"
                    onClick={handleAddReport}
                  >
                    Yes, Submit
                  </button>
                </div>

              </motion.div>
            </motion.div>
          )
        }
      </AnimatePresence>
    </motion.div>

  );
}

export default ReportPopup;
