using StokTakipUygulamasi.DTO;
using StokTakipUygulamasi.Models;

namespace StokTakipUygulamasi.Repository
{
    public interface IProductRepository
    {
        Task<IEnumerable<ProductWithDepotInfoDto>> GetProductsWithDepotInfoAsync();
     
        Task TransferProductBetweenDepots(string productName, string sourceDepotName, string targetDepotName, int transferQuantity);
        

        Task<Product> GetByIdAsync(int id);
        Task<IEnumerable<Product>> GetAllAsync();
        Task UpdateAsync(Product product);  // Opsiyonel, eğer güncelleme yapıyorsanız
        Task DeleteAsync(int id);
        Task AddAsync(Product product);  // Bu metodu ekleyin


    }



}