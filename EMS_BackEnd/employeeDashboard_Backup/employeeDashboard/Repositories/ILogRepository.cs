using employeeDashboard.Models;

namespace employeeDashboard.Repositories
{
    public interface ILogRepository
    {
        Task<IEnumerable<EmployeeLog>> GetAllLogsAsync();
        Task<EmployeeLog?> GetLogByIdAsync(int logId);
    }
}
