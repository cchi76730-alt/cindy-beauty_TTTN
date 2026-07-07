using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CosmeticShop_Backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAdminMessages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AdminReply",
                table: "AdminMessages",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ProductId",
                table: "AdminMessages",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProductName",
                table: "AdminMessages",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "RepliedAt",
                table: "AdminMessages",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SenderPhone",
                table: "AdminMessages",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AdminReply",
                table: "AdminMessages");

            migrationBuilder.DropColumn(
                name: "ProductId",
                table: "AdminMessages");

            migrationBuilder.DropColumn(
                name: "ProductName",
                table: "AdminMessages");

            migrationBuilder.DropColumn(
                name: "RepliedAt",
                table: "AdminMessages");

            migrationBuilder.DropColumn(
                name: "SenderPhone",
                table: "AdminMessages");
        }
    }
}
