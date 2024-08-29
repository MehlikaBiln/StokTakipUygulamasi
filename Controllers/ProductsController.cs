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
[Route("api/user/[controller]")]
public class ProductController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProductController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{id}", Name = "GetById")]
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
            Unit = product.Unit // Unit alanını ekledik
        };

        return Ok(productDto);
    }


    [HttpPost("add")]
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
            AddedDate = DateTime.UtcNow, // Tarihleri sunucu tarafında ayarlıyoruz
            UpdatedDate = DateTime.UtcNow, // Tarihleri sunucu tarafında ayarlıyoruz
            Category = category,
            User = user,
            Unit = productDto.Unit // Unit alanını ekledik
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
            Unit = product.Unit // Unit alanını ekledik
        };

        return CreatedAtAction(nameof(GetById), new { id = product.Id }, createdProductDto);
    }


    [HttpPut("decrease")]
    public async Task<IActionResult> DecreaseQuantity([FromBody] ProductQuantityUpdateDto dto)
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

    [HttpPut("increase")]
    public async Task<IActionResult> IncreaseQuantity([FromBody] ProductQuantityUpdateDto dto)
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
}
