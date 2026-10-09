using employeeDashboard.Models;

namespace employeeDashboard.Services
{
    public interface IReportService
    {
        Task AddReportAsync(ReportDetail reportDetail);

        Task<IEnumerable<ReportDetail>> GetAllReports();

        Task<ReportDetail?> GetReportById(int id);
    }
}
