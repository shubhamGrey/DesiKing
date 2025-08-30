using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Agronexis.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class ShippingChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OrderId",
                schema: "dbo",
                table: "ShippingAddress");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "dbo",
                table: "ShippingAddress",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "dbo",
                table: "ShippingAddress",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "dbo",
                table: "ShippingAddress");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "dbo",
                table: "ShippingAddress");

            migrationBuilder.AddColumn<Guid>(
                name: "OrderId",
                schema: "dbo",
                table: "ShippingAddress",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));
        }
    }
}
