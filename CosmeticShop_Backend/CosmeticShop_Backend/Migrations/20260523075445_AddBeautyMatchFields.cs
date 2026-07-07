using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CosmeticShop_Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddBeautyMatchFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Concern",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PriceRange",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SkinType",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Concern",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "PriceRange",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "SkinType",
                table: "Products");
        }
    }
}
