using employeeDashboard.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace employeeDashboard.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly EmployeeManagementContext context;

        public EmployeeRepository(EmployeeManagementContext context)
        {
            this.context = context;
        }

        //private const string spQuary = "EXEC EmployeeData_SP @ACTION = {0} , @id = {1} , @EmpName = {2} ,  @EmpAge = {3} , @EmpGender = {4} ,  @EmpSalary = {5} , @EmpCountry = {6}";

        //private async Task ExecuteAsync(EmployeeDatum? employee , string action, int id = 0)
        //{
        //    await context.Database.ExecuteSqlRawAsync(
        //           spQuary,
        //           action,
        //           id,
        //           employee?.EmpName ?? "",
        //           employee?.EmpAge ?? 0,
        //           employee?.EmpGender ?? "",
        //           employee?.EmpSalary ?? 0 ,
        //           employee?.EmpCountry ?? ""
        //        );
        //}

        public async Task AddAsync(EmployeeDatum employee)
        {
            await context.Database.ExecuteSqlRawAsync(
                "EXEC Employee_UpsertSp @id = {0} , @EmpName = {1} ,  @EmpAge = {2} , @EmpGender = {3} ,  @EmpSalary = {4} , @EmpCountry = {5} , @EmpEmail = {6} , @ReportingManagerId = {7} , @TeamLeadId = {8}",
                0, employee.EmpName, employee.EmpAge, employee.EmpGender, employee.EmpSalary, employee.EmpCountry, employee.EmpEmail, employee.ReportingManagerId, employee.TeamLeadId);
        }

        public async Task DeleteAsync(int id)
        {
            await context.Database.ExecuteSqlRawAsync("EXEC Employee_DeleteSp @id = {0}", id);
        }

        public async Task<IEnumerable<EmployeeDatum>> GetALLAsync()
        {
            return await context.EmployeeData.FromSqlRaw("EXEC Employee_GetAllSp")
               .ToListAsync();
        }

        public async Task<EmployeeDatum> GetByIdAsync(int id)
        {
         var data = await context.EmployeeData
                .FromSqlRaw(
                  "EXEC Employee_GetByIdSp @id = {0}" , id
                )
                .ToListAsync();

        
               return data.FirstOrDefault();
        }

        public async Task UpdateAsync(EmployeeDatum employee , int id)
        {
            await context.Database.ExecuteSqlRawAsync(
                "EXEC Employee_UpsertSp @id = {0} , @EmpName = {1} ,  @EmpAge = {2} , @EmpGender = {3} ,  @EmpSalary = {4} , @EmpCountry = {5} ,  @EmpEmail = {6} , @ReportingManagerId = {7} , @TeamLeadId = {8}",
                id, employee.EmpName, employee.EmpAge, employee.EmpGender, employee.EmpSalary, employee.EmpCountry, employee.EmpEmail, employee.ReportingManagerId, employee.TeamLeadId);
        }
    }
}