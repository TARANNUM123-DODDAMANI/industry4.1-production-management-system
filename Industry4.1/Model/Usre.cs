using System.ComponentModel.DataAnnotations;

namespace Industry4._1.Model
{
    public class Usre
    {
        [Key]
        public int Id {  get; set; }
        public string userName {  get; set; }
        public string password { get; set; }
    }
}
