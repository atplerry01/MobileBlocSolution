namespace HealthBloc.Api.Models
{
    public class User
    {
        public User()
        {
            Id = new Guid().ToString();
        }

        public string Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public byte[] PasswordHash { get; set; } = new byte[0];
        public byte[] PasswordSalt { get; set; } = new byte[0];

    }
}
