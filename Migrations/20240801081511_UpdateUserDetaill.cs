using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StokTakipUygulamasi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserDetaill : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SilinecekSayi",
                table: "Urunler");

            migrationBuilder.DropColumn(
                name: "SilinmeTarihi",
                table: "Urunler");

            migrationBuilder.AddColumn<string>(
                name: "Id",
                table: "UserDetails",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Id",
                table: "UserDetails");

            migrationBuilder.AddColumn<int>(
                name: "SilinecekSayi",
                table: "Urunler",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "SilinmeTarihi",
                table: "Urunler",
                type: "timestamp with time zone",
                nullable: true);
        }
    }
}
