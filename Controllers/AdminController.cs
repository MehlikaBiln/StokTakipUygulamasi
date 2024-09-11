namespace StokTakipUygulamasi.Controllers
{
    using Dapper;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using StokTakipUygulamasi.Data;
    using StokTakipUygulamasi.DTO;
    using StokTakipUygulamasi.Models;
    using StokTakipUygulamasi.Repository;
    using StokTakipUygulamasi.Services;
    using System;
    using System.Linq;
    using System.Threading.Tasks;

    [ApiController]
    [Route("api/admin/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IProductRepository _productRepository;
        private readonly AppDbContext _context;

        // Constructor injection of IProductRepository and AppDbContext
        public AdminController(IProductRepository productRepository, AppDbContext context)
        {
            _productRepository = productRepository;
            _context = context;
        }



        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.User)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Barcode = p.Barcode,
                    Quantity = p.Quantity,
                    AddedDate = p.AddedDate,
                    UpdatedDate = p.UpdatedDate,
                    CategoryName = p.Category.Name,
                    UserName = p.User.Username,
                    Unit = p.Unit // Yeni alan
                })
                .ToListAsync();

            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                return NotFound();
            }

            var productDto = new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Barcode = product.Barcode,
                Quantity = product.Quantity,
                AddedDate = product.AddedDate,
                UpdatedDate = product.UpdatedDate,
                CategoryName = product.Category.Name,
                UserName = product.User.Username,
                Unit = product.Unit // Yeni alan
            };

            return Ok(productDto);
        }

        [HttpPost]
        public async Task<IActionResult> Create(ProductDto productDto)
        {
            var category = await _context.Categories
                .FirstOrDefaultAsync(c => c.Name == productDto.CategoryName);

            if (category == null)
            {
                return BadRequest("Kategori bulunamadı.");
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == productDto.UserName);

            if (user == null)
            {
                return BadRequest("Kullanıcı bulunamadı.");
            }

            var product = new Product
            {
                Name = productDto.Name,
                Barcode = productDto.Barcode,
                Quantity = productDto.Quantity,
                AddedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow,
                Category = category,
                User = user,
                Unit = productDto.Unit // Yeni alan
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            var createdProductDto = new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Barcode = product.Barcode,
                Quantity = product.Quantity,
                AddedDate = product.AddedDate,
                UpdatedDate = product.UpdatedDate,
                CategoryName = product.Category.Name,
                UserName = product.User.Username,
                Unit = product.Unit // Yeni alan
            };

            return CreatedAtAction(nameof(GetById), new { id = product.Id }, createdProductDto);
        }

        [HttpPut("decreaseByName")]
        public async Task<IActionResult> DecreaseQuantityByName([FromBody] ProductQuantityUpdateDto dto)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Name == dto.ProductName);
            if (product == null)
            {
                return NotFound("Ürün bulunamadı.");
            }

            if (product.Quantity < dto.QuantityToRemove)
            {
                return BadRequest("Stokta yeterli miktar yok.");
            }

            product.Quantity -= dto.QuantityToRemove;
            await _context.SaveChangesAsync();

            return Ok(product);
        }

        [HttpPut("increaseByName")]
        public async Task<IActionResult> IncreaseQuantityByName([FromBody] ProductQuantityUpdateDto dto)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Name == dto.ProductName);
            if (product == null)
            {
                return NotFound("Ürün bulunamadı.");
            }

            product.Quantity += dto.QuantityToAdd;
            await _context.SaveChangesAsync();

            return Ok(product);
        }

        [HttpDelete("ByName/{name}")]
        public async Task<IActionResult> DeleteByName(string name)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Name == name);

            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("WithFilter")]
        public IActionResult Geturun([FromQuery] string? name, [FromQuery] string? barcode, [FromQuery] string? categoryName, [FromQuery] string? unit)
        {
            IQueryable<Product> query = _context.Products
                .Include(p => p.Category)
                .Include(p => p.User);

            if (!string.IsNullOrEmpty(name))
            {
                string lowerName = name.ToLower();
                query = query.Where(p => p.Name.ToLower().Contains(lowerName));
            }

            if (!string.IsNullOrEmpty(barcode))
            {
                string lowerBarcode = barcode.ToLower();
                query = query.Where(p => p.Barcode.ToLower().Contains(lowerBarcode));
            }

            if (!string.IsNullOrEmpty(categoryName))
            {
                string lowerCategoryName = categoryName.ToLower();
                query = query.Where(p => p.Category.Name.ToLower().Contains(lowerCategoryName));
            }

            if (!string.IsNullOrEmpty(unit))
            {
                string lowerUnit = unit.ToLower();
                query = query.Where(p => p.Unit.ToLower().Contains(lowerUnit));
            }

            var products = query.Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Barcode = p.Barcode,
                Quantity = p.Quantity,
                AddedDate = p.AddedDate,
                UpdatedDate = p.UpdatedDate,
                CategoryName = p.Category.Name,
                UserName = p.User.Username,
                Unit = p.Unit // Yeni alan
            }).ToList();

            if (!products.Any())
            {
                return NotFound("Aradığınız kriterlere uygun ürün bulunamadı.");
            }

            return Ok(products);
        }
        [HttpGet("products-with-depot-info")]
        public async Task<ActionResult<List<ProductWithDepotInfoDto>>> GetProductsWithDepotInfo()
        {
            var result = await _productRepository.GetProductsWithDepotInfoAsync();
            return Ok(result);
        }

        [HttpPost("transfer")]
        public async Task<IActionResult> TransferProductBetweenDepots(string productName, string fromDepot, string toDepot, int quantity)
        {
            try
            {
                await _productRepository.TransferProductBetweenDepots(productName, fromDepot, toDepot, quantity);
                return Ok(new { Message = "Ürün başarıyla transfer edildi." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet("api/admin/available-products")]
        public async Task<IActionResult> GetAvailableProductsAsync()
        {
            var query = @"
    SELECT DISTINCT p.""Name""
    FROM public.""Products"" p
    JOIN public.""Categories"" c ON p.""CategoryId"" = c.""Id""
    WHERE EXISTS (
        SELECT 1
        FROM public.""Products"" p2
        WHERE p.""Name"" = p2.""Name""
        AND p2.""CategoryId"" <> p.""CategoryId""
    )
    ORDER BY p.""Name"";
    ";

            using (var connection = _context.Database.GetDbConnection())
            {
                var products = await connection.QueryAsync<ProductDto>(query);
                return Ok(products);
            }
        }



    }
}
