import React, { useState } from 'react';

function OrgNode({ employee, childrenMap, highlightId }) {
    const kids = childrenMap[employee.id] || [];
    const [open, setOpen] = useState(true);
    const isHighlighted = highlightId && String(employee.id) === String(highlightId);

    return (
        <li>
            <div className={`org-node shadow-sm ${isHighlighted ? 'org-node-highlight' : ''}`}>
                <div className="org-node-avatar">
                    {employee.empName ? employee.empName.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="org-node-name">{employee.empName}</div>
                {employee.empEmail && <div className="org-node-sub">{employee.empEmail}</div>}
                {employee.empCountry && <div className="org-node-sub">{employee.empCountry}</div>}

                {kids.length > 0 && (
                    <button
                        type="button"
                        className="org-node-toggle"
                        onClick={() => setOpen((o) => !o)}
                        aria-label={open ? "Collapse" : "Expand"}
                    >
                        {open ? "−" : "+"} {kids.length}
                    </button>
                )}
            </div>

            {kids.length > 0 && open && (
                <ul>
                    {kids.map((child) => (
                        <OrgNode key={child.id} employee={child} childrenMap={childrenMap} highlightId={highlightId} />
                    ))}
                </ul>
            )}
        </li>
    );
}

// Renders one or more root nodes (usually just the CEO / top-of-hierarchy)
// as a classic connected org chart, built from each employee's
// reportingManagerId. TeamLeadId is shown as extra context on the manager's
// own card rather than as a second branch — a tree needs one parent per node.
function OrgChart({ employees, highlightId }) {
    const childrenMap = {};
    const byId = {};
    employees.forEach((e) => { byId[e.id] = e; });

    const roots = [];
    employees.forEach((e) => {
        const managerId = e.reportingManagerId;
        if (managerId && byId[managerId]) {
            if (!childrenMap[managerId]) childrenMap[managerId] = [];
            childrenMap[managerId].push(e);
        } else {
            roots.push(e);
        }
    });

    if (roots.length === 0) {
        return <p className="text-secondary">No employees to display yet.</p>;
    }

    return (
        <div className="org-tree-scroll">
            <ul className="org-tree">
                {roots.map((root) => (
                    <OrgNode key={root.id} employee={root} childrenMap={childrenMap} highlightId={highlightId} />
                ))}
            </ul>
        </div>
    );
}

export default OrgChart;
