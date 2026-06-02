using Industry4._1.DTOs.AppUserDto;
using Industry4._1.DTOs.LogicHandeling;
using Industry4._1.Model;
using Microsoft.AspNetCore.Mvc;

namespace Industry4._1.Interfaces
{
    public interface IUserService
    {
        public List<AppUser> GetAllUsers();
        public AppUser Register(RegisterUserModel user);
        public object Login(LoginModel model);
        public string GenerateJwtToken(AppUser appUser);
        public AppUser Get(string employeeId);
        public AppUser UpdateUser(UpdateUserDto dto);
        public AppUser Delete(string employeeId);
        public List<AppUser> GetActiveUsers();
        public List<AppUser> GetUserByRole(string role);
        public List<GetAllUsersStatusDto> GetAllUsersStatus();
        public string ResetPassward(ResetPassward dto);
        public string ForgetPassward(ForgetPassward dto);
    }
}
