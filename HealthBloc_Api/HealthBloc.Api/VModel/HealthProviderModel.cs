namespace HealthBloc.Api.VModel
{
    public class HealthProviderModel
    {
        public string Id { get; set; }
        public string? Name { get; set; }
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }

        public string? Specialty { get; set; }


        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }
    }

    public class HealthProviderCreate
    {
        public string Name { get; set; }
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }

        public string? Specialty { get; set; }

    }

    public class HealthProviderUpdate
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }

        public string? Specialty { get; set; }

    }
}
