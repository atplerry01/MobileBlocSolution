namespace HealthBloc.Api.Common
{
    public static class Util
    {
        public static IConfigurationRoot AppConfiguration()
        {
            var configurationBuilder = new ConfigurationBuilder();
            var path = Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json");
            configurationBuilder.AddJsonFile(path, false);

            return configurationBuilder.Build();
        }
    }
}
