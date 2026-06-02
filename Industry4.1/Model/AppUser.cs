using System.ComponentModel.DataAnnotations;

namespace Industry4._1.Model
{
    public class AppUser
    {
        [Key]
        public int Id { get; set; }
        public string EmployeeId { get; set; }

        public string Role { get; set; }
        public bool IsActive { get; set; }
    }


    public class GetAllUsersStatusDto
    {
        
        public string EmployeeId { get; set; }

       
        public bool IsActive { get; set; }
    }
}
