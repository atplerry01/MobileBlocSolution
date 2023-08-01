namespace HealthBloc.Api.Common
{
    public class Rootobject
    {
        public int responseCode { get; set; }
        public string message { get; set; }
        public Data data { get; set; }
    }

    public class Data
    {
        public string id { get; set; }
        public object userId { get; set; }
        public string primaryHealthProviderId { get; set; }
        public object secondaryHealthProviderId { get; set; }
        public object blocReference { get; set; }
        public object ipfsReference { get; set; }
        public object fullMedicalData { get; set; }
        public object summarizedMedicalData { get; set; }
        public object nfcMedicalData { get; set; }
        public Patientmedicalhistory patientMedicalHistory { get; set; }
        public Patientmedicalhistorysummary patientMedicalHistorySummary { get; set; }
        public DateTime createdOn { get; set; }
        public DateTime updatedOn { get; set; }
    }

    public class Patientmedicalhistory
    {
        public object lastTreatment { get; set; }
        public object[] allergies { get; set; }
        public object[] patientTreatments { get; set; }
    }

    public class Patientmedicalhistorysummary
    {
        public object lastTreatment { get; set; }
        public object[] allergies { get; set; }
        public object[] patientTreatments { get; set; }
    }

}
