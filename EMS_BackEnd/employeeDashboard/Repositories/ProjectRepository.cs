using employeeDashboard.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace employeeDashboard.Repositories
{
    public class ProjectRepository : IProjectRepository
    {
        private readonly EmployeeManagementContext context;

        public ProjectRepository(EmployeeManagementContext context)
        {
            this.context = context;
        }

        public async Task<IEnumerable<Project>> GetAllProjects()
        {
            return await context.Projects.FromSqlRaw("EXEC GetProjectDetails")
                 .ToListAsync();
        }

        public async Task<Project?> GetProjectById(int id)
        {
            var data = await context.Projects.FromSqlRaw("EXEC GetProjectById @ProjectId={0}", id)
            .ToListAsync();


            return data.FirstOrDefault();
        }

        public async Task AddProjectAsync(Project project)
        {
            await context.Database.ExecuteSqlRawAsync("EXEC AddEditProjectDetails @ProjectId = {0} , @ProjectName = {1} , @ProjectDate = {2} , @ClientName = {3} , @ClientLocation = {4} , @Duration = {5} , @Ammount = {6} ,  @ProjectCategory = {7} , @DeadLine = {8}",
               0, project.ProjectName, project.ProjectDate, project.ClientName, project.ClientLocation, project.Duration, project.Ammount, project.ProjectCategory, project.DeadLine);
        }

        public async Task DeleteProjectAsync(int id)
        {

            await context.Database.ExecuteSqlRawAsync("EXEC DeleteProjectById @ProjectId={0}", id);


        }

        public async Task EditProjectDetails(Project project, int id)
        {
            await context.Database.ExecuteSqlRawAsync("EXEC AddEditProjectDetails @ProjectId = {0} , @ProjectName = {1} , @ProjectDate = {2} , @ClientName = {3} , @ClientLocation = {4} , @Duration = {5} , @Ammount = {6} ,  @ProjectCategory = {7} , @DeadLine = {8}",
                id, project.ProjectName, project.ProjectDate, project.ClientName, project.ClientLocation, project.Duration, project.Ammount, project.ProjectCategory, project.DeadLine);
        }
    }
}


