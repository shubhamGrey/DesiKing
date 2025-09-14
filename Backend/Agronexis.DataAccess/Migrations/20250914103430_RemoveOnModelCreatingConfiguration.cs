using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Agronexis.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class RemoveOnModelCreatingConfiguration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AnalyticsEvents_Action",
                table: "AnalyticsEvents");

            migrationBuilder.DropIndex(
                name: "IX_AnalyticsEvents_Category",
                table: "AnalyticsEvents");

            migrationBuilder.DropIndex(
                name: "IX_AnalyticsEvents_EventDate",
                table: "AnalyticsEvents");

            migrationBuilder.DropIndex(
                name: "IX_AnalyticsEvents_SessionId",
                table: "AnalyticsEvents");

            migrationBuilder.DropIndex(
                name: "IX_AnalyticsEvents_UserId",
                table: "AnalyticsEvents");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "EcommerceEvents",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValueSql: "NOW()");

            migrationBuilder.AlterColumn<Guid>(
                name: "EventId",
                table: "AnalyticsEvents",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldDefaultValueSql: "gen_random_uuid()");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "AnalyticsEvents",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValueSql: "NOW()");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "EcommerceEvents",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "NOW()",
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<Guid>(
                name: "EventId",
                table: "AnalyticsEvents",
                type: "uuid",
                nullable: false,
                defaultValueSql: "gen_random_uuid()",
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "AnalyticsEvents",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "NOW()",
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.CreateIndex(
                name: "IX_AnalyticsEvents_Action",
                table: "AnalyticsEvents",
                column: "Action");

            migrationBuilder.CreateIndex(
                name: "IX_AnalyticsEvents_Category",
                table: "AnalyticsEvents",
                column: "Category");

            migrationBuilder.CreateIndex(
                name: "IX_AnalyticsEvents_EventDate",
                table: "AnalyticsEvents",
                column: "EventDate");

            migrationBuilder.CreateIndex(
                name: "IX_AnalyticsEvents_SessionId",
                table: "AnalyticsEvents",
                column: "SessionId");

            migrationBuilder.CreateIndex(
                name: "IX_AnalyticsEvents_UserId",
                table: "AnalyticsEvents",
                column: "UserId");
        }
    }
}
