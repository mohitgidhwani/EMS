import axios from "axios";
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
    ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import { AuthCon } from "../AuthFile/AuthContext";
import { motion, staggerContainer, staggerItem } from "../motion/Animated";

const COLORS = ['var(--primary)', 'var(--success)', 'var(--warning)', 'var(--danger)', 'var(--primary-dark)', '#8884d8'];

function groupCount(list, key) {
    const map = {};
    list.forEach((item) => {
        const value = item[key] || 'Unknown';
        map[value] = (map[value] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
}

function StatCard({ label, value }) {
    return (
        <div className="col-6 col-lg-3">
            <div className="stat-card shadow-sm rounded-4 p-3">
                <div className="stat-label">{label}</div>
                <div className="stat-value">{value}</div>
            </div>
        </div>
    );
}

function EmployeeReport() {
    const [empData, setEmpData] = useState([]);
    const { user } = useContext(AuthCon);
    const isAdmin = user?.role === "Admin";

    useEffect(() => {
        axios.get("https://localhost:7238/api/Employee", { withCredentials: true })
            .then((res) => setEmpData(res.data)).catch(() => {});
    }, []);

    const genderData = useMemo(() => groupCount(empData, 'empGender'), [empData]);
    const countryData = useMemo(() => groupCount(empData, 'empCountry'), [empData]);
    const totalSalary = useMemo(() => empData.reduce((s, e) => s + (Number(e.empSalary) || 0), 0), [empData]);
    const avgAge = empData.length ? Math.round(empData.reduce((s, e) => s + (Number(e.empAge) || 0), 0) / empData.length) : 0;

    return (
        <>
            <div className="row g-3 mb-4">
                <StatCard label="Total Employees" value={empData.length} />
                <StatCard label="Countries" value={new Set(empData.map(e => e.empCountry).filter(Boolean)).size} />
                <StatCard label="Average Age" value={avgAge || "—"} />
                {isAdmin && <StatCard label="Total Payroll" value={`₹${totalSalary.toLocaleString()}`} />}
            </div>
            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="chart-card shadow-sm rounded-4 p-3">
                        <h6 className="chart-title">Gender Distribution</h6>
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie data={genderData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}>
                                    {genderData.map((e, i) => <Cell key={e.name} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip /><Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="chart-card shadow-sm rounded-4 p-3">
                        <h6 className="chart-title">Employees by Country</h6>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={countryData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} />
                                <YAxis allowDecimals={false} stroke="var(--text-secondary)" fontSize={12} />
                                <Tooltip />
                                <Bar dataKey="value" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </>
    );
}

function ProjectReport() {
    const [projects, setProjects] = useState([]);
    const [reports, setReports] = useState([]);

    useEffect(() => {
        axios.get("https://localhost:7238/api/Project/GetAllProjects", { withCredentials: true })
            .then((res) => setProjects(res.data)).catch(() => {});
        axios.get("https://localhost:7238/api/Report/AllReports", { withCredentials: true })
            .then((res) => setReports(res.data)).catch(() => {});
    }, []);

    const statusData = useMemo(() => groupCount(reports, 'reportStatus'), [reports]);
    const priorityData = useMemo(() => groupCount(reports, 'priority'), [reports]);
    const totalValue = useMemo(() => projects.reduce((s, p) => s + (Number(p.ammount) || 0), 0), [projects]);

    return (
        <>
            <div className="row g-3 mb-4">
                <StatCard label="Total Projects" value={projects.length} />
                <StatCard label="Total Reports" value={reports.length} />
                <StatCard label="Open Issues" value={reports.filter(r => r.reportStatus?.toLowerCase() === "issue").length} />
                <StatCard label="Contract Value" value={`₹${totalValue.toLocaleString()}`} />
            </div>
            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="chart-card shadow-sm rounded-4 p-3">
                        <h6 className="chart-title">Reports by Status</h6>
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}>
                                    {statusData.map((e, i) => <Cell key={e.name} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip /><Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="chart-card shadow-sm rounded-4 p-3">
                        <h6 className="chart-title">Reports by Priority</h6>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={priorityData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} />
                                <YAxis allowDecimals={false} stroke="var(--text-secondary)" fontSize={12} />
                                <Tooltip />
                                <Bar dataKey="value" fill="var(--primary-dark)" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </>
    );
}

function AdminReport() {
    const { registeredUsers: users } = useContext(AuthCon);

    const roleData = useMemo(() => groupCount(users, 'authRole'), [users]);
    const countryData = useMemo(() => groupCount(users, 'country'), [users]);

    return (
        <>
            <div className="row g-3 mb-4">
                <StatCard label="Total Registered Users" value={users.length} />
                <StatCard label="Admins" value={users.filter(u => u.authRole === "Admin").length} />
                <StatCard label="Managers" value={users.filter(u => u.authRole === "Manager").length} />
                <StatCard label="Employees" value={users.filter(u => u.authRole === "Employee").length} />
            </div>
            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="chart-card shadow-sm rounded-4 p-3">
                        <h6 className="chart-title">Users by Role</h6>
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie data={roleData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}>
                                    {roleData.map((e, i) => <Cell key={e.name} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip /><Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="chart-card shadow-sm rounded-4 p-3">
                        <h6 className="chart-title">Users by Country</h6>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={countryData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} />
                                <YAxis allowDecimals={false} stroke="var(--text-secondary)" fontSize={12} />
                                <Tooltip />
                                <Bar dataKey="value" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </>
    );
}

function Analytics() {
    const [reportType, setReportType] = useState("Employee Report");

    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <div className="d-flex gap-3 mb-4 align-items-center flex-wrap">
                <label className="form-label mb-0 fw-semibold">Report Type</label>
                <select
                    className="form-select rounded-pill p-2"
                    style={{ maxWidth: "260px" }}
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                >
                    <option>Employee Report</option>
                    <option>Project Report</option>
                    <option>Admin Report</option>
                </select>
            </div>

            <motion.div variants={staggerItem}>
                {reportType === "Employee Report" && <EmployeeReport />}
                {reportType === "Project Report" && <ProjectReport />}
                {reportType === "Admin Report" && <AdminReport />}
            </motion.div>
        </motion.div>
    );
}

export default Analytics;
