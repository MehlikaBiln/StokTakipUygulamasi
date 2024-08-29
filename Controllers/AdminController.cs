namespace StokTakipUygulamasi.Controllers
{
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using StokTakipUygulamasi.Data;
    using StokTakipUygulamasi.DTO;
    using StokTakipUygulamasi.Models;
    using System;
    using System.Linq;
    using System.Threading.Tasks;

    [ApiController]
    [Route("api/admin/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
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
            // Ürün adını kullanarak ürünü bul
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Name == name);

            if (product == null)
            {
                return NotFound();
            }

            // Ürünü sil
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
    }
}