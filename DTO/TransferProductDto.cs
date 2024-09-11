namespace StokTakipUygulamasi.DTO
{
    public class TransferProductDto
    {
        public string ProductName { get; set; }       // Ürün adı
        public string SourceDepotName { get; set; }   // Kaynak depo adı
        public string TargetDepotName { get; set; }   // Hedef depo adı
        public int TransferQuantity { get; set; }     // Transfer edilecek miktar
    }

}
