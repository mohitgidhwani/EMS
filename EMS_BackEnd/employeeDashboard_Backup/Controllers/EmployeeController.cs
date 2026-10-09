using employeeDashboard.Models;
using employeeDashboard.Repositories;
using employeeDashboard.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace employeeDashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService employeeService;

        public EmployeeController(IEmployeeService employeeService)
        {
            this.employeeService = employeeService;
        }   


       
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult> GetAll()
        {
            var data = await employeeService.GetAllAsync();

           if(data == null) { return BadRequest("Data not found.....!"); }
            return Ok(data);
        }


     
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> GetByIdAsync(int id)
        {
            var data = await employeeService.GetByIdAsync(id);


            if(data == null)
            {
                return BadRequest("Data Not Found.....!");
            }

            return Ok(data);
        }

        [HttpPost]
        [Authorize(Roles = "Admin , Manager")]
        public async Task<ActionResult> AddAsync(EmployeeDatum employee)
        {
            await employeeService.AddAsync(employee);

            return Ok(employee);
        }

        [HttpPatch("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateAsync(EmployeeDatum employee, int id){
            await employeeService.UpdateAsync(employee, id);

            return Ok("User Changed Succcessfully.....!");
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteAsync(int id)
        {
            await employeeService.DeleteAsync(id);

            return Ok("Successfully Employee Deleted....!");
        }
    }
}
