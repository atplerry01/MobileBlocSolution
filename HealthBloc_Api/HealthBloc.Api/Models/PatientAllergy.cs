using System.ComponentModel.DataAnnotations.Schema;

namespace HealthBloc.Api.Models
{
    public class PatientAllergy
    {
        public PatientAllergy()
        {
            Id = Guid.NewGuid().ToString();
            CreatedOn = DateTime.Now;
            UpdatedOn = DateTime.Now;
        }

        public string Id { get; set; }

        [ForeignKey("PatientId")]
        public string PatientId { get; set; }
        public virtual Patient Patient { get; set; }

        public string Name { get; set; }


        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }

    }
}
