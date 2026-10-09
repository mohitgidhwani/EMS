import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { AuthCon } from '../AuthFile/AuthContext';
import { motion, pageVariants, staggerContainer, staggerItem } from '../motion/Animated';

function Projects() {

    const [projects, setProjects] = useState([])
    const [filter, setfilter] = useState({ name: "", country: "", category: "" });
    const [deleteId, setDeleteId] = useState(null);
    const { user } = useContext(AuthCon);


    useEffect(() => {
        axios.get("https://localhost:7238/api/Project/GetAllProjects", { withCredentials: true })
            .then((data) => { setProjects(data.data) })
            .catch((error) => { console.log("Error fetching projects:", error) })
    }, [])

    const handleFilter = (e) => {
        e.preventDefault();
        setfilter({ ...filter, [e.target.name]: e.target.value });
    };

    const filterData = projects.filter((project) => {
        const clientCountry = project.clientLocation.split(",")[1]?.trim();
        const matchName = project.projectName
            ?.toLowerCase()
            .includes(filter.name.toLowerCase());

        const matchCountries =
            filter.country === "All Countries" || filter.country === ""
                ? true
                : clientCountry === filter.country;

        const matchCategory =
            filter.category === "All Categories" || filter.category === ""
                ? true
                : project.projectCategory === filter.category;

        return matchName && matchCountries && matchCategory;
    });

    const openDeleteModal = (id) => {
        setDeleteId(id);
        const modal = new window.bootstrap.Modal(document.getElementById('confirmDeleteModal'));
        modal.show();
    };


    const confirmDelete = (id) => {
        if (!deleteId) return;
        axios.delete(`https://localhost:7238/api/Project/DeleteProjectById/${id}`, { withCredentials: true })
            .then(() => { setProjects(projects.filter((p) => p.projectId !== id)) })
        setDeleteId(null);
    }



    return (
        <div className="dashboard-container">
            <motion.div className="main-content" variants={pageVariants} initial="hidden" animate="visible">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="page-title">Projects</h2>
                   {
                    user?.role === "Admin" ?  <Link to={"addeditProject"} className="btn btn-primary rounded-pill px-4">Add Project</Link> : ""
                   }
                </div>

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
                            <select className="form-select rounded-pill" name='category' value={filter.category} onChange={handleFilter}>
                                <option value="All Categories">All Categories</option>
                                <option value="E-Commerce">E-Commerce Website</option>
                                <option value="Informational">Informational Website</option>
                                <option value="Community">Community Website</option>
                                <option value="Education">Education Website</option>
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
                                    <th>Project Name</th>
                                    <th>Client Name</th>
                                    <th>Client Location</th>
                                    <th>Category</th>
                                    <th>Duration</th>
                                    {user.role == "Admin" ? <th>Amount</th> : ""}
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <motion.tbody variants={staggerContainer} initial="hidden" animate="visible">
                                {projects.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="text-center fs-2 fw-bold py-4">
                                            No Projects Added
                                        </td>
                                    </tr>
                                ) : (
                                    filterData.map((p, index) => (
                                        <motion.tr variants={staggerItem} key={index}>
                                            <td>{p.projectId}</td>
                                            <td>{p.projectName}</td>
                                            <td>{p.clientName}</td>
                                            <td>{p.clientLocation}</td>
                                            <td>{p.projectCategory}</td>
                                            <td>{p.duration}</td>
                                           {user.role == "Admin" ? <td>{p.ammount}</td> : ""}
                                            <td className="text-end">
                                                {user?.role === "Admin" ?
                                                    <>
                                                        <Link
                                                            className="btn btn-sm btn-outline-primary me-2 rounded-pill px-3"
                                                            to={`addeditProject/${p.projectId}`}
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            className="btn btn-sm btn-outline-danger rounded-pill px-3"
                                                            onClick={() => openDeleteModal(p.projectId)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                    : <Link
                                                        to={`report/${p.projectId}`}
                                                        className="btn btn-sm btn-outline-primary me-2 rounded-pill px-3"
                                                    >
                                                        Report
                                                    </Link>}

                                            </td>
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

            {/* Confirm Delete Modal */}
            <div className="modal fade" id="confirmDeleteModal" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content rounded-4 shadow">
                        <div className="modal-header border-0">
                            <h5 className="modal-title fw-bold">Confirm Delete</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body text-center">
                            <p className="fs-5">Are you sure you want to delete this Project?</p>
                        </div>
                        <div className="modal-footer border-0 d-flex justify-content-end">
                            <button className="btn btn-outline-secondary rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                            <button className="btn btn-danger rounded-pill px-4" data-bs-dismiss="modal" onClick={() => confirmDelete(deleteId)}>Confirm</button>
                        </div>
                    </div>
                </div>
            </div>
            <Outlet />
        </div>

    )
}

export default Projects