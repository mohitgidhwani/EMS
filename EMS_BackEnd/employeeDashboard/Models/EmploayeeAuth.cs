using System;
using System.Collections.Generic;

namespace employeeDashboard.Models;

public partial class EmploayeeAuth
{
    public int Id { get; set; }

    public string? AuthName { get; set; }

    public string? AuthRole { get; set; }

    public string? PasswordHash { get; set; }

    public string? Country { get; set; }

    public int? Age { get; set; }

    public string? Gender { get; set; }

    public decimal? Salary { get; set; }

    public DateOnly? JoiningDate { get; set; }

    public string? ProfilePicture { get; set; }
    public string? Email { get; set; }
}
