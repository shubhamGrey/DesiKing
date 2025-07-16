using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Agronexis.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class updateOrderAndCreateTransationTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Status",
                schema: "dbo",
                table: "Order",
                type: "text",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<string>(
                name: "Currency",
                schema: "dbo",
                table: "Order",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RazorpayOrderId",
                schema: "dbo",
                table: "Order",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReceiptId",
                schema: "dbo",
                table: "Order",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_OrderItem_OrderId",
                schema: "dbo",
                table: "OrderItem",
                column: "OrderId");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItem_Order_OrderId",
                schema: "dbo",
                table: "OrderItem",
                column: "OrderId",
                principalSchema: "dbo",
                principalTable: "Order",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderItem_Order_OrderId",
                schema: "dbo",
                table: "OrderItem");

            migrationBuilder.DropIndex(
                name: "IX_OrderItem_OrderId",
                schema: "dbo",
                table: "OrderItem");

            migrationBuilder.DropColumn(
                name: "Currency",
                schema: "dbo",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "RazorpayOrderId",
                schema: "dbo",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "ReceiptId",
                schema: "dbo",
                table: "Order");

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                schema: "dbo",
                table: "Order",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);
        }
    }
}
