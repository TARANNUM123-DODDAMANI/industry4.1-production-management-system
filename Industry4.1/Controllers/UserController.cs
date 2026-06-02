using Industry4._1.DTOs.AppUserDto;
using Industry4._1.DTOs.LogicHandeling;
using Industry4._1.Interfaces;
using Industry4._1.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Industry4._1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        public IUserService _userservice;
        public UserController(IUserService userservice)
        {
            _userservice = userservice;
        }


        [HttpPost("RegisterUser")]
        public IActionResult RegisterUser(RegisterUserModel user)
        {
            var result = _userservice.Register(user);
            return Ok(new
            {
                Status = true,
                Message = "User registered successfully",
                Data = result
            });
        }


        [HttpPost("Login")]
        public IActionResult Login(LoginModel model)
        {

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = _userservice.Login(model);

            if( result == null)
            {
                return Unauthorized(new
                {
                     success = false,
                    message = "Invalid EmployeeId or password" 
            });
            }
            return Ok(result);
        }
        [HttpGet]
        public IActionResult GetAllUsers()
        {
            var result = _userservice.GetAllUsers();
            return Ok(new
            {
                Status = true,
                Message = "User Data fetch seccusfully",
                Data = result
            });
        }

        [HttpGet("GetAllUsersStatus")]
        public IActionResult GetAllUsersStatus()
        {
            var result = _userservice.GetAllUsersStatus();
            return Ok(new
            {
                Status = true,
                Message = "User Status   fetch seccusfully",
                Data = result
            });
        }

        [HttpGet("GetById{employeeId}")]
        public IActionResult GetById(string employeeId)
        {
            var result = _userservice.Get(employeeId);

            if (result == null)
            {
                return BadRequest(new
                {
                    Status = false,
                    Meaasge = "User Not Found "
                });
            }
            return Ok(new
            {
                Status = true,
                Message = "User Data fetch Secussfully",
                Data = result
            });

        }

        [HttpPatch("UpdateUser")]
        public IActionResult UpdateUser(UpdateUserDto dto)
        {
            var result = _userservice.UpdateUser(dto);

            if (result == null)
            {
                return NotFound(new
                {
                    Status = false,
                    Message = "User not found"
                });
            }
           
            return Ok(new
            {
                Status = true,
                Message = "User Updated successfully",
                Data = result
            });
        }


        [HttpDelete("DeleteUser")]
        public IActionResult DeleteUser(string employeeId)
        {
            var result = _userservice.Delete(employeeId);

            if (result == null)
            {
                return NotFound(new
                {
                    Status = false,
                    Message = "User not found"
                });
            }

            return Ok(new
            {
                Status = true,
                Message = "User Deleted successfully",
                Data = result
            });
        }

        [HttpGet("active")]
        public IActionResult GetActiveUsers()
        {
            var activeUsers = _userservice.GetActiveUsers();

            if (!activeUsers.Any())
            {
                return NotFound(new
                {
                    Status = false,
                    Message = "No active users found"
                });
            }

            return Ok(new
            {
                Status = true,
                Message = "Active user data fetch secussfully",
                Count = activeUsers.Count,
                Data = activeUsers
            });
        }


        [HttpPatch("ResetPassward")]
        public IActionResult ResetPassward(ResetPassward dto)
        {
            var result = _userservice.ResetPassward(dto);

            if (result == "")
            {
                return Unauthorized(new
                {
                    Status = false,
                    Message = "Invalid Employee ID or old Password"
                });
            }

            

            return Ok(new
            {
                Status = true,
                Message = "Password changed successfully"
            });

        }

        [HttpPatch("ForgetPassward")]
        public IActionResult ForgetPassward(ForgetPassward dto)
        {
            var result = _userservice.ForgetPassward(dto);

            if (result == "")
            {
                return Unauthorized(new
                {
                    Status = false,
                    Message = "Invalid key entered"
                });
            }

           
            

            return Ok(new
            {
                Status = true,
                Message = result
            });

        }

        [HttpGet("GetUserByRole")]
        public IActionResult GetUserByRole(string role)
        {
            var user = _userservice.GetUserByRole(role);
                
            if (user == null)
            {
                BadRequest(new
                {
                    Status = false,
                    Message = $"Users not found for rolr {role}"
                });
            }

            return Ok(new
            {
                Status = true,
                Message = $"Users Featched Secussfully of role {role}",
                Data = user
            });
        }
    }
}
