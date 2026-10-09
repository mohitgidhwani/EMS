using System;
using System.Collections.Generic;

namespace employeeDashboard.Models;

public partial class Project
{
    public int ProjectId { get; set; }

    public string? ProjectName { get; set; }

    public DateTime? ProjectDate { get; set; }

    public string? ClientName { get; set; }

    public string? ClientLocation { get; set; }

    public string? Duration { get; set; }

    public decimal? Ammount { get; set; }

    public string? ProjectCategory { get; set; }

    public DateTime? DeadLine { get; set; }

    public virtual ICollection<ReportDetail> ReportDetails { get; set; } = new List<ReportDetail>();
}
