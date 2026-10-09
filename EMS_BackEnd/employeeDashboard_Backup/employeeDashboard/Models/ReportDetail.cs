using System;
using System.Collections.Generic;

namespace employeeDashboard.Models;

public partial class ReportDetail
{
    public int ReportId { get; set; }

    public string? Report { get; set; }

    public string? ReportStatus { get; set; }

    public string? IssueDetails { get; set; }

    public string? Priority { get; set; }

    public int? ProjectId { get; set; }

    public string? Name { get; set; }

    public DateOnly? ReportDate { get; set; }

    public virtual Project? Project { get; set; }
}
