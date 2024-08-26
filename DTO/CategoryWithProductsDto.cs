namespace StokTakipUygulamasi.DTO
{
    public class CategoryWithProductsDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string UserName { get; set; }
        public List<ProductDto> Products { get; set; } = new List<ProductDto>();
    }

}
