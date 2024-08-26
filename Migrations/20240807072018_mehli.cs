using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StokTakipUygulamasi.Migrations
{
    /// <inheritdoc />
    public partial class mehli : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_UserDetails_UserDetailUserId",
                table: "AspNetUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_Kategoriler_AspNetUsers_UserId",
                table: "Kategoriler");

            migrationBuilder.DropForeignKey(
                name: "FK_Urunler_AspNetUsers_EkleyenUserId",
                table: "Urunler");

            migrationBuilder.DropForeignKey(
                name: "FK_Urunler_Kategoriler_CategoryId",
                table: "Urunler");

            migrationBuilder.DropTable(
                name: "UserDetails");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_UserDetailUserId",
                table: "AspNetUsers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Urunler",
                table: "Urunler");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Kategoriler",
                table: "Kategoriler");

            migrationBuilder.DropColumn(
                name: "UserDetailUserId",
                table: "AspNetUsers");

            migrationBuilder.RenameTable(
                name: "Urunler",
                newName: "Urun");

            migrationBuilder.RenameTable(
                name: "Kategoriler",
                newName: "Kategori");

            migrationBuilder.RenameColumn(
                name: "EkleyenUserId",
                table: "Urun",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Urunler_EkleyenUserId",
                table: "Urun",
                newName: "IX_Urun_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Urunler_CategoryId",
                table: "Urun",
                newName: "IX_Urun_CategoryId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Kategori",
                newName: "CategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_Kategoriler_UserId",
                table: "Kategori",
                newName: "IX_Kategori_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Urun",
                table: "Urun",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Kategori",
                table: "Kategori",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Kategori_AspNetUsers_UserId",
                table: "Kategori",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Urun_AspNetUsers_UserId",
                table: "Urun",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Urun_Kategori_CategoryId",
                table: "Urun",
                column: "CategoryId",
                principalTable: "Kategori",
                principalColumn: "CategoryId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Kategori_AspNetUsers_UserId",
                table: "Kategori");

            migrationBuilder.DropForeignKey(
                name: "FK_Urun_AspNetUsers_UserId",
                table: "Urun");

            migrationBuilder.DropForeignKey(
                name: "FK_Urun_Kategori_CategoryId",
                table: "Urun");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Urun",
                table: "Urun");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Kategori",
                table: "Kategori");

            migrationBuilder.RenameTable(
                name: "Urun",
                newName: "Urunler");

            migrationBuilder.RenameTable(
                name: "Kategori",
                newName: "Kategoriler");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Urunler",
                newName: "EkleyenUserId");

            migrationBuilder.RenameIndex(
                name: "IX_Urun_UserId",
                table: "Urunler",
                newName: "IX_Urunler_EkleyenUserId");

            migrationBuilder.RenameIndex(
                name: "IX_Urun_CategoryId",
                table: "Urunler",
                newName: "IX_Urunler_CategoryId");

            migrationBuilder.RenameColumn(
                name: "CategoryId",
                table: "Kategoriler",
                newName: "Id");

            migrationBuilder.RenameIndex(
                name: "IX_Kategori_UserId",
                table: "Kategoriler",
                newName: "IX_Kategoriler_UserId");

            migrationBuilder.AddColumn<string>(
                name: "UserDetailUserId",
                table: "AspNetUsers",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Urunler",
                table: "Urunler",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Kategoriler",
                table: "Kategoriler",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "UserDetails",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "text", nullable: false),
                    AdSoyad = table.Column<string>(type: "text", nullable: false),
                    Adres = table.Column<string>(type: "text", nullable: false),
                    Id = table.Column<string>(type: "text", nullable: true),
                    Telefon = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserDetails", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_UserDetails_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_UserDetailUserId",
                table: "AspNetUsers",
                column: "UserDetailUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_UserDetails_UserDetailUserId",
                table: "AspNetUsers",
                column: "UserDetailUserId",
                principalTable: "UserDetails",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Kategoriler_AspNetUsers_UserId",
                table: "Kategoriler",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Urunler_AspNetUsers_EkleyenUserId",
                table: "Urunler",
                column: "EkleyenUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Urunler_Kategoriler_CategoryId",
                table: "Urunler",
                column: "CategoryId",
                principalTable: "Kategoriler",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
