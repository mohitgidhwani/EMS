import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, pageVariants } from './motion/Animated'

function Logs() {

    const [logs, setLogs] = useState([])

    const [filter, setfilter] = useState({
        name: "",
        country: "",
        gender: ""
    })

    const handleFilter = (e) => {
        e.preventDefault()
        setfilter({ ...filter, [e.target.name]: e.target.value })
    }


    const filterData = logs.filter((emp) => {
        return emp.empName.toLowerCase().includes(filter.name.toLowerCase())
    })

    useEffect(() => {
        axios.get("https://localhost:7238/api/EmpLogs/AllLogs", { withCredentials: true })
            .then((data) => { 
                setLogs(data.data)
             })
    }, [])

    return (
        <div className="dashboard-container">
            {/* Sidebar */}


            {/* Main Content */}
            <motion.div className="main-content" variants={pageVariants} initial="hidden" animate="visible">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="page-title">Employee Logs</h2>
                    <Link to={"/addEmployee"} className="btn btn-primary rounded-pill px-4">Add Employee</Link>
                </div>

                {/* Search and Filter Bar */}
                <div className="filter-bar shadow-sm p-3 mb-4 bg-card-theme rounded-4">
                    <div className="row g-2 align-items-center">
                        <div className="col-md-5">
                            <input type="text" className="form-control rounded-pill" value={filter.name} name='name' onChange={handleFilter} placeholder="Search by name, country..." />
                        </div>
                        <div className="col-md-3">
                            <select className="form-select rounded-pill" name='country' value={filter.country} onChange={handleFilter}>
                                <option>All Countries</option>
                                <option>India</option>
                                <option>USA</option>
                                <option>Australia</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <select className="form-select rounded-pill" name='gender' value={filter.gender} onChange={handleFilter}>
                                <option>All Genders</option>
                                <option>Male</option>
                                <option>Female</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <button className="btn btn-outline-primary w-100 rounded-pill" >Search</button>
                        </div>
                    </div>
                </div>
                {/* Data Table */}
                <div className="table-responsive bg-card-theme rounded-4 shadow-sm p-3">
                    <table className="table align-middle table-hover mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>LogId</th>
                                <th>Employee Id</th>
                                <th>Name</th>
                                <th>Age</th>
                                <th>Gender</th>
                                <th>Salary</th>
                                <th>Country</th>
                                <th>Email</th>
                                <th>Action Type</th>
                                <th>Date</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="text-center fs-2 fw-bolder py-4">
                                        No Logs Available
                                    </td>
                                </tr>
                            ) : (
                                filterData.map((value, index) => (
                                    <tr key={index}>
                                        <td>{value.logId}</td>
                                        <td>{value.id}</td>
                                        <td>{value.empName}</td>
                                        <td>{value.empAge}</td>
                                        <td>{value.empGender}</td>
                                        <td>{value.empSalary}</td>
                                        <td>{value.empCountry}</td>
                                        <td>{value.empEmail}</td>
                                        <td>{value.actionType}</td>
                                        <td>{value.changeDate.split("T")[0]}</td>
                                        <td>{value.changeDate.split("T")[1]}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    )
}

export default Logs