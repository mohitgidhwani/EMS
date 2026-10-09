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
