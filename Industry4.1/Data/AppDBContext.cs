using Microsoft.EntityFrameworkCore;
using Industry4._1.Model;

namespace Industry4._1.Data
{
    public class AppDBContext:DbContext
    {
        public AppDBContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Machine> Machines {  get; set; }
        public DbSet<Usre> Users { get; set; }
        public DbSet<UserAuthDelails> UserAuthDelails { get; set; }
        public DbSet<AppUser> AppUsers { get; set; }
        public DbSet<Shift> Shifts { get; set; }
        public DbSet<ProductionEntry> ProductionEntries { get; set; }
    }
}
