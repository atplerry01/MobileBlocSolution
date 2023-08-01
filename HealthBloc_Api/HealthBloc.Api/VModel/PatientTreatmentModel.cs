using HealthBloc.Api.Models;
using System.ComponentModel.DataAnnotations;

namespace HealthBloc.Api.VModel
{
    public class PatientTreatmentModel
    {

        public string Id { get; set; }
        public string TreatmentName { get; set; }
        public string TreatmentDetails { get; set; }
        public string TreatmentMedication { get; set; }

        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }
    }

    public class PatientTreatmentModelV
    {
        public string TreatmentName { get; set; }
        public string TreatmentDetails { get; set; }
        public string TreatmentMedication { get; set; }
        public DateTime CreatedOn { get; set; }
    }

    public class PatientTreatmentCreate
    {
        public string PatientId { get; set; }
        public string HealthProviderId { get; set; }

        public string TreatmentName { get; set; }
        public string TreatmentDetails { get; set; }
        public string TreatmentMedication { get; set; }

    }

    public class PatientTreatmentUpdate
    {

        public string Id { get; set; }
        public string PatientId { get; set; }
        public string HealthProviderId { get; set; }

        public string TreatmentName { get; set; }
        public string TreatmentDetails { get; set; }
        public string TreatmentMedication { get; set; }

    }


}
