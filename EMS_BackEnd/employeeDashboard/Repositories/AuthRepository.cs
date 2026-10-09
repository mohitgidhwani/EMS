using employeeDashboard.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Processing;

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
            // AuthLoginLite_Sp returns the same columns as AuthLogin_Sp but with
            // ProfilePicture forced to NULL — login only needs the password hash,
            // so there's no reason to pull a multi-hundred-KB base64 image over
            // the wire on every sign-in. AsNoTracking() since this is read-only.
            var dbUser = await context.EmploayeeAuths
                          .FromSqlRaw("EXEC AuthLoginLite_Sp @AuthName = {0}", user.AuthName)
                          .AsNoTracking()
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
            // Read-only list (used for the Navbar/Settings/Analytics avatar + role
            // display) — AsNoTracking() skips EF's change-tracking bookkeeping for
            // rows nothing here ever updates via EF.
            return await context.EmploayeeAuths
                .FromSqlRaw("EXEC GetRegisterUsers")
                .AsNoTracking()
                .ToListAsync();
        }


        public async Task DeleteAuth(int id)
        {
             await context.Database.ExecuteSqlRawAsync("EXEC DeleteAuth @id = {0}", id);
        }

        public async Task<bool> ChangePasswordAsync(string authName, string authRole, string currentPassword, string newPassword)
        {
            var rows = await context.EmploayeeAuths
                .FromSqlRaw("EXEC GetUserByNameRole_Sp @AuthName = {0}, @AuthRole = {1}", authName, authRole)
                .AsNoTracking()
                .ToListAsync();

            var dbUser = rows.FirstOrDefault();
            if (dbUser == null)
            {
                return false;
            }

            bool isCurrentValid = BCrypt.Net.BCrypt.Verify(currentPassword, dbUser.PasswordHash);
            if (!isCurrentValid)
            {
                return false;
            }

            var newHash = BCrypt.Net.BCrypt.HashPassword(newPassword);

            var result = await context.Database.ExecuteSqlRawAsync(
                "EXEC ChangePassword_Sp @AuthName = {0}, @AuthRole = {1}, @PasswordHash = {2}",
                authName, authRole, newHash);

            return result > 0;
        }

        public async Task<EmploayeeAuth?> UpdateProfileAsync(string authName, string authRole, UpdateProfileDto profile)
        {
            var newAuthName = string.IsNullOrWhiteSpace(profile.AuthName) ? authName : profile.AuthName;

            await context.Database.ExecuteSqlRawAsync(
                "EXEC UpdateProfile_Sp @AuthName = {0}, @AuthRole = {1}, @NewAuthName = {2}, @Email = {3}, @Country = {4}, @Age = {5}, @Gender = {6}, @ProfilePicture = {7}",
                authName, authRole, newAuthName, profile.Email, profile.Country, profile.Age, profile.Gender, profile.ProfilePicture);

            var rows = await context.EmploayeeAuths
                .FromSqlRaw("EXEC GetUserByNameRole_Sp @AuthName = {0}, @AuthRole = {1}", newAuthName, authRole)
                .AsNoTracking()
                .ToListAsync();

            return rows.FirstOrDefault();
        }

        // One-off cleanup for images stored before the upload-time resize was
        // added — re-encodes every existing ProfilePicture down to a small
        // avatar, in place, via the same UpdateProfile_Sp used elsewhere.
        // Safe to run more than once (already-small images just get skipped).
        public async Task<int> CompressAllProfilePicturesAsync()
        {
            const int maxDim = 300;
            const int quality = 75;
            const int skipIfSmallerThanBytes = 60_000; // ~60KB — already small enough

            var users = await context.EmploayeeAuths
                .FromSqlRaw("EXEC GetRegisterUsers")
                .AsNoTracking()
                .ToListAsync();

            int updated = 0;

            foreach (var user in users)
            {
                if (string.IsNullOrWhiteSpace(user.ProfilePicture)) continue;

                var raw = user.ProfilePicture;
                var commaIndex = raw.IndexOf(',');
                var base64Data = commaIndex >= 0 ? raw[(commaIndex + 1)..] : raw;

                byte[] bytes;
                try
                {
                    bytes = Convert.FromBase64String(base64Data);
                }
                catch
                {
                    continue; // not valid base64 — leave it alone
                }

                if (bytes.Length <= skipIfSmallerThanBytes) continue;

                try
                {
                    using var image = Image.Load(bytes);
                    image.Mutate(x => x.Resize(new ResizeOptions
                    {
                        Mode = ResizeMode.Max,
                        Size = new Size(maxDim, maxDim)
                    }));

                    using var ms = new MemoryStream();
                    image.Save(ms, new JpegEncoder { Quality = quality });

                    var newBase64 = "data:image/jpeg;base64," + Convert.ToBase64String(ms.ToArray());

                    await context.Database.ExecuteSqlRawAsync(
                        "EXEC UpdateProfile_Sp @AuthName = {0}, @AuthRole = {1}, @NewAuthName = {2}, @Email = {3}, @Country = {4}, @Age = {5}, @Gender = {6}, @ProfilePicture = {7}",
                        user.AuthName, user.AuthRole, user.AuthName, (string?)null, (string?)null, (int?)null, (string?)null, newBase64);

                    updated++;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Skipped compressing image for {user.AuthName}: {ex.Message}");
                }
            }

            return updated;
        }
    }
}
