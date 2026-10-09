        using employeeDashboard.Models;

        namespace employeeDashboard.Services
        {
            public interface IAuthService
            {
                Task<bool> RegisterAsync(EmploayeeAuth emploayeeAuth);
                Task<string?> LoginAsync(EmploayeeAuth emploayeeAuth);
                Task<IEnumerable<EmploayeeAuth>> GetRegisterUsers();
                Task DeleteAuth(int id);
                Task<bool> ChangePasswordAsync(string authName, string authRole, string currentPassword, string newPassword);
                Task<EmploayeeAuth?> UpdateProfileAsync(string authName, string authRole, UpdateProfileDto profile);
                Task<int> CompressAllProfilePicturesAsync();
            }
        }
