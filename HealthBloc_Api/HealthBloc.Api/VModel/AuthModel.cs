namespace HealthBloc.Api.VModel
{
    public class AuthResponse
    {
        public UserProfileModel UserDetails { get; set; }
        public string JwtToken { get; set; }
        public string RefreshToken { get; set; }
        // public Token Token { get; set; }
    }

    public class Token
    {
        public string JwtToken { get; set; }
        public string RefreshToken { get; set; }
    }
}
