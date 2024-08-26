using System.ComponentModel.DataAnnotations;

namespace StokTakipUygulamasi.DTO
{
    public class UserRegisterDto
    {
        [Required(ErrorMessage = "Name is required.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Mail is required.")]
        [EmailAddress(ErrorMessage = "Invalid email address.")]
        public string Mail { get; set; }

        [Required(ErrorMessage = "Role is required.")]
        public string Role { get; set; }
    }
}
