namespace HealthBloc.Api.Models
{
    public class PatientMedicalHistory
    {
        public PatientMedicalHistory()
        {
            Id = Guid.NewGuid().ToString();
            CreatedOn = DateTime.Now;
            UpdatedOn = DateTime.Now;
        }

        public string Id { get; set; }
        public string PatientId { get; set; }
        public string CurrentMedication { get; set; }
        public string ProgressiveNote { get; set; }


        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }

        /// Allergies

    }
}
