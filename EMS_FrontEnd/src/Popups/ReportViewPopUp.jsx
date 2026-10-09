import React, { useEffect, useState } from "react";
import "../App.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { motion, overlayVariants, modalVariants } from "../motion/Animated";

function ReportViewPopup({ onClose }) {
    const [report, setReportData] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        axios.get(`https://localhost:7238/api/Report/ReportGetById/${id}`, { withCredentials: true })
            .then((data) => { setReportData(data.data) })
            .catch((err) => { console.log("Error In ReportBy iD : " + err) });
    }, []);

    return (
        <motion.div className="register-overlay" variants={overlayVariants} initial="hidden" animate="visible">
            <motion.div className="register-modal w-75 mx-auto position-relative" variants={modalVariants} initial="hidden" animate="visible">

                <h2 className="page-title mb-4 text-center text-primary">
                    Report Details
                </h2>

                {/* CHANGED: Removed bg-white, added custom class */}
                <div className="register-card shadow-sm rounded-4 p-4 w-100 bg-card-theme">

                    <div className="row g-4">

                        {/* Project Title */}
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Project Name</label>
                            {/* CHANGED: text-dark to text-primary */}
                            <p className="text-primary fs-6">{report.projectName}</p>
                        </div>

                        {/* Employee Name */}
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Developer Name</label>
                            {/* CHANGED: text-dark to text-primary */}
                            <p className="text-primary fs-6">{report.name}</p>
                        </div>

                        {/* Report */}
                        <div className="col-md-12">
                            <label className="form-label fw-semibold">Report</label>
                            {/* CHANGED: bg-light to bg-light-theme */}
                            <div className="p-3 rounded-4 bg-light-theme">
                                {/* CHANGED: text-dark to text-primary */}
                                <p className="mb-0 text-primary">{report.report}</p>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Status</label>
                            {/* CHANGED: text-dark to text-primary */}
                            <p className="text-primary fs-6">{report.reportStatus}</p>
                        </div>

                        {/* Priority */}
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Priority</label>
                            {/* CHANGED: text-dark to text-primary */}
                            <p className="text-primary fs-6">{report.priority}</p>
                        </div>

                        {/* Issue Details (only if status is Issue) */}
                        {report.status === "Issue" || report.issueDetails ? (
                            <div className="col-md-12">
                                <label className="form-label fw-semibold">Issue Details</label>
                                {/* CHANGED: bg-light to bg-light-theme */}
                                <div className="p-3 rounded-4 bg-light-theme">
                                    {/* CHANGED: text-dark to text-primary */}
                                    <p className="mb-0 text-primary">{report.issueDetails}</p>
                                </div>
                            </div>
                        ) : null}

                        {/* Date */}
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Report Date</label>
                            {/* CHANGED: text-dark to text-primary */}
                            <p className="text-primary fs-6">{report.reportDate}</p>
                        </div>

                        {/* Buttons */}
                        <div className="col-12 text-end mt-4">
                            <button
                                className="btn btn-primary rounded-pill px-4"
                                onClick={() => { navigate("/reports") }}
                            >
                                Close
                            </button>
                        </div>

                    </div>
                </div>

            </motion.div>
        </motion.div>
    );
}

export default ReportViewPopup;