using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace employeeDashboard.Models;

public partial class ApplicationDbContext : DbContext
{
    public ApplicationDbContext()
    {
    }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<EmploayeeAuth> EmploayeeAuths { get; set; }

    public virtual DbSet<EmployeeDatum> EmployeeData { get; set; }

    public virtual DbSet<EmployeeLog> EmployeeLogs { get; set; }

    public virtual DbSet<Project> Projects { get; set; }

    public virtual DbSet<ReportDetail> ReportDetails { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {

    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<EmploayeeAuth>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Emploaye__3213E83F652C90C9");
        });

        modelBuilder.Entity<EmployeeDatum>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Employee__3213E83FEE77B62F");

            entity.ToTable(tb => tb.HasTrigger("trg_EmployeeLogs"));
        });

        modelBuilder.Entity<EmployeeLog>(entity =>
        {
            entity.HasKey(e => e.LogId).HasName("PK__Employee__7839F64DB41E88DB");

            entity.Property(e => e.ChangeDate).HasDefaultValueSql("(getdate())");
        });

        modelBuilder.Entity<Project>(entity =>
        {
            entity.HasKey(e => e.ProjectId).HasName("PK__Projects__761ABEF028D005F3");
        });

        modelBuilder.Entity<ReportDetail>(entity =>
        {
            entity.HasKey(e => e.ReportId).HasName("PK__ReportDe__D5BD4805FF2E2155");

            entity.Property(e => e.Name).IsFixedLength();

            entity.HasOne(d => d.Project).WithMany(p => p.ReportDetails)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_Report_Project");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
