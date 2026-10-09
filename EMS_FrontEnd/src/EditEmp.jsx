import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, pageVariants } from './motion/Animated'

function EditEmp() {

    const [empData, setEmpData] = useState({
        empName: "",
        empAge: 0,
        empGender: "",
        empSalary: 0,
        empCountry: "",
        empEmail : "",
        reportingManagerId: "",
        teamLeadId: ""
    })

    const [employees, setEmployees] = useState([]);

    const { id } = useParams();

    useEffect(() => {
        axios.get(`https://localhost:7238/api/Employee/${id}` , {withCredentials : true})
            .then((data) => {
                setEmpData({
                    ...data.data,
                    reportingManagerId: data.data.reportingManagerId ?? "",
                    teamLeadId: data.data.teamLeadId ?? "",
                })
            })

        axios.get("https://localhost:7238/api/Employee", { withCredentials: true })
            .then((res) => setEmployees(res.data))
            .catch(() => setEmployees([]));
    }, [id])

    const navigate = useNavigate()

    const handleChange = (e) => {
        e.preventDefault()
        setEmpData({ ...empData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        const payload = {
            ...empData,
            reportingManagerId: empData.reportingManagerId === "" ? null : Number(empData.reportingManagerId),
            teamLeadId: empData.teamLeadId === "" ? null : Number(empData.teamLeadId),
        };

        await axios.patch(`https://localhost:7238/api/Employee/${id}`,
            payload ,
            {withCredentials : true}
        )
        await navigate("/")
    }

    // An employee can't report to (or be led by) themselves.
    const selectableEmployees = employees.filter((emp) => String(emp.id) !== String(id));

    return (
        <motion.div className="main-content" variants={pageVariants} initial="hidden" animate="visible">
            <h2 className="page-title mb-4">Edit Employee</h2>

            <div className="form-card shadow-sm bg-card-theme rounded-4 p-4">
                <form>
                    <div className="row g-4">
                        {/* Employee Name */}
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Employee Name</label>
                            <input
                                type="text"
                                className="form-control rounded-pill"
                                placeholder="Enter employee name"
                                name='empName'
                                value={empData.empName}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Country */}
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Country</label>
                            <select className="form-select rounded-pill" name='empCountry' value={empData.empCountry} onChange={handleChange}>
                                <option value="">Select country</option>
                                <option value="India">India</option>
                                <option value="USA">USA</option>
                                <option value="Australia">Australia</option>
                                <option value="UK">UK</option>
                            </select>
                        </div>

                        {/* Age */}
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Age</label>
                            <input
                                type="number"
                                className="form-control rounded-pill"
                                placeholder="Enter age"
                                name='empAge'
                                value={empData.empAge}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Gender */}
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Gender</label>
                            <select className="form-select rounded-pill" name='empGender' value={empData.empGender} onChange={handleChange}>
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Email</label>
                            <input
                                type="text"
                                className="form-control rounded-pill"
                                placeholder="Enter employee name"
                                name='empEmail'
                                value={empData.empEmail}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Salary */}
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Salary</label>
                            <input
                                type="text"
                                className="form-control rounded-pill"
                                placeholder="Enter salary amount"
                                name='empSalary'
                                value={empData.empSalary}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Reporting Manager */}
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Reporting Manager</label>
                            <select className="form-select rounded-pill" name='reportingManagerId' value={empData.reportingManagerId} onChange={handleChange}>
                                <option value="">None (top of hierarchy)</option>
                                {selectableEmployees.map((emp) => (
                                    <option key={emp.id} value={emp.id}>{emp.empName}</option>
                                ))}
                            </select>
                        </div>

                        {/* Team Lead */}
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Team Lead</label>
                            <select className="form-select rounded-pill" name='teamLeadId' value={empData.teamLeadId} onChange={handleChange}>
                                <option value="">None</option>
                                {selectableEmployees.map((emp) => (
                                    <option key={emp.id} value={emp.id}>{emp.empName}</option>
                                ))}
                            </select>
                        </div>

                        {/* Buttons */}
                        <div className="col-12 text-end mt-4">
                            <button type="button" onClick={()=>{navigate("/")}} className="btn btn-outline-secondary rounded-pill px-4 me-2">
                                Cancel
                            </button>
                            <button onClick={handleSubmit} type="button" className="btn btn-primary rounded-pill px-4">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </motion.div>
    )
}

export default EditEmp
