namespace StokTakipUygulamasi.DTO
{
    public class CategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
      
        public string UserName { get; set; } // Bu özellik UserId'ye sahip olmalı
    }
}
