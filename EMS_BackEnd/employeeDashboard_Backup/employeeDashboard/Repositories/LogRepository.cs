using employeeDashboard.Models;
using Microsoft.EntityFrameworkCore;

namespace employeeDashboard.Repositories
{
    public class LogRepository : ILogRepository
    {
        private readonly EmployeeManagementContext context;

        public LogRepository(EmployeeManagementContext context)
        {
            this.context = context;
        }

        private const string logsQuery = "EXEC EmployeeLogs_SP @ACTION = {0} , @logId = {1}";

        private async  Task<IEnumerable<EmployeeLog>> ExcuteLogsAsync(string action , int logId)
        {
          var data =   await context.EmployeeLogs.FromSqlRaw(
                  logsQuery,
                  action,
                  logId
                )

              .ToListAsync();
            return data;
        }
        
        public async Task<IEnumerable<EmployeeLog>> GetAllLogsAsync()
        {
           return await ExcuteLogsAsync("GETALLLOG", 0);
        }

        public async Task<EmployeeLog?> GetLogByIdAsync(int logId)
        {
            var data = await ExcuteLogsAsync("GETLOGBYID", logId);

            return data.FirstOrDefault();
        }
    }
}
