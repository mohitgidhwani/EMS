using employeeDashboard.Models;

namespace employeeDashboard.Repositories
{
    public interface IReportRepository
    {
        Task AddReportAsync(ReportDetail reportDetail);
        Task<IEnumerable<ReportDetail>> GetAllReports();
        Task<ReportDetail?> GetReportById(int id);
    }
}
