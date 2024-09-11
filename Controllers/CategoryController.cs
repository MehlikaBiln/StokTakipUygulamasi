using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StokTakipUygulamasi.Data;
using StokTakipUygulamasi.DTO;
using StokTakipUygulamasi.Models;

[ApiController]
[Route("api/[controller]")]
public class CategoryController : ControllerBase
{
    private readonly AppDbContext _context;

    public CategoryController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/category
    [HttpGet]
    public ActionResult<IEnumerable<CategoryWithProductsDto>> GetCategories()
    {
        var categories = _context.Categories
            .Select(c => new CategoryWithProductsDto
            {
                Id = c.Id,
                Name = c.Name,
                UserName = _context.Users.FirstOrDefault(u => u.Id == c.UserId).Username,
                Products = c.Products.Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Barcode = p.Barcode,
                    Quantity = p.Quantity,
                    AddedDate = p.AddedDate,
                    UpdatedDate = p.UpdatedDate,
                    CategoryName = c.Name,
                    UserName = _context.Users.FirstOrDefault(u => u.Id == p.UserId).Username,
                    Unit = p.Unit // Unit alanını ekledik
                }).ToList()
            }).ToList();

        return Ok(categories);
    }


    // GET: api/category/5
    [HttpGet("{id}")]
    public ActionResult<CategoryWithProductsDto> GetCategory(int id)
    {
        var category = _context.Categories
            .Where(c => c.Id == id)
            .Select(c => new CategoryWithProductsDto
            {
                Id = c.Id,
                Name = c.Name,
                UserName = _context.Users.FirstOrDefault(u => u.Id == c.UserId).Username,
                Products = c.Products.Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Barcode = p.Barcode,
                    Quantity = p.Quantity,
                    AddedDate = p.AddedDate,
                    UpdatedDate = p.UpdatedDate,
                    CategoryName = c.Name,
                    UserName = _context.Users.FirstOrDefault(u => u.Id == p.UserId).Username,
                    Unit = p.Unit
                }).ToList()
            }).FirstOrDefault();

        if (category == null)
        {
            return NotFound();
        }

        return Ok(category);
    }


    // POST: api/category
    [HttpPost]
    public ActionResult<CategoryDto> CreateCategory(CategoryDto categoryDto)
    {
        if (ModelState.IsValid)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == categoryDto.UserName);
            if (user == null)
            {
                return BadRequest("Geçersiz UserName.");
            }

            var category = new Category
            {
                Name = categoryDto.Name,
                UserId = user.Id
            };

            _context.Categories.Add(category);

            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateException ex)
            {
                Console.WriteLine(ex.InnerException?.Message);
                throw;
            }

            categoryDto.Id = category.Id;

            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, categoryDto);
        }
        return BadRequest(ModelState);
    }

    // PUT: api/category/5
    [HttpPut("{id}")]
    public IActionResult UpdateCategory(int id, CategoryDto categoryDto)
    {
        if (id != categoryDto.Id)
        {
            return BadRequest();
        }

        if (ModelState.IsValid)
        {
            var category = _context.Categories.Find(id);
            if (category == null)
            {
                return NotFound();
            }

            var user = _context.Users.FirstOrDefault(u => u.Username == categoryDto.UserName);
            if (user == null)
            {
                return BadRequest("Geçersiz UserName.");
            }

            category.Name = categoryDto.Name;
            category.UserId = user.Id;

            _context.Entry(category).State = EntityState.Modified;
            _context.SaveChanges();
            return NoContent();
        }
        return BadRequest(ModelState);
    }

    // DELETE: api/category/5
    [HttpDelete("{id}")]
    public IActionResult DeleteCategory(int id)
    {
        var category = _context.Categories.Find(id);
        if (category == null)
        {
            return NotFound();
        }

        _context.Categories.Remove(category);
        _context.SaveChanges();
        return NoContent();
    }
}
