using System.ComponentModel.DataAnnotations.Schema;

namespace HealthBloc.Api.Models
{
    public class HealthProviderStaff
    {
        public HealthProviderStaff()
        {
            Id = Guid.NewGuid().ToString();
            CreatedOn = DateTime.Now;
            UpdatedOn = DateTime.Now;
        }

        public string Id { get; set; }

        [ForeignKey("UserProfileId")]
        public string UserProfileId { get; set; }
        public virtual UserProfile UserProfile { get; set; }

        [ForeignKey("HealthProviderId")]
        public string HealthProviderId { get; set; }
        public virtual HealthProvider HealthProvider { get; set; }

        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }

    }
}
