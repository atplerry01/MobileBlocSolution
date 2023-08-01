using System.ComponentModel.DataAnnotations.Schema;

namespace HealthBloc.Api.Models
{
    public class PatientTreatment
    {
        public PatientTreatment()
        {
            Id = Guid.NewGuid().ToString();
            CreatedOn = DateTime.Now;
            UpdatedOn = DateTime.Now;
        }

        public string Id { get; set; }


        [ForeignKey("PatientId")]
        public string PatientId { get; set; }
        public virtual Patient Patient { get; set; }


        [ForeignKey("HealthProviderId")]
        public string HealthProviderId { get; set; }
        public virtual HealthProvider HealthProvider { get; set; }


        public string TreatmentName { get; set; }
        public string TreatmentDetails { get; set; }
        public string TreatmentMedication { get; set; }


        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }
    }
}
