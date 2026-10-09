using employeeDashboard.Models;

namespace employeeDashboard.Services
{
    public interface IProjectService
    {
        Task<IEnumerable<Project>> GetAllProjects();

        Task<Project?> GetProjectById(int id);

        Task AddProjectAsync(Project project);

        Task DeleteProjectAsync(int id);

        Task EditProjectDetails(Project project, int id);
    }
}
