using employeeDashboard.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace employeeDashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmpLogsController : ControllerBase
    {
        private readonly ILogRepository logRepository;

        public EmpLogsController(ILogRepository logRepository)
        {
            this.logRepository = logRepository;
        }



        [HttpGet("AllLogs")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> GetAllLogsAsync()
        {
          var data =  await logRepository.GetAllLogsAsync();


            if(data != null)
            {
                return Ok(data);
            }
            else
            {
                return BadRequest("Data Not Found....!");
            }
        }


        [HttpGet("{logId}")]
        public async Task<ActionResult> GetLogByIdAsync(int logId)
        {
            var dataId = await logRepository.GetLogByIdAsync(logId);


            if(dataId != null)
            {
                return Ok(dataId);
            }
            else
            {
                return BadRequest("Data Not Found....!");
            }
            
        }

    }
}
