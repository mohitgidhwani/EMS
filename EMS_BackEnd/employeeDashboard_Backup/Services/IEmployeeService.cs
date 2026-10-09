using employeeDashboard.Models;

namespace employeeDashboard.Services
{
    public interface IEmployeeService
    {
        Task<IEnumerable<EmployeeDatum>> GetAllAsync();
        Task<EmployeeDatum?> GetByIdAsync(int id);
        Task AddAsync(EmployeeDatum employee);
        Task UpdateAsync(EmployeeDatum employee , int id);
        Task DeleteAsync(int id);
    }
}
