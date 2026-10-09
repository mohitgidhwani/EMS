using employeeDashboard.Models;
using employeeDashboard.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace employeeDashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly IProjectRepository projectRepository;

        public ProjectController(IProjectRepository projectRepository)
        {
            this.projectRepository = projectRepository;
        }

        [HttpGet("GetAllProjects")]
        [Authorize]
        public async Task<ActionResult> GetAllProjectsAsync()
        {
            var data = await projectRepository.GetAllProjects();

            if (data != null) {
                return Ok(data);
            }
            else
            {
                return BadRequest("Data Not Found....!");
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult> GetProjectById(int id)
        {
            var data = await projectRepository.GetProjectById(id);

            if(data != null)
            {
                return Ok(data);
            }
            else
            {
                return BadRequest("Data Not Found.....!");
            }

        }


        [HttpPost("AddProject")]
        //[Authorize(Roles = "Admin , Manager")]
        public async Task<ActionResult> AddProjectAsync(Project project)
        {
            await projectRepository.AddProjectAsync(project);

            return Ok(project);
        }


        [HttpDelete("DeleteProjectById/{id}")]
        public async Task<ActionResult> DeleteProjectById(int id)
        {


            await projectRepository.DeleteProjectAsync(id);

            return Ok(new
            {
                message = "User Deleted Successfully....1",
                UserId = id
            });
        }


        [HttpPut("EditProject/{id}")]
        public async Task<ActionResult> EditProjectDetails(Project project , int id)
        {
            await projectRepository.EditProjectDetails(project, id);

            return Ok(new
            {
                message = "User Edited....!",
                ProjectId = id,
                Project = project
            });
        }
    }
}
