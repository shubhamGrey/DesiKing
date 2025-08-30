using Agronexis.Model;
using Agronexis.Model.EntityModel;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agronexis.DataAccess.DbContexts
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
            
        }
        public DbSet<Brand> Brands { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Inventory> Inventories { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Currency> Currencies { get; set; }
        public DbSet<ProductPrice> ProductPrices { get; set; }
        public DbSet<Weight> Weights { get; set; }
        public DbSet<StateMaster> StateMasters { get; set; }
        public DbSet<CountryMaster> CountryMasters { get; set; }
    }
}
