using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Industry4._1.Migrations
{
    /// <inheritdoc />
    public partial class AddNoofEmpperMachine1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "NoOfEmployee",
                table: "Machines",
                newName: "employeesWorking");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "employeesWorking",
                table: "Machines",
                newName: "NoOfEmployee");
        }
    }
}
