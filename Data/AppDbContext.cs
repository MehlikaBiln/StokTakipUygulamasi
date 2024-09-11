using Microsoft.EntityFrameworkCore;
using StokTakipUygulamasi.DTO;
using StokTakipUygulamasi.Model;
using StokTakipUygulamasi.Models;

namespace StokTakipUygulamasi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<UserCategory> UserCategories { get; set; }
       
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // User ve Product arasındaki ilişki
            modelBuilder.Entity<User>()
                .HasMany(u => u.Products)
                .WithOne(p => p.User)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // User ve Category arasındaki ilişki
            modelBuilder.Entity<User>()
                .HasMany(u => u.Categories) // 'Category' yerine 'Categories' olmalı
                .WithOne(c => c.User)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Category ve Product arasındaki ilişki
            modelBuilder.Entity<Category>()
                .HasMany(c => c.Products)
                .WithOne(p => p.Category)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<UserCategory>()
        .HasKey(uc => new { uc.UserId, uc.CategoryId });

            modelBuilder.Entity<UserCategory>()
                .HasOne(uc => uc.User)
                .WithMany(u => u.UserCategories)
                .HasForeignKey(uc => uc.UserId);

            modelBuilder.Entity<UserCategory>()
                .HasOne(uc => uc.Category)
                .WithMany(c => c.UserCategories)
                .HasForeignKey(uc => uc.CategoryId);

        }
    }
}
