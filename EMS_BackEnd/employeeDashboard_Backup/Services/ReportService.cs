using employeeDashboard.Models;
using employeeDashboard.Repositories;

namespace employeeDashboard.Services
{
    public class ReportService : IReportService
    {
        private readonly IReportRepository reportRepository;

        public ReportService(IReportRepository reportRepository )
        {
            this.reportRepository = reportRepository;
        }

        public async Task AddReportAsync(ReportDetail reportDetail)
        {
            await reportRepository.AddReportAsync(reportDetail);
        }

        public async Task<IEnumerable<ReportDetail>> GetAllReports()
        {
            return await reportRepository.GetAllReports();
        }

        public async Task<ReportDetail?> GetReportById(int id)
        {
            return await reportRepository.GetReportById(id);

        }
    }
}
