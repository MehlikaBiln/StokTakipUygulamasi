using StokTakipUygulamasi.Model;
using System.Collections.Generic;

namespace StokTakipUygulamasi.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<Product> Products { get; set; } = new List<Product>();
        public int UserId { get; set; }
        public User User { get; set; } // Navigation property

        public ICollection<UserCategory> UserCategories { get; set; } = new List<UserCategory>();

    }
}
