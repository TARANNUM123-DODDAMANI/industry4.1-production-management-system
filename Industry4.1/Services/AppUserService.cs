using Industry4._1.Data;
using Industry4._1.DTOs;
using Industry4._1.DTOs.AppUserDto;
using Industry4._1.DTOs.LogicHandeling;
using Industry4._1.Interfaces;
using Industry4._1.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Industry4._1.Services
{
    public class AppUserService : IUserService
{
    private readonly AppDBContext _context;

    public AppUserService(AppDBContext context)
    {
        _context = context;
    }


    public AppUser Register(RegisterUserModel user)
    {


       

        var newUser = new AppUser
        {
            EmployeeId = user.EmployeeId,
            Role = user.Role,
            IsActive = user.IsActive,
        };

        var hasher = new PasswordHasher<AppUser>();

        var auth = new UserAuthDelails
        {
            EmployeeId = user.EmployeeId,
            Password = hasher.HashPassword(newUser, user.Password)
        };

        _context.AppUsers.Add(newUser);
        _context.UserAuthDelails.Add(auth);
        _context.SaveChanges();

        return newUser;
    }


        public object Login(LoginModel model)
        {

            var user = _context.AppUsers
                .FirstOrDefault(x => x.EmployeeId == model.EmployeeId);

            if (user == null)
            {
                return null;
            }



            var auth = _context.UserAuthDelails
                .FirstOrDefault(x => x.EmployeeId == model.EmployeeId);

            if (auth == null)
            {
                return null;
            }
            var hasher = new PasswordHasher<AppUser>();

            var result = hasher.VerifyHashedPassword(
                user,
                auth.Password,
                model.Password
            );

            if (result == PasswordVerificationResult.Failed)
            {
                return null;
            }
            var token = GenerateJwtToken(user);

            return new
            {
                success = true,
                message = "Customer login successful",
                token = token,
                EmployeeID = user.EmployeeId,
                
            };

        }



        public string GenerateJwtToken(AppUser appUser)
        {
            var claims = new[]
            {

        new Claim(ClaimTypes.NameIdentifier, appUser.EmployeeId )
    };

            var key = new SymmetricSecurityKey(
               Encoding.UTF8.GetBytes("THIS_IS_MY_SUPER_SECRET_KEY_12345_ABCDE")
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "IndustyAPI",
                audience: "IndustryUsers",
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public List<AppUser> GetAllUsers()
        {
            var users = _context.AppUsers
                .Select(u => new AppUser
                {
                   Id = u.Id,
                    EmployeeId= u.EmployeeId,
                    Role=  u.Role,
                    IsActive= u.IsActive
                })
                .ToList();

            return users;
        }

        public List<GetAllUsersStatusDto> GetAllUsersStatus()
        {
            var users = _context.AppUsers
                .Select(u => new GetAllUsersStatusDto
                {
                    
                    EmployeeId = u.EmployeeId,
                    
                    IsActive = u.IsActive
                })
                .ToList();

            return users;
        }


        public AppUser Get(string employeeId)
        {
            var user = _context.AppUsers
                .Where(u => u.EmployeeId == employeeId)
                .Select(u => new AppUser
                {
                   Id= u.Id,
                    EmployeeId=u.EmployeeId,
                    Role= u.Role,
                    IsActive=u.IsActive
                })
                .FirstOrDefault();

            if (user != null)
            {
                return user;
            }

            return null;
        }

        
        public AppUser UpdateUser(UpdateUserDto dto)
        {
            var user = _context.AppUsers
                .FirstOrDefault(u => u.EmployeeId == dto.EmployeeId);

            if (user == null)
            {
                return null;
            }
            user.Role = dto.Role;

            user.IsActive = dto.IsActive;
            _context.SaveChanges();

            return user;
        }

        public AppUser Delete(string employeeId)
        {
            var user = _context.AppUsers
                .FirstOrDefault(u => u.EmployeeId == employeeId);

            if (user == null)
            {
                return null;
            }
           _context.AppUsers.Remove(user);
            _context.SaveChanges();

            return user;
        }



        public List<AppUser> GetActiveUsers()
        {
            var activeUsers = _context.AppUsers
                .Where(u => u.IsActive)
                .Select(u => new AppUser
                {
                    Id = u.Id,
                    EmployeeId = u.EmployeeId,
                    Role = u.Role,
                    IsActive = u.IsActive
                })
                .ToList();

            if (!activeUsers.Any())
            {
                return null;
            }

            return activeUsers;
        }

        public string ResetPassward(ResetPassward dto)
        {
            var user = _context.UserAuthDelails.FirstOrDefault(u => u.EmployeeId == dto.EmployeeId);

            var hasher = new PasswordHasher<UserAuthDelails>();

            var result = hasher.VerifyHashedPassword(
                user,
                user.Password,
                dto.oldPassward
            );

            if (result == PasswordVerificationResult.Failed)
            {
                return "";
            }

            user.Password = hasher.HashPassword(user, dto.newPassward);
            _context.SaveChanges();

            return "Password changed successfully";

        }



        
        public string ForgetPassward(ForgetPassward dto)
        {
            var user = _context.UserAuthDelails.FirstOrDefault(u => u.EmployeeId == dto.EmployeeId);

            string key = "*#@#";
            var hasher = new PasswordHasher<UserAuthDelails>();

            var result = (key != dto.key);

            if (result)
            {
                return "";
            }

            user.Password = hasher.HashPassword(user, dto.newPassward);
            _context.SaveChanges();

                return "Password changed successfully";

        }

        
        public Shift UpdateShiftStartTime(UpdateShiftStartTime dto)
        {
            var shift = _context.Shifts.Where(s => s.Id == dto.Id).FirstOrDefault();
            if (shift == null)
            {
                return null;
            }

            shift.StartTime = dto.StartTime;

            _context.SaveChanges();
            return shift;
        }

        public List<AppUser> GetUserByRole(string role)
        {
            var user = _context.AppUsers
                .Where(x => x.Role == role)
                .Select(m => new AppUser
                {
                    Id = m.Id,
                    EmployeeId = m.EmployeeId,
                    Role = m.Role,
                    IsActive = m.IsActive
                }).ToList();


            if (user != null)
            {
                return user;
            }
            return null;

        }

    }
    }

