        using employeeDashboard.Models;

        namespace employeeDashboard.Services
        {
            public interface IAuthService
            {
                Task<bool> RegisterAsync(EmploayeeAuth emploayeeAuth);
                Task<string?> LoginAsync(EmploayeeAuth emploayeeAuth);
                Task<IEnumerable<EmploayeeAuth>> GetRegisterUsers();
                Task DeleteAuth(int id);
            }
        }
