using StokTakipUygulamasi.Models;

namespace StokTakipUygulamasi.Repository
{
    public interface ICategoryRepository
    {
        Task<Category> GetByNameAsync(string name);
        Task<Category> GetByIdAsync(int id); // Örnek diğer metotlar
        Task<IEnumerable<Category>> GetAllAsync(); // Örnek diğer metotlar
        Task AddAsync(Category category); // Örnek diğer metotlar
        Task UpdateAsync(Category category); // Örnek diğer metotlar
        Task DeleteAsync(int id); // Örnek diğer metotlar
    }


}
