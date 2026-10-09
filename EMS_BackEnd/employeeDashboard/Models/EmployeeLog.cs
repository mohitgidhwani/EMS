using System;
using System.Collections.Generic;

namespace employeeDashboard.Models;

public partial class EmployeeLog
{
    public int LogId { get; set; }

    public int? Id { get; set; }

    public string? EmpName { get; set; }

    public int? EmpAge { get; set; }

    public string? EmpGender { get; set; }

    public decimal? EmpSalary { get; set; }

    public string? EmpCountry { get; set; }

    public string? ActionType { get; set; }

    public DateTime? ChangeDate { get; set; }

    public string? EmpEmail { get; set; }
}
