using employeeDashboard.Models;
using employeeDashboard.Repositories;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace employeeDashboard.Services
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository authRepository;
        private readonly IConfiguration config;

        public AuthService(IAuthRepository authRepository , IConfiguration config)
        {
            this.authRepository = authRepository;
            this.config = config;
        }

        public async Task<string?> LoginAsync(EmploayeeAuth emploayeeAuth)
        {
            var user = await authRepository.LoginAsync(emploayeeAuth);
            if (user == null) return null;

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.AuthName),
                new Claim(ClaimTypes.Role, user.AuthRole)
            };

            var token = new JwtSecurityToken(
                issuer: config["Jwt:Issuer"],
                audience: config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(config["Jwt:ExpiresInMinutes"] ?? "30")),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }



        public async Task<bool> RegisterAsync(EmploayeeAuth emploayeeAuth)
        {

          return  await authRepository.RegisterAsync(emploayeeAuth);
        }

        public async Task<IEnumerable<EmploayeeAuth>> GetRegisterUsers()
        {
            return await authRepository.GetRegisterUsers();
        }

        public async Task DeleteAuth(int id)
        {
            await authRepository.DeleteAuth(id);
        }

        public async Task<bool> ChangePasswordAsync(string authName, string authRole, string currentPassword, string newPassword)
        {
            return await authRepository.ChangePasswordAsync(authName, authRole, currentPassword, newPassword);
        }

        public async Task<EmploayeeAuth?> UpdateProfileAsync(string authName, string authRole, UpdateProfileDto profile)
        {
            return await authRepository.UpdateProfileAsync(authName, authRole, profile);
        }

        public async Task<int> CompressAllProfilePicturesAsync()
        {
            return await authRepository.CompressAllProfilePicturesAsync();
        }
    }
}
