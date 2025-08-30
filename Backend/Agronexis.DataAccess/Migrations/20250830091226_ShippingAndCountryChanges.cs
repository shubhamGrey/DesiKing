using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Agronexis.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class ShippingAndCountryChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Country",
                schema: "dbo",
                table: "ShippingAddress");

            migrationBuilder.DropColumn(
                name: "State",
                schema: "dbo",
                table: "ShippingAddress");

            migrationBuilder.AddColumn<string>(
                name: "CountryCode",
                schema: "dbo",
                table: "ShippingAddress",
                type: "character varying(5)",
                maxLength: 5,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StateCode",
                schema: "dbo",
                table: "ShippingAddress",
                type: "character varying(10)",
                maxLength: 10,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "CountryMaster",
                schema: "dbo",
                columns: table => new
                {
                    CountryCode = table.Column<string>(type: "character varying(5)", maxLength: 5, nullable: false),
                    CountryName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CountryMaster", x => x.CountryCode);
                });

            migrationBuilder.CreateTable(
                name: "StateMaster",
                schema: "dbo",
                columns: table => new
                {
                    StateCode = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    StateName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    CountryCode = table.Column<string>(type: "character varying(5)", maxLength: 5, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StateMaster", x => x.StateCode);
                    table.ForeignKey(
                        name: "FK_StateMaster_CountryMaster_CountryCode",
                        column: x => x.CountryCode,
                        principalSchema: "dbo",
                        principalTable: "CountryMaster",
                        principalColumn: "CountryCode",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ShippingAddress_CountryCode",
                schema: "dbo",
                table: "ShippingAddress",
                column: "CountryCode");

            migrationBuilder.CreateIndex(
                name: "IX_ShippingAddress_StateCode",
                schema: "dbo",
                table: "ShippingAddress",
                column: "StateCode");

            migrationBuilder.CreateIndex(
                name: "IX_ProductPrice_WeightId",
                schema: "dbo",
                table: "ProductPrice",
                column: "WeightId");

            migrationBuilder.CreateIndex(
                name: "IX_StateMaster_CountryCode",
                schema: "dbo",
                table: "StateMaster",
                column: "CountryCode");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductPrice_Weight_WeightId",
                schema: "dbo",
                table: "ProductPrice",
                column: "WeightId",
                principalSchema: "dbo",
                principalTable: "Weight",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductPrice_Weight_WeightId",
                schema: "dbo",
                table: "ProductPrice");

            migrationBuilder.DropForeignKey(
                name: "FK_ShippingAddress_CountryMaster_CountryCode",
                schema: "dbo",
                table: "ShippingAddress");

            migrationBuilder.DropForeignKey(
                name: "FK_ShippingAddress_StateMaster_StateCode",
                schema: "dbo",
                table: "ShippingAddress");

            migrationBuilder.DropTable(
                name: "StateMaster",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "CountryMaster",
                schema: "dbo");

            migrationBuilder.DropIndex(
                name: "IX_ShippingAddress_CountryCode",
                schema: "dbo",
                table: "ShippingAddress");

            migrationBuilder.DropIndex(
                name: "IX_ShippingAddress_StateCode",
                schema: "dbo",
                table: "ShippingAddress");

            migrationBuilder.DropIndex(
                name: "IX_ProductPrice_WeightId",
                schema: "dbo",
                table: "ProductPrice");

            migrationBuilder.DropColumn(
                name: "CountryCode",
                schema: "dbo",
                table: "ShippingAddress");

            migrationBuilder.DropColumn(
                name: "StateCode",
                schema: "dbo",
                table: "ShippingAddress");

            migrationBuilder.AddColumn<string>(
                name: "Country",
                schema: "dbo",
                table: "ShippingAddress",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "State",
                schema: "dbo",
                table: "ShippingAddress",
                type: "text",
                nullable: true);
        }
    }
}
