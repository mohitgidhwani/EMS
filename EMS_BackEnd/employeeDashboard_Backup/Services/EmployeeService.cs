using employeeDashboard.Models;
using employeeDashboard.Repositories;

namespace employeeDashboard.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository employeeRepository;

        public EmployeeService(IEmployeeRepository employeeRepository)
        {
            this.employeeRepository = employeeRepository;
        }

        public async Task<IEnumerable<EmployeeDatum>> GetAllAsync()
        {
            return await employeeRepository.GetALLAsync();
        }

        public async Task<EmployeeDatum?> GetByIdAsync(int id)
        {
            return await employeeRepository.GetByIdAsync(id);
        }

        public async Task AddAsync(EmployeeDatum employee)
        {
            await employeeRepository.AddAsync(employee);
        }

        public async Task UpdateAsync(EmployeeDatum employee , int id)
        {
            await employeeRepository.UpdateAsync(employee , id);
        }

        public async Task DeleteAsync(int id)
        {
            await employeeRepository.DeleteAsync(id);
        }
    }
}
