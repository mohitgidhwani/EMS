using employeeDashboard.Models;
using employeeDashboard.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace employeeDashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly IReportRepository reportRepository;

        public ReportController(IReportRepository reportRepository)
        {
            this.reportRepository = reportRepository;
        }

        [HttpPost("AddReport")]
        public async Task<ActionResult> AddReportAsync(ReportDetail reportDetail)
        {
           await reportRepository.AddReportAsync(reportDetail);

            return Ok(reportDetail);

        }

        [HttpGet("AllReports")]
        public async Task<ActionResult> GetAllReports()
        {
            var data = await reportRepository.GetAllReports();

            if(data != null)
            {
                return Ok(data);
            }
            else
            {
                return BadRequest("Data Not Found.....!");
            }
        }

        [HttpGet("ReportGetById/{id}")]
        public async Task<ActionResult> GetReportById(int id)
        {
            var data = await reportRepository.GetReportById(id);

            if(data != null)
            {
                return Ok(data);
            }
            else
            {
                return BadRequest("Data Not Found....!");
            }
        }
    }
}
