using employeeDashboard.Models;

namespace employeeDashboard.Repositories
{
    public interface IAuthRepository
    {
        Task<bool> RegisterAsync(EmploayeeAuth user);
        Task<EmploayeeAuth?> LoginAsync(EmploayeeAuth user);
        Task<IEnumerable<EmploayeeAuth>> GetRegisterUsers();
        Task DeleteAuth(int id);
        Task<bool> ChangePasswordAsync(string authName, string authRole, string currentPassword, string newPassword);
        Task<EmploayeeAuth?> UpdateProfileAsync(string authName, string authRole, UpdateProfileDto profile);
    }
}
