namespace HealthBloc.Api.Models
{
    public class HealthProvider
    {
        public HealthProvider()
        {
            Id = Guid.NewGuid().ToString();
            CreatedOn = DateTime.Now;
            UpdatedOn = DateTime.Now;
        }

        public string Id { get; set; }
        public string? Name { get; set; }
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }

        public string? Specialty { get; set; }


        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }

        // Patients Records
        // Staff Management

    }
}
