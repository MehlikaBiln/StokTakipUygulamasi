public class ProductDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Barcode { get; set; }
    public int Quantity { get; set; }
    public DateTime AddedDate { get; set; }
    public DateTime? UpdatedDate { get; set; }
    public string CategoryName { get; set; }
    public string UserName { get; set; }
    public string Unit { get; set; } // Yeni alan
}
