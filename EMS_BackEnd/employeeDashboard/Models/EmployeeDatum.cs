using System;
using System.Collections.Generic;

namespace employeeDashboard.Models;

public partial class EmployeeDatum
{
    public int Id { get; set; }

    public string? EmpName { get; set; }

    public int? EmpAge { get; set; }

    public string? EmpGender { get; set; }

    public decimal? EmpSalary { get; set; }

    public string? EmpCountry { get; set; }

    public string? EmpEmail { get; set; }

    // Self-referencing links (both point back to another EmployeeDatum.Id) used
    // to build the org-chart tree on the Management page.
    public int? ReportingManagerId { get; set; }

    public int? TeamLeadId { get; set; }
}
