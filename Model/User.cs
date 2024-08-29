using StokTakipUygulamasi.Model;
using StokTakipUygulamasi.Models;
using System.ComponentModel.DataAnnotations;

public class User
{
    public int Id { get; set; }

    [Required]
    public string Username { get; set; }

   
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    public string Password { get; set; } // Hashlenmiş şifre yerine düz şifreyi saklıyoruz

    public string Role { get; set; }

    public ICollection<Product> Products { get; set; } = new List<Product>();
    public ICollection<Category> Categories { get; set; } = new List<Category>();

    public ICollection<UserCategory> UserCategories { get; set; } = new List<UserCategory>();

}

