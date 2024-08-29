namespace StokTakipUygulamasi.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using StokTakipUygulamasi.Data;
    using StokTakipUygulamasi.DTO;
    using StokTakipUygulamasi.Model;
    using StokTakipUygulamasi.Models;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    [ApiController]
    [Route("api/[controller]")]
    public class UserCategoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserCategoryController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/usercategory
        [HttpGet]
        public async Task<IActionResult> GetUserCategories()
        {
            var userCategories = await _context.UserCategories
                .Include(uc => uc.User)
                .Include(uc => uc.Category)
                .ToListAsync();

            return Ok(userCategories);
        }

        // GET: api/usercategory/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetCategoriesByUser(int userId)
        {
            var categories = await _context.UserCategories
                .Where(uc => uc.UserId == userId)
                .Select(uc => new
                {
                    uc.Category.Id,
                    uc.Category.Name
                })
                .ToListAsync();

            return Ok(categories);
        }
        [HttpGet("category/{categoryId}")]
        public async Task<IActionResult> GetUsersByCategory(int categoryId)
        {
            var users = await _context.UserCategories
                .Where(uc => uc.CategoryId == categoryId)
                .Select(uc => uc.User)
                .ToListAsync();

            if (users == null)
            {
                return NotFound();
            }

            return Ok(users);
        }

        // POST: api/usercategory
        [HttpPost]
        public async Task<IActionResult> AssignCategoryToUser([FromBody] UserCategoryDto dto)
        {
            var user = await _context.Users.FindAsync(dto.UserId);
            var category = await _context.Categories.FindAsync(dto.CategoryId);

            if (user == null || category == null)
            {
                return BadRequest("Geçersiz kullanıcı veya kategori ID.");
            }

            var userCategory = new UserCategory
            {
                UserId = dto.UserId,
                CategoryId = dto.CategoryId
            };

            _context.UserCategories.Add(userCategory);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCategoriesByUser), new { userId = dto.UserId }, userCategory);
        }

        // DELETE: api/usercategory/user/{userId}/category/{categoryId}
        [HttpDelete("user/{userId}/category/{categoryId}")]
        public async Task<IActionResult> RemoveCategoryFromUser(int userId, int categoryId)
        {
            var userCategory = await _context.UserCategories
                .FirstOrDefaultAsync(uc => uc.UserId == userId && uc.CategoryId == categoryId);

            if (userCategory == null)
            {
                return NotFound();
            }

            _context.UserCategories.Remove(userCategory);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

}
