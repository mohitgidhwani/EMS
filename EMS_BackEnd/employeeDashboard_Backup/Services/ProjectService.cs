using employeeDashboard.Models;
using employeeDashboard.Repositories;

namespace employeeDashboard.Services
{
    public class ProjectService : IProjectService
    {
        private readonly IProjectRepository projectRepository;

        public ProjectService(IProjectRepository projectRepository)
        {
            this.projectRepository = projectRepository;
        }

        public async Task<IEnumerable<Project>> GetAllProjects()
        {
            return await projectRepository.GetAllProjects();
        }

        public async Task<Project?> GetProjectById(int id)
        {
            return await projectRepository.GetProjectById(id);
        }

        public async Task AddProjectAsync(Project project)
        {
             await projectRepository.AddProjectAsync(project);
        }

        public async Task DeleteProjectAsync(int id)
        {
            await projectRepository.DeleteProjectAsync(id);
        }

        public async Task EditProjectDetails(Project project, int id)
        {
            await projectRepository.EditProjectDetails(project, id);
        }
    }
}


