using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Industry4._1.Migrations
{
    /// <inheritdoc />
    public partial class ProductionEnntryAdded1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "ProductionEntries",
                newName: "UserEmployeeId");

            migrationBuilder.RenameColumn(
                name: "ShiftId",
                table: "ProductionEntries",
                newName: "ShiftName");

            migrationBuilder.RenameColumn(
                name: "MachineId",
                table: "ProductionEntries",
                newName: "MachineCode");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UserEmployeeId",
                table: "ProductionEntries",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "ShiftName",
                table: "ProductionEntries",
                newName: "ShiftId");

            migrationBuilder.RenameColumn(
                name: "MachineCode",
                table: "ProductionEntries",
                newName: "MachineId");
        }
    }
}
