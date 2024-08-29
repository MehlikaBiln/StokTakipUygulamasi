using StokTakipUygulamasi.Models;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Barcode { get; set; }
    public int Quantity { get; set; }

    public string Unit { get; set; } // Yeni sütun
    public DateTime AddedDate { get; set; }
    public DateTime? UpdatedDate { get; set; }
    public int CategoryId { get; set; }  // Foreign key
    public Category Category { get; set; } // Navigation property
    public int UserId { get; set; } // Foreign key
    public User User { get; set; } // Navigation property
    
}
