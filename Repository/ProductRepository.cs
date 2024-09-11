using Microsoft.EntityFrameworkCore;
using StokTakipUygulamasi.Data;
using StokTakipUygulamasi.Models;
using StokTakipUygulamasi.Repository;
using StokTakipUygulamasi.DTO;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Dapper;


public class ProductRepository : Repository<Product>, IProductRepository
{
    private readonly AppDbContext _context;

    public ProductRepository(AppDbContext context) : base(context)
    {
        _context = context;
    }

    public Task AddProductAsync(Product product)
    {
        // Implement this method
        throw new NotImplementedException();
    }

    public Task DeleteProductAsync(int id)
    {
        // Implement this method
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Product>> GetAllProductsAsync()
    {
        // Implement this method
        throw new NotImplementedException();
    }

    public Task<Product> GetProductByIdAsync(int id)
    {
        // Implement this method
        throw new NotImplementedException();
    }

    public async Task<IEnumerable<Product>> GetProductsByCategoryAsync(int categoryId)
    {
        return await _context.Products
            .Where(p => p.CategoryId == categoryId)
            .ToListAsync();
    }

    public Task UpdateProductAsync(Product product)
    {
        // Implement this method
        throw new NotImplementedException();
    }

    public async Task<IEnumerable<ProductWithDepotInfoDto>> GetProductsWithDepotInfoAsync()
    {
        var query = @"
        SELECT 
            p.""Name"", 
            (SELECT SUM(""Quantity"") 
             FROM public.""Products"" 
             WHERE ""Name"" = p.""Name"") AS ""TotalQuantity"",  
            c.""Name"" AS ""DepotName"", 
            p.""CategoryId"",
            p.""Quantity"" AS ""QuantityInDepot"" 
        FROM 
            public.""Products"" p
        JOIN 
            public.""Categories"" c ON p.""CategoryId"" = c.""Id""  
        ORDER BY 
            p.""Name"";
        ";

        using (var connection = _context.Database.GetDbConnection())
        {
            var products = await connection.QueryAsync<ProductWithDepotInfoDto>(query);
            return products;
        }
    }
    public async Task TransferProductBetweenDepots(string productName, string fromDepot, string toDepot, int quantity)
{
    using (var connection = _context.Database.GetDbConnection())
    {
        await connection.OpenAsync();

        using (var transaction = await connection.BeginTransactionAsync())
        {
            // İlk olarak, kaynağı depodan ürün çıkarma işlemini yaptım
            var updateFromDepotQuery = @"
                UPDATE public.""Products""
                SET ""Quantity"" = ""Quantity"" - @Quantity
                WHERE ""Name"" = @ProductName AND ""CategoryId"" = (
                    SELECT ""Id"" FROM public.""Categories"" WHERE ""Name"" = @FromDepot
                ) AND ""Quantity"" >= @Quantity
            ";
            var rowsAffected = await connection.ExecuteAsync(updateFromDepotQuery, new { ProductName = productName, FromDepot = fromDepot, Quantity = quantity }, transaction);

            if (rowsAffected == 0)
            {
                throw new Exception("Kaynak depoda yeterli ürün yok veya ürün bulunamadı.");
            }

            // Şimdi hedef depoda ürün olup olmadığını kontrol ettim
            var checkToDepotQuery = @"
                SELECT ""Id"", ""Quantity""
                FROM public.""Products""
                WHERE ""Name"" = @ProductName AND ""CategoryId"" = (
                    SELECT ""Id"" FROM public.""Categories"" WHERE ""Name"" = @ToDepot
                )
            ";
            var productInToDepot = await connection.QueryFirstOrDefaultAsync<dynamic>(checkToDepotQuery, new { ProductName = productName, ToDepot = toDepot }, transaction);

            if (productInToDepot != null)
            {
                // Hedef depoda ürün varsa, sadece miktarı güncelledim
                var updateToDepotQuery = @"
                    UPDATE public.""Products""
                    SET ""Quantity"" = ""Quantity"" + @Quantity
                    WHERE ""Id"" = @ProductId
                ";
                await connection.ExecuteAsync(updateToDepotQuery, new { ProductId = productInToDepot.Id, Quantity = quantity }, transaction);
            }
            else
            {
                // Hedef depoda ürün yoksa, yeni bir kayıt ekledim
                var insertToDepotQuery = @"
                    INSERT INTO public.""Products"" (""Name"", ""Quantity"", ""CategoryId"", ""AddedDate"")
                    VALUES (@ProductName, @Quantity, (
                        SELECT ""Id"" FROM public.""Categories"" WHERE ""Name"" = @ToDepot
                    ), @AddedDate)
                ";
                await connection.ExecuteAsync(insertToDepotQuery, new { ProductName = productName, Quantity = quantity, ToDepot = toDepot, AddedDate = DateTime.Now }, transaction);
            }

            // Transaction'ı commit et
            await transaction.CommitAsync();
        }
    }
}

}
