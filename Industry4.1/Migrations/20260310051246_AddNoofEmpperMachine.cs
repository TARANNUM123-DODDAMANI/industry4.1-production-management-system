using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Industry4._1.Migrations
{
    /// <inheritdoc />
    public partial class AddNoofEmpperMachine : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "NoOfEmployee",
                table: "Machines",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NoOfEmployee",
                table: "Machines");
        }
    }
}
