using Azure;
using employeeDashboard.Models;
using employeeDashboard.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace employeeDashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService authService;

        public AuthController(IAuthService authService)
        {
            this.authService = authService;
        }

        [HttpPost("Register")]
        public async Task<ActionResult> RegisterAuth(EmploayeeAuth emploayeeAuth)
        {
            await authService.RegisterAsync(emploayeeAuth);

            return Ok(emploayeeAuth);
        }


        [HttpPost("Login")]
        public async Task<ActionResult> LoginAuth(EmploayeeAuth emploayeeAuth)
        {
          var token =  await authService.LoginAsync(emploayeeAuth);

         if(token == null)
            {
                return Unauthorized("Invalid username or password");
            }

            Response.Cookies.Append("jwt", token, new CookieOptions
            {
                HttpOnly = true,     // Prevent JS access
                Secure = true,       // Only send over HTTPS
                SameSite = SameSiteMode.None, // Allow cross-site if frontend and backend are on different domains
                Expires = DateTime.UtcNow.AddHours(1)
            });


            return Ok(new
            {
                message = "Login Successful"
            });
        }

        [HttpGet("LoggedInUser")]
        [Authorize]
        public ActionResult GetCurrentUser()
        {

            try { 
            var username = User.Identity?.Name;

            var role = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;

            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            return Ok(new
            {
                name = username,
                role,
                email
            });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, "An error occurred while fetching user details.");
            }
        }


        [HttpPost("Logout")]
        public ActionResult LogoutUser()
        {
            Response.Cookies.Delete("jwt", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None
            });

            return Ok(new {message = "Logged out successfully" });
        }


        [HttpPut("ChangePassword")]
        [Authorize]
        public async Task<ActionResult> ChangePassword(ChangePasswordDto dto)
        {
            var authName = User.Identity?.Name;
            var authRole = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;

            if (string.IsNullOrWhiteSpace(dto.CurrentPassword) || string.IsNullOrWhiteSpace(dto.NewPassword))
            {
                return BadRequest("Current and new password are required.");
            }

            if (authName == null || authRole == null)
            {
                return Unauthorized();
            }

            var success = await authService.ChangePasswordAsync(authName, authRole, dto.CurrentPassword, dto.NewPassword);

            if (!success)
            {
                return BadRequest("Current password is incorrect.");
            }

            return Ok(new { message = "Password changed successfully" });
        }

        [HttpPut("UpdateProfile")]
        [Authorize]
        public async Task<ActionResult> UpdateProfile(UpdateProfileDto dto)
        {
            var authName = User.Identity?.Name;
            var authRole = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;

            if (authName == null || authRole == null)
            {
                return Unauthorized();
            }

            var updated = await authService.UpdateProfileAsync(authName, authRole, dto);

            if (updated == null)
            {
                return BadRequest("Unable to update profile.");
            }

            // If the username changed, the existing JWT cookie no longer matches — caller
            // should refresh LoggedInUser / re-login to pick up the new name in the token.
            return Ok(new
            {
                message = "Profile updated successfully",
                name = updated.AuthName,
                role = updated.AuthRole,
                email = updated.Email,
                country = updated.Country,
                age = updated.Age,
                gender = updated.Gender,
                profilePicture = updated.ProfilePicture
            });
        }

        [HttpPost("CompressExistingProfilePictures")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> CompressExistingProfilePictures()
        {
            var count = await authService.CompressAllProfilePicturesAsync();
            return Ok(new { message = $"Compressed {count} profile picture(s).", updated = count });
        }

        [HttpGet("GetAllRegisterUser")]
        public async Task<ActionResult> GetRegisterUsers()
        {
            var data = await authService.GetRegisterUsers();


            if(data != null)
            {
                return Ok(data);
            }
            else
            {
                return BadRequest("User Not Found....!");
            }

        }


    }
}
