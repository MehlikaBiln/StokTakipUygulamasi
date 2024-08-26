namespace StokTakipUygulamasi.Repository
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User> GetUserByUsernameAsync(string sername);
        Task<User> GetByUsernameAsync(string username);
            // Diğer metodlar
        

        Task<User> GetByIdAsync(int id);
        Task CreateUserAsync(User user);
     
        // Diğer metodlar
    }

}
