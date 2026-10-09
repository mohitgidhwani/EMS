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

/* ============================================================
   Org-chart hierarchy for the Management page.
   Adds ReportingManagerId / TeamLeadId to EmployeeData (both are
   nullable self-references to EmployeeData.Id), a new upsert proc
   that includes them, and refreshes the two read procs so the new
   columns actually come back to the frontend.

   NOTE: Employee_GetAllSp / Employee_GetByIdSp below are written as
   plain "SELECT * FROM EmployeeData" — if your actual versions do
   anything more than that, don't run these two blocks; just add
   ReportingManagerId/TeamLeadId to your existing SELECT list by hand
   instead, so you don't lose whatever else they do.
   ============================================================ */

IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.EmployeeData') AND name = 'ReportingManagerId')
BEGIN
    ALTER TABLE dbo.EmployeeData ADD ReportingManagerId INT NULL;
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.EmployeeData') AND name = 'TeamLeadId')
BEGIN
    ALTER TABLE dbo.EmployeeData ADD TeamLeadId INT NULL;
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_EmployeeData_ReportingManager')
BEGIN
    ALTER TABLE dbo.EmployeeData
    ADD CONSTRAINT FK_EmployeeData_ReportingManager FOREIGN KEY (ReportingManagerId)
        REFERENCES dbo.EmployeeData(Id) ON DELETE SET NULL;
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_EmployeeData_TeamLead')
BEGIN
    ALTER TABLE dbo.EmployeeData
    ADD CONSTRAINT FK_EmployeeData_TeamLead FOREIGN KEY (TeamLeadId)
        REFERENCES dbo.EmployeeData(Id) ON DELETE SET NULL;
END
GO

-- New upsert proc (INSERT when @id = 0, otherwise UPDATE) used by both
-- Add Employee and Edit Employee — replaces the old Employee_InsertSp
-- call in the C# repository; the original proc is left untouched.
CREATE OR ALTER PROCEDURE Employee_UpsertSp
    @id INT,
    @EmpName NVARCHAR(100) = NULL,
    @EmpAge INT = NULL,
    @EmpGender NVARCHAR(50) = NULL,
    @EmpSalary DECIMAL(18, 0) = NULL,
    @EmpCountry NVARCHAR(50) = NULL,
    @EmpEmail NVARCHAR(500) = NULL,
    @ReportingManagerId INT = NULL,
    @TeamLeadId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @id IS NULL OR @id = 0
    BEGIN
        INSERT INTO dbo.EmployeeData
            (EmpName, EmpAge, EmpGender, EmpSalary, EmpCountry, EmpEmail, ReportingManagerId, TeamLeadId)
        VALUES
            (@EmpName, @EmpAge, @EmpGender, @EmpSalary, @EmpCountry, @EmpEmail, @ReportingManagerId, @TeamLeadId);
    END
    ELSE
    BEGIN
        UPDATE dbo.EmployeeData
        SET EmpName = @EmpName,
            EmpAge = @EmpAge,
            EmpGender = @EmpGender,
            EmpSalary = @EmpSalary,
            EmpCountry = @EmpCountry,
            EmpEmail = @EmpEmail,
            ReportingManagerId = @ReportingManagerId,
            TeamLeadId = @TeamLeadId
        WHERE Id = @id;
    END
END
GO

-- Only run these two if your existing versions are plain SELECT * (see note above).
CREATE OR ALTER PROCEDURE Employee_GetAllSp
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM dbo.EmployeeData;
END
GO

CREATE OR ALTER PROCEDURE Employee_GetByIdSp
    @id INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM dbo.EmployeeData WHERE Id = @id;
END
GO

-- Lightweight login lookup — same shape as your existing AuthLogin_Sp but
-- with ProfilePicture forced to NULL. Login only needs the password hash;
-- there's no reason to transfer a large base64 image on every sign-in.
-- Adjust the SELECT list if your EmploayeeAuth columns differ slightly.
CREATE OR ALTER PROCEDURE AuthLoginLite_Sp
    @AuthName NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        Id,
        AuthName,
        AuthRole,
        PasswordHash,
        Country,
        Age,
        Gender,
        Salary,
        JoiningDate,
        CAST(NULL AS NVARCHAR(MAX)) AS ProfilePicture,
        Email
    FROM dbo.EmploayeeAuth
    WHERE AuthName = @AuthName;
END
GO

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
