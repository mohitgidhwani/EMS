import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, overlayVariants, modalVariants } from '../motion/Animated'

function AddEditProject() {
  const navigate = useNavigate()
  const { id } = useParams();

  const [projectData, setProjectData] = useState({
    projectName: "",
    projectDate: "",
    clientName: "",
    clientLocation: "",
    duration: "",
    ammount: "",
    projectCategory: "",
    deadLine: ""
  })

  if (id) {
    useEffect(() => {
      axios
        .get(`https://localhost:7238/api/Project/${id}`, { withCredentials: true })
        .then((res) => {
          const data = res.data;
          // Convert date fields properly
          setProjectData({
            ...data,
            projectDate: data.projectDate ? data.projectDate.slice(0, 16) : "",
            deadLine: data.deadLine ? data.deadLine.slice(0, 16) : "",
          });
        });
    }, []);
  }

  const handleChange = (e) => {
    setProjectData({ ...projectData, [e.target.name]: e.target.value });
  }

  const handleAddEdit = () => {
    if (id === undefined) {
      if (projectData.projectName == "" || projectData.projectDate == "" || projectData.clientName == "" || projectData.clientLocation == "" || projectData.duration == "" || projectData.ammount == "" || projectData.projectCategory == "" || projectData.deadLine == "") {
        alert("Please fill all the fields");
        return;
      }
      axios.post("https://localhost:7238/api/Project/AddProject", projectData, { withCredentials: true })
        .then(() => {
          navigate("/Projects");
        });
    }
    else {
      if (projectData.projectName == "" || projectData.projectDate == "" || projectData.clientName == "" || projectData.clientLocation == "" || projectData.duration == "" || projectData.ammount == "" || projectData.projectCategory == "" || projectData.deadLine == "") {
        alert("Please fill all the fields");
        return;
      }
      axios.put(`https://localhost:7238/api/Project/EditProject/${id}`, projectData, { withCredentials: true })
        .then(() => {
          navigate("/Projects");
        })
    }
  }
  const handleClear = () => {
    setProjectData({
      projectName: "",
      projectDate: "",
      clientName: "",
      clientLocation: "",
      duration: "",
      ammount: "",
      projectCategory: "",
      deadLine: ""
    })
  }


  return (
    <motion.div className="register-overlay" variants={overlayVariants} initial="hidden" animate="visible">
      <motion.div className="register-modal w-75 mx-auto position-relative" variants={modalVariants} initial="hidden" animate="visible">

        {/* Close Button */}
        <button className="close-btn" onClick={() => { navigate("/Projects") }}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        <h2 className="page-title mb-4 text-center text-primary">
          {id ? "Edit Project Details" : "Add Project Details"}
        </h2>

        <div className="register-card shadow-sm bg-card-theme rounded-4 p-4 w-100">
          <form>
            <div className="row g-4">

              {/* Project Name */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Project Name</label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  placeholder="Enter project name"
                  value={projectData.projectName}
                  name='projectName'
                  onChange={handleChange}
                />
              </div>

              {/* Project Date */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Project Date</label>
                <input
                  type="datetime-local"
                  className="form-control rounded-pill"
                  value={projectData.projectDate}
                  name='projectDate'
                  onChange={handleChange}
                />
              </div>

              {/* Client Name */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Client Name</label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  placeholder="Enter client name"
                  value={projectData.clientName}
                  name='clientName'
                  onChange={handleChange}
                />
              </div>

              {/* Client Location */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Client Location</label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  placeholder="Enter client location"
                  value={projectData.clientLocation}
                  name='clientLocation'
                  onChange={handleChange}
                />
              </div>

              {/* Duration */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Duration</label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  placeholder="ex: 10 Months"
                  value={projectData.duration}
                  name='duration'
                  onChange={handleChange}
                />
              </div>

              {/* Amount */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Amount</label>
                <input
                  type="number"
                  className="form-control rounded-pill"
                  placeholder="Enter amount"
                  value={projectData.ammount}
                  name='ammount'
                  onChange={handleChange}
                />
              </div>

              {/* Project Category */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Project Category</label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  placeholder="ex: Web Development"
                  value={projectData.projectCategory}
                  name='projectCategory'
                  onChange={handleChange}
                />
              </div>

              {/* Deadline */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Deadline</label>
                <input
                  type="datetime-local"
                  className="form-control rounded-pill"
                  value={projectData.deadLine}
                  name='deadLine'
                  onChange={handleChange}
                />
              </div>

              {/* Buttons */}
              <div className="col-12 text-end mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill px-4 me-2"
                  onClick={handleClear}
                >
                  Clear
                </button>

                <button
                  type="button"
                  className="btn btn-primary rounded-pill px-4"
                  onClick={handleAddEdit}
                >
                  {id ? "Update Project" : "Add Project"}
                </button>
              </div>

            </div>
          </form>
        </div>

      </motion.div>
    </motion.div>
  )
}

export default AddEditProject