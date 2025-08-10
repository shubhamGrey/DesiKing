using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Agronexis.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class priceAndSkuChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Sku",
                schema: "dbo");

            migrationBuilder.AddColumn<string>(
                name: "Barcode",
                schema: "dbo",
                table: "ProductPrice",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SkuNumber",
                schema: "dbo",
                table: "ProductPrice",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "WeightId",
                schema: "dbo",
                table: "ProductPrice",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "Weight",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Value = table.Column<decimal>(type: "numeric", nullable: false),
                    Unit = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Weight", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Weight",
                schema: "dbo");

            migrationBuilder.DropColumn(
                name: "Barcode",
                schema: "dbo",
                table: "ProductPrice");

            migrationBuilder.DropColumn(
                name: "SkuNumber",
                schema: "dbo",
                table: "ProductPrice");

            migrationBuilder.DropColumn(
                name: "WeightId",
                schema: "dbo",
                table: "ProductPrice");

            migrationBuilder.CreateTable(
                name: "Sku",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProductId = table.Column<Guid>(type: "uuid", nullable: false),
                    Barcode = table.Column<string>(type: "text", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    ModifiedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    SkuNumber = table.Column<string>(type: "text", nullable: true),
                    Weight = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sku", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Sku_Product_ProductId",
                        column: x => x.ProductId,
                        principalSchema: "dbo",
                        principalTable: "Product",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Sku_ProductId",
                schema: "dbo",
                table: "Sku",
                column: "ProductId");
        }
    }
}
