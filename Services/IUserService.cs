namespace StokTakipUygulamasi.Services
{
    public interface IUserService
    {
        Task<UserDto> GetUserByIdAsync(int id);
        Task<UserDto> GetUserByUsernameAsync(string username);
        Task<IEnumerable<UserDto>> GetAllUsersAsync();
        Task RegisterUserAsync(UserDto userDto);
        Task<string> LoginAsync(UserDto loginDto);
    }

}
