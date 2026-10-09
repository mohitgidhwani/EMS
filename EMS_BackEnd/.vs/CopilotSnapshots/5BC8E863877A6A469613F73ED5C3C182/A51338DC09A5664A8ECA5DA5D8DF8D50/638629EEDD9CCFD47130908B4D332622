using employeeDashboard.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace employeeDashboard.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly EmployeeManagementContext context;

        public AuthRepository(EmployeeManagementContext context)
        {
            this.context = context;
        }

        public async Task<EmploayeeAuth?> LoginAsync(EmploayeeAuth user)
        {
            var dbUser = await context.EmploayeeAuths.FromSqlRaw("EXEC AuthLogin_Sp @AuthName = {0}", user.AuthName)
                          .ToListAsync();

            if (dbUser == null || !dbUser.Any())
            {
                Console.WriteLine("Data Not Found.......!");
                return null;
            }

            var userData = dbUser.FirstOrDefault();

            if (userData == null)
            {
                Console.WriteLine("User not found!");
                return null;
            }

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(user.PasswordHash, userData.PasswordHash);

            if (!isPasswordValid)
            {
                Console.WriteLine("Invalid Username or Password.......!");
                return null;
            }

            Console.WriteLine("Loged IN,,,,!");
            return userData;
        }

        public async Task<bool> RegisterAsync(EmploayeeAuth user)
        {
            try
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);

                var result = await context.Database.ExecuteSqlRawAsync(
                    "EXEC AuthRegister_Sp @AuthName = {0} , @AuthRole = {1} , @PasswordHash = {2} , @Country = {3} ,  @Age = {4}, @Gender = {5}, @Salary = {6} , @JoiningDate = {7} , @ProfilePicture = {8} , @Email = {9}",
                    user.AuthName, user.AuthRole, user.PasswordHash , user.Country , user.Age , user.Gender , user.Salary , user.JoiningDate , user.ProfilePicture , user.Email);

                return result > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error registering user: {ex.Message}");
                return false;
            }
        }


        public async Task<IEnumerable<EmploayeeAuth>> GetRegisterUsers()
        {
            return await context.EmploayeeAuths.FromSqlRaw("EXEC GetRegisterUsers")
                .ToListAsync();
        }


        public async Task DeleteAuth(int id)
        {
             await context.Database.ExecuteSqlRawAsync("EXEC DeleteAuth @id = {0}", id);
        }
    }
}
