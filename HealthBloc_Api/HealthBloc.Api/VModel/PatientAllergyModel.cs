using HealthBloc.Api.Models;

namespace HealthBloc.Api.VModel
{
    public class PatientAllergyModel
    {
        public string Id { get; set; }
        public string Name { get; set; }

        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }

    }

    public class PatientAllergyModelV
    {
        public string Name { get; set; }
    }

    public class PatientAllergyCreate
    {
        public string PatientId { get; set; }
        public string Name { get; set; }

    }

    public class PatientAllergyUpdate
    {
        public string Id { get; set; }
        public string PatientId { get; set; }
        public string Name { get; set; }

    }

}
