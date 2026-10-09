import React, { useMemo } from 'react';
import {
    ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

// Palette pulled from the app's own accent + status tokens so the
// charts always match whichever color theme is active.
const COLORS = ['var(--primary)', 'var(--success)', 'var(--warning)', 'var(--danger)', 'var(--primary-dark)', '#8884d8'];

function groupCount(list, key) {
    const map = {};
    list.forEach((item) => {
        const value = item[key] || 'Unknown';
        map[value] = (map[value] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
}

function DashboardCharts({ empData, showSalary }) {
    const genderData = useMemo(() => groupCount(empData, 'empGender'), [empData]);
    const countryData = useMemo(() => groupCount(empData, 'empCountry'), [empData]);

    const salaryByCountry = useMemo(() => {
        if (!showSalary) return [];
        const map = {};
        empData.forEach((e) => {
            const key = e.empCountry || 'Unknown';
            map[key] = (map[key] || 0) + (Number(e.empSalary) || 0);
        });
        return Object.entries(map).map(([name, salary]) => ({ name, salary }));
    }, [empData, showSalary]);

    return (
        <div className="row g-4 mb-4">
            <div className="col-lg-4">
                <div className="chart-card shadow-sm rounded-4 p-3 h-100">
                    <h6 className="chart-title">Gender Distribution</h6>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie data={genderData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3}>
                                {genderData.map((entry, index) => (
                                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="col-lg-4">
                <div className="chart-card shadow-sm rounded-4 p-3 h-100">
                    <h6 className="chart-title">Employees by Country</h6>
                    <ResponsiveContainer width="100%" height={220}>
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

            {showSalary && (
                <div className="col-lg-4">
                    <div className="chart-card shadow-sm rounded-4 p-3 h-100">
                        <h6 className="chart-title">Payroll by Country</h6>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={salaryByCountry}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} />
                                <YAxis stroke="var(--text-secondary)" fontSize={12} />
                                <Tooltip formatter={(v) => `₹${Number(v).toLocaleString()}`} />
                                <Bar dataKey="salary" fill="var(--primary-dark)" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DashboardCharts;
