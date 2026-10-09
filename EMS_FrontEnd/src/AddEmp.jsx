import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, pageVariants } from './motion/Animated';

function AddEmp() {


    const [empData, setEmpData] = useState({
        empName: "",
        empAge: 0,
        empGender: "",
        empSalary: 0,
        empCountry: "",
        empEmail: "",
        reportingManagerId: "",
        teamLeadId: ""
    })

    const [employees, setEmployees] = useState([]);

    const navigate = useNavigate()

    useEffect(() => {
        axios.get("https://localhost:7238/api/Employee", { withCredentials: true })
            .then((res) => setEmployees(res.data))
            .catch(() => setEmployees([]));
    }, [])

    const handleChange = (e) => {
        e.preventDefault()

        setEmpData({ ...empData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {

        if(empData.empName == "" || empData.empAge == "" || empData.empCountry == "" || empData.empGender == "" || empData.empSalary == ""){
             alert("Please fill all the fields");
             return;
        }

        const payload = {
            ...empData,
            reportingManagerId: empData.reportingManagerId === "" ? null : Number(empData.reportingManagerId),
            teamLeadId: empData.teamLeadId === "" ? null : Number(empData.teamLeadId),
        };

        await axios.post("https://localhost:7238/api/Employee", payload , {withCredentials : true})

        await navigate("/")
    }

    return (

        <>
        
            <motion.div className="main-content" variants={pageVariants} initial="hidden" animate="visible">
                <h2 className="page-title mb-4">Add Employee</h2>

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
                                    required={true}
                                    pattern="^[A-Za-z\s]+$"
                                />
                            </div>

                            {/* Email */}
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Email</label>
                                <input
                                    type="email"
                                    className="form-control rounded-pill"
                                    placeholder="employee@example.com"
                                    name='empEmail'
                                    value={empData.empEmail}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Country */}
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Country</label>
                                <select className="form-select rounded-pill" name='empCountry' value={empData.empCountry} onChange={handleChange} required>
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
                                    required
                                />
                            </div>

                            {/* Gender */}
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Gender</label>
                                <select className="form-select rounded-pill" name='empGender' value={empData.empGender} onChange={handleChange} required>
                                    <option value="">Select gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Salary */}
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Salary</label>
                                <input
                                    type="number"
                                    className="form-control rounded-pill"
                                    placeholder="Enter salary amount"
                                    name='empSalary'
                                    value={empData.empSalary}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Reporting Manager */}
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Reporting Manager</label>
                                <select className="form-select rounded-pill" name='reportingManagerId' value={empData.reportingManagerId} onChange={handleChange}>
                                    <option value="">None (top of hierarchy)</option>
                                    {employees.map((emp) => (
                                        <option key={emp.id} value={emp.id}>{emp.empName}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Team Lead */}
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Team Lead</label>
                                <select className="form-select rounded-pill" name='teamLeadId' value={empData.teamLeadId} onChange={handleChange}>
                                    <option value="">None</option>
                                    {employees.map((emp) => (
                                        <option key={emp.id} value={emp.id}>{emp.empName}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Buttons */}
                            <div className="col-12 text-end mt-4">
                                <button onClick={()=>{navigate("/")}} type="button" className="btn btn-outline-secondary rounded-pill px-4 me-2">
                                    Cancel
                                </button>
                                <button onClick={handleSubmit} type="button" className="btn btn-primary rounded-pill px-4">
                                    Save Employee
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </motion.div></>

    );
}

export default AddEmp;
