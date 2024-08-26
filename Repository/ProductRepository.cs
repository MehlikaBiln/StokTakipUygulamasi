using Microsoft.EntityFrameworkCore;
using StokTakipUygulamasi.Data;
using StokTakipUygulamasi.Models;
using StokTakipUygulamasi.Repository;

public class ProductRepository : Repository<Product>, IProductRepository
{
    public ProductRepository(AppDbContext context) : base(context)
    {
    }

    public Task AddProductAsync(Product product)
    {
        throw new NotImplementedException();
    }

    public Task DeleteProductAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Product>> GetAllProductsAsync()
    {
        throw new NotImplementedException();
    }

    public Task<Product> GetProductByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

    // Örnek: Ürünleri kategorilere göre filtrelemek için özel bir metot
    public async Task<IEnumerable<Product>> GetProductsByCategoryAsync(int categoryId)
    {
        return await _context.Products
            .Where(p => p.CategoryId == categoryId)
            .ToListAsync();
    }

    public Task UpdateProductAsync(Product product)
    {
        throw new NotImplementedException();
    }

   
}
