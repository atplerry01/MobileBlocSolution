using System.ComponentModel.DataAnnotations.Schema;

namespace HealthBloc.Api.Models
{
    public class Patient
    {
        public Patient()
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
        public string PrimaryHealthProviderId { get; set; }
        public virtual HealthProvider PrimaryHealthProvider { get; set; }


        [ForeignKey("HealthProviderId")]
        public string LastHealthProviderId { get; set; }
        public virtual HealthProvider LastHealthProvider { get; set; }

        public string? BlocReference { get; set; }
        public string? IpfsReference { get; set; }

        public string? FullMedicalData { get; set; }
        public string? SummarizedMedicalData { get; set; }
        public string? NfcMedicalData { get; set; } // Compress Data


        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }


    }
}
