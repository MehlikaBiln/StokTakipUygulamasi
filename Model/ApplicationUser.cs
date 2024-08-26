using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace StokTakipUygulamasi.Model
{
    public class ApplicationUser : IdentityUser
    {
        public int Id { get; set; }
        // Ekstra özellikler ekleyebilirsiniz
        public string Name { get; set; }
        public string Mail { get; set; }

        // Diğer özel özellikler veya metotlar
    }
}
