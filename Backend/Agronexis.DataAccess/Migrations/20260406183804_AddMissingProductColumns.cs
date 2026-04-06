using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Agronexis.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddMissingProductColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Index might not exist, using raw SQL with IF EXISTS
            migrationBuilder.Sql("DROP INDEX IF EXISTS dbo.\"IX_Wishlist_UserId_ProductId\";");

            // Only add column if it doesn't exist
            migrationBuilder.Sql(@"
                DO $$ 
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'dbo' AND table_name = 'Product' AND column_name = 'HsnCode') THEN
                        ALTER TABLE dbo.""Product"" ADD COLUMN ""HsnCode"" text;
                    END IF;
                END $$;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HsnCode",
                schema: "dbo",
                table: "Product");

            migrationBuilder.CreateIndex(
                name: "IX_Wishlist_UserId_ProductId",
                schema: "dbo",
                table: "Wishlist",
                columns: new[] { "UserId", "ProductId" },
                unique: true);
        }
    }
}
