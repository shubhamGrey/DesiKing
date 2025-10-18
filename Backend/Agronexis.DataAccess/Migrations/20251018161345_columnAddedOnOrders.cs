using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Agronexis.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class columnAddedOnOrders : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "BillingAddressId",
                schema: "dbo",
                table: "Order",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "ShippingAddressId",
                schema: "dbo",
                table: "Order",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BillingAddressId",
                schema: "dbo",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "ShippingAddressId",
                schema: "dbo",
                table: "Order");
        }
    }
}
