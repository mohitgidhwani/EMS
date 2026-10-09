/* ============================================================
   New stored procedures for the Settings > Change Password
   and Settings > Update Profile features.

   These follow the same naming/parameter style as the existing
   AuthLogin_Sp / AuthRegister_Sp / GetRegisterUsers procs and
   assume the table is dbo.EmploayeeAuth (confirmed from
   EmployeeManagementContext's entity.ToTable("EmploayeeAuth")).

   Run this once against your EMS database before using the new
   Settings features.
   ============================================================ */

-- Fetch a single user row by username + role (used to verify the
-- current password and to re-read a row after an update).
CREATE OR ALTER PROCEDURE GetUserByNameRole_Sp
    @AuthName NVARCHAR(100),
    @AuthRole NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1 *
    FROM dbo.EmploayeeAuth
    WHERE AuthName = @AuthName AND AuthRole = @AuthRole;
END
GO

-- Update just the password hash for a user (hash is computed in
-- the API with BCrypt before this proc is called).
CREATE OR ALTER PROCEDURE ChangePassword_Sp
    @AuthName NVARCHAR(100),
    @AuthRole NVARCHAR(50),
    @PasswordHash NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.EmploayeeAuth
    SET PasswordHash = @PasswordHash
    WHERE AuthName = @AuthName AND AuthRole = @AuthRole;
END
GO

-- Update the editable profile fields for a user. Pass NULL for
-- any field you don't want to change; the COALESCE keeps the
-- existing value in that case.
CREATE OR ALTER PROCEDURE UpdateProfile_Sp
    @AuthName NVARCHAR(100),
    @AuthRole NVARCHAR(50),
    @NewAuthName NVARCHAR(100) = NULL,
    @Email NVARCHAR(255) = NULL,
    @Country NVARCHAR(100) = NULL,
    @Age INT = NULL,
    @Gender NVARCHAR(100) = NULL,
    @ProfilePicture NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.EmploayeeAuth
    SET
        AuthName = COALESCE(@NewAuthName, AuthName),
        Email = COALESCE(@Email, Email),
        Country = COALESCE(@Country, Country),
        Age = COALESCE(@Age, Age),
        Gender = COALESCE(@Gender, Gender),
        ProfilePicture = COALESCE(@ProfilePicture, ProfilePicture)
    WHERE AuthName = @AuthName AND AuthRole = @AuthRole;
END
GO
