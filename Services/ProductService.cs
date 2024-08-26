using StokTakipUygulamasi.Models;
using StokTakipUygulamasi.Repository;
using StokTakipUygulamasi.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IUserRepository _userRepository;

    public ProductService(IProductRepository productRepository, ICategoryRepository categoryRepository, IUserRepository userRepository)
    {
        _productRepository = productRepository;
        _categoryRepository = categoryRepository;
        _userRepository = userRepository;
    }

    private async Task<int?> GetCategoryIdByNameAsync(string categoryName)
    {
        var category = await _categoryRepository.GetByNameAsync(categoryName);
        return category?.Id;
    }

    private async Task<int?> GetUserIdByUsernameAsync(string username)
    {
        var user = await _userRepository.GetByUsernameAsync(username);
        return user?.Id;
    }

    public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
    {
        var products = await _productRepository.GetAllAsync();
        return products.Select(p => new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Barcode = p.Barcode,
            Quantity = p.Quantity,
            AddedDate = p.AddedDate,
            UpdatedDate = p.UpdatedDate ?? default,
            CategoryName = p.Category?.Name,
            UserName = p.User?.Username,
        });
    }

    public async Task<ProductDto> GetProductByIdAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null) return null;

        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Barcode = product.Barcode,
            Quantity = product.Quantity,
            AddedDate = product.AddedDate,
            UpdatedDate = product.UpdatedDate ?? default,
            CategoryName = product.Category?.Name,
            UserName = product.User?.Username,
        };
    }

    public async Task CreateProductAsync(ProductDto productDto)
    {
        var categoryId = await GetCategoryIdByNameAsync(productDto.CategoryName);
        var userId = await GetUserIdByUsernameAsync(productDto.UserName);

        if (!categoryId.HasValue || !userId.HasValue)
        {
            throw new ArgumentException("Invalid category name or username.");
        }

        var product = new Product
        {
            Name = productDto.Name,
            Barcode = productDto.Barcode,
            Quantity = productDto.Quantity,
            AddedDate = productDto.AddedDate,
            UpdatedDate = productDto.UpdatedDate,
            CategoryId = categoryId.Value,
            UserId = userId.Value
        };

        await _productRepository.AddAsync(product);
    }

    public async Task UpdateProductAsync(int id, ProductDto productDto)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null) return;

        var categoryId = await GetCategoryIdByNameAsync(productDto.CategoryName);
        var userId = await GetUserIdByUsernameAsync(productDto.UserName);

        if (!categoryId.HasValue || !userId.HasValue)
        {
            throw new ArgumentException("Invalid category name or username.");
        }

        product.Name = productDto.Name;
        product.Barcode = productDto.Barcode;
        product.Quantity = productDto.Quantity;
        product.AddedDate = productDto.AddedDate;
        product.UpdatedDate = productDto.UpdatedDate;
        product.CategoryId = categoryId.Value;
        product.UserId = userId.Value;

        await _productRepository.UpdateAsync(product);
    }

    public async Task DeleteProductAsync(int id)
    {
        await _productRepository.DeleteAsync(id);
    }
}
