using HealthBloc.Api.Models;

namespace HealthBloc.Api.VModel
{
    public class PatientModel
    {
        
        public string Id { get; set; }

        public string UserProfileId { get; set; }
        public virtual UserProfileModel UserProfile { get; set; }

        public string PrimaryHealthProviderId { get; set; }
        public virtual HealthProviderModel PrimaryHealthProvider { get; set; }

        public string LastHealthProviderId { get; set; }
        public virtual HealthProviderModel LastHealthProvider { get; set; }


        public string BlocReference { get; set; }
        public string IpfsReference { get; set; }

        public string FullMedicalData { get; set; }
        public string SummarizedMedicalData { get; set; }
        public string NfcMedicalData { get; set; }

        public PatientMedicalHistoryModel PatientMedicalHistory { get; set; }
        public PatientMedicalHistorySummaryModel PatientMedicalHistorySummary { get; set; }


        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }



    }

    public class PatientProviderCreate
    {
        public string UserProfileId { get; set; }
        public string PrimaryHealthProviderId { get; set; }
    }

    public class PatientProviderUpdate
    {
        public string Id { get; set; }
        public string UserProfileId { get; set; }
        public string? PrimaryHealthProviderId { get; set; }
        public string? LastHealthProviderId { get; set; }


    }

    public class PatientCloudUpdate
    {
        public string Id { get; set; }
        public string UserProfileId { get; set; }
        public string? PrimaryHealthProviderId { get; set; }
        public string? LastHealthProviderId { get; set; }


        public string BlocReference { get; set; }
        public string IpfsReference { get; set; }

        public string FullMedicalData { get; set; }
        public string SummarizedMedicalData { get; set; }
        public string NfcMedicalData { get; set; }

    }


    public class PatientMedicalHistoryModel
    {
        public PatientTreatmentModel LastTreatment { get; set; }
        public List<PatientAllergyModel> Allergies { get; set; }
        public List<PatientTreatmentModel> PatientTreatments { get; set;}

    }
    public class PatientMedicalHistorySummaryModel
    {
        public string PatientId { get; set; }
        public string PatientName { get; set; }
        public string ProviderName { get; set; }
        public PatientTreatmentModelV LastTreatment { get; set; }
        public List<PatientAllergyModelV> Allergies { get; set; }
        public List<PatientTreatmentModelV> PatientTreatments { get; set; }

    }




}
