using System.ComponentModel.DataAnnotations;

namespace Industry4._1.Model
{
    public class UserAuthDelails
    {
        [Key]
        public int ID { get; set; }
        public string EmployeeId { get; set; }
        public string Password { get; set; }
    }
}
