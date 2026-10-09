using employeeDashboard.Models;

namespace employeeDashboard.Repositories
{
    public interface IProjectRepository
    {
        Task AddProjectAsync(Project project);
        Task DeleteProjectAsync(int id);
        Task EditProjectDetails(Project project, int id);
        Task<IEnumerable<Project>> GetAllProjects();
        Task<Project?> GetProjectById(int id);
    }
}