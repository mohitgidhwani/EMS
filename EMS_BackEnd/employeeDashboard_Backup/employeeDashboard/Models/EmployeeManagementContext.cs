using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace employeeDashboard.Models;

public partial class EmployeeManagementContext : DbContext
{
    public EmployeeManagementContext()
    {
    }

    public EmployeeManagementContext(DbContextOptions<EmployeeManagementContext> options)
        : base(options)
    {
    }

    public virtual DbSet<EmploayeeAuth> EmploayeeAuths { get; set; }

    public virtual DbSet<EmployeeDatum> EmployeeData { get; set; }

    public virtual DbSet<EmployeeLog> EmployeeLogs { get; set; }

    public virtual DbSet<Project> Projects { get; set; }

    public virtual DbSet<ReportDetail> ReportDetails { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<EmploayeeAuth>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Emploaye__3213E83F652C90C9");

            entity.ToTable("EmploayeeAuth");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AuthName)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.AuthRole)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Country)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Gender)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.PasswordHash).IsUnicode(false);
            entity.Property(e => e.Salary).HasColumnType("decimal(18, 0)");
        });

        modelBuilder.Entity<EmployeeDatum>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Employee__3213E83FEE77B62F");

            entity.ToTable(tb => tb.HasTrigger("trg_EmployeeLogs"));

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.EmpCountry)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.EmpEmail)
                .HasMaxLength(500)
                .IsFixedLength();
            entity.Property(e => e.EmpGender)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.EmpName)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.EmpSalary).HasColumnType("decimal(18, 0)");
        });

        modelBuilder.Entity<EmployeeLog>(entity =>
        {
            entity.HasKey(e => e.LogId).HasName("PK__Employee__7839F64DB41E88DB");

            entity.Property(e => e.LogId).HasColumnName("logId");
            entity.Property(e => e.ActionType)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.ChangeDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.EmpCountry)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.EmpEmail)
                .HasMaxLength(500)
                .IsFixedLength();
            entity.Property(e => e.EmpGender)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.EmpName)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.EmpSalary).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.Id).HasColumnName("id");
        });

        modelBuilder.Entity<Project>(entity =>
        {
            entity.HasKey(e => e.ProjectId).HasName("PK__Projects__761ABEF028D005F3");

            entity.Property(e => e.Ammount).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.ClientLocation)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.ClientName)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.DeadLine).HasColumnType("datetime");
            entity.Property(e => e.Duration).HasMaxLength(100);
            entity.Property(e => e.ProjectCategory)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.ProjectDate).HasColumnType("datetime");
            entity.Property(e => e.ProjectName).HasMaxLength(200);
        });

        modelBuilder.Entity<ReportDetail>(entity =>
        {
            entity.HasKey(e => e.ReportId).HasName("PK__ReportDe__D5BD4805FF2E2155");

            entity.Property(e => e.IssueDetails).HasMaxLength(500);
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsFixedLength();
            entity.Property(e => e.Priority)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Report).HasMaxLength(500);
            entity.Property(e => e.ReportDate).HasColumnName("reportDate");
            entity.Property(e => e.ReportStatus)
                .HasMaxLength(100)
                .IsUnicode(false);

            entity.HasOne(d => d.Project).WithMany(p => p.ReportDetails)
                .HasForeignKey(d => d.ProjectId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_Report_Project");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
