using employeeDashboard.Models;
using Microsoft.EntityFrameworkCore;

namespace employeeDashboard.Repositories
{
    public class ReportRepository : IReportRepository
    {
        private readonly EmployeeManagementContext context;

        public ReportRepository(EmployeeManagementContext context)
        {
            this.context = context;
        }


        public async Task AddReportAsync(ReportDetail reportDetail)
        {
            await context.Database.ExecuteSqlRawAsync("EXEC AddProjectReport @Report = {0} , @ReportStatus = {1} , @IssueDetails = {2} , @Priority = {3} , @ProjectId = {4} , @Name = {5} , @reportDate = {6}",
               reportDetail.Report, reportDetail.ReportStatus, reportDetail.IssueDetails, reportDetail.Priority, reportDetail.ProjectId , reportDetail.Name , reportDetail.ReportDate);
        }

        public async Task<IEnumerable<ReportDetail>> GetAllReports()
        {
           return await context.ReportDetails.FromSqlRaw("EXEC GetAllReports")
               .ToListAsync();     
        }

        public async Task<ReportDetail?> GetReportById(int id)
        {
            var data = await context.ReportDetails.FromSqlRaw("EXEC GetReportById @ReportId = {0}", id)
                .ToListAsync();
            return data.FirstOrDefault();
        }
    }
}
