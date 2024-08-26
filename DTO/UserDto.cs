using System.Text.Json.Serialization;

public class UserDto
{
    public int Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
   
    [JsonIgnore]
    public string Password { get; set; }
    public string Role { get; set; }
}
