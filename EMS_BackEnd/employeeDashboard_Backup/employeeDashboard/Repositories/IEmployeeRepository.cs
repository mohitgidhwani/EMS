using employeeDashboard.Models;

namespace employeeDashboard.Repositories
{
    public interface IEmployeeRepository
    {
        Task<IEnumerable<EmployeeDatum>> GetALLAsync();
        Task<EmployeeDatum> GetByIdAsync(int id);
        Task AddAsync(EmployeeDatum employee);
        Task UpdateAsync(EmployeeDatum employee , int id);
        Task DeleteAsync(int id);
    }
}
