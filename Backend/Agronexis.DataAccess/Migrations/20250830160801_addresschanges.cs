using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Agronexis.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class addresschanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ShippingAddress_CountryMaster_CountryCode",
                schema: "dbo",
                table: "ShippingAddress");

            migrationBuilder.DropForeignKey(
                name: "FK_ShippingAddress_StateMaster_StateCode",
                schema: "dbo",
                table: "ShippingAddress");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ShippingAddress",
                schema: "dbo",
                table: "ShippingAddress");

            migrationBuilder.DropColumn(
                name: "BrandId",
                schema: "dbo",
                table: "ShippingAddress");

            migrationBuilder.RenameTable(
                name: "ShippingAddress",
                schema: "dbo",
                newName: "Address",
                newSchema: "dbo");

            migrationBuilder.RenameColumn(
                name: "ZipCode",
                schema: "dbo",
                table: "Address",
                newName: "PinCode");

            migrationBuilder.RenameColumn(
                name: "AddressLine2",
                schema: "dbo",
                table: "Address",
                newName: "AddressType");

            migrationBuilder.RenameColumn(
                name: "AddressLine1",
                schema: "dbo",
                table: "Address",
                newName: "AddressLine");

            migrationBuilder.RenameIndex(
                name: "IX_ShippingAddress_StateCode",
                schema: "dbo",
                table: "Address",
                newName: "IX_Address_StateCode");

            migrationBuilder.RenameIndex(
                name: "IX_ShippingAddress_CountryCode",
                schema: "dbo",
                table: "Address",
                newName: "IX_Address_CountryCode");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Address",
                schema: "dbo",
                table: "Address",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Address_CountryMaster_CountryCode",
                schema: "dbo",
                table: "Address",
                column: "CountryCode",
                principalSchema: "dbo",
                principalTable: "CountryMaster",
                principalColumn: "CountryCode");

            migrationBuilder.AddForeignKey(
                name: "FK_Address_StateMaster_StateCode",
                schema: "dbo",
                table: "Address",
                column: "StateCode",
                principalSchema: "dbo",
                principalTable: "StateMaster",
                principalColumn: "StateCode");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Address_CountryMaster_CountryCode",
                schema: "dbo",
                table: "Address");

            migrationBuilder.DropForeignKey(
                name: "FK_Address_StateMaster_StateCode",
                schema: "dbo",
                table: "Address");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Address",
                schema: "dbo",
                table: "Address");

            migrationBuilder.RenameTable(
                name: "Address",
                schema: "dbo",
                newName: "ShippingAddress",
                newSchema: "dbo");

            migrationBuilder.RenameColumn(
                name: "PinCode",
                schema: "dbo",
                table: "ShippingAddress",
                newName: "ZipCode");

            migrationBuilder.RenameColumn(
                name: "AddressType",
                schema: "dbo",
                table: "ShippingAddress",
                newName: "AddressLine2");

            migrationBuilder.RenameColumn(
                name: "AddressLine",
                schema: "dbo",
                table: "ShippingAddress",
                newName: "AddressLine1");

            migrationBuilder.RenameIndex(
                name: "IX_Address_StateCode",
                schema: "dbo",
                table: "ShippingAddress",
                newName: "IX_ShippingAddress_StateCode");

            migrationBuilder.RenameIndex(
                name: "IX_Address_CountryCode",
                schema: "dbo",
                table: "ShippingAddress",
                newName: "IX_ShippingAddress_CountryCode");

            migrationBuilder.AddColumn<Guid>(
                name: "BrandId",
                schema: "dbo",
                table: "ShippingAddress",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_ShippingAddress",
                schema: "dbo",
                table: "ShippingAddress",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ShippingAddress_CountryMaster_CountryCode",
                schema: "dbo",
                table: "ShippingAddress",
                column: "CountryCode",
                principalSchema: "dbo",
                principalTable: "CountryMaster",
                principalColumn: "CountryCode");

            migrationBuilder.AddForeignKey(
                name: "FK_ShippingAddress_StateMaster_StateCode",
                schema: "dbo",
                table: "ShippingAddress",
                column: "StateCode",
                principalSchema: "dbo",
                principalTable: "StateMaster",
                principalColumn: "StateCode");
        }
    }
}
