using System;

namespace employeeDashboard.Models;

// Used for updating the logged-in user's own profile details from Settings.
// AuthName is included because the username can be changed too (name change),
// the repository resolves the row to update from the JWT identity, not from this field.
public class UpdateProfileDto
{
    public string? AuthName { get; set; }
    public string? Email { get; set; }
    public string? Country { get; set; }
    public int? Age { get; set; }
    public string? Gender { get; set; }
    public string? ProfilePicture { get; set; }
}
