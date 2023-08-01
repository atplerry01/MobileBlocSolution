using AutoMapper;
using HealthBloc.Api.Models;
using HealthBloc.Api.VModel;
using System.Diagnostics.Metrics;

namespace HealthBloc.Api.Mappings
{
    public class RequestToDomainProfile : Profile
    {
        public RequestToDomainProfile()
        {
            CreateMap<HealthProviderCreate, HealthProvider>();
            CreateMap<HealthProviderUpdate, HealthProvider>();
            
            CreateMap<HealthProviderStaffCreate, HealthProviderStaff>();
            CreateMap<HealthProviderStaffUpdate, HealthProviderStaff>();
            
            CreateMap<PatientAllergyCreate, PatientAllergy>();
            CreateMap<PatientAllergyUpdate, PatientAllergy>();
            
            CreateMap<PatientProviderCreate, Patient>();
            CreateMap<PatientProviderUpdate, Patient>();
            CreateMap<PatientCloudUpdate, Patient>();

            CreateMap<PatientTreatmentCreate, PatientTreatment>();
            CreateMap<PatientTreatmentUpdate, PatientTreatment>();
            
            CreateMap<UserProfileCreate, User>();
            CreateMap<UserProfileCreate, UserProfile>();
        }
    }
}
