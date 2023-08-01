using AutoMapper;
using HealthBloc.Api.Models;
using HealthBloc.Api.VModel;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace HealthBloc.Api.Mappings
{
    public class DomainToResponseProfile : Profile
    {
        public DomainToResponseProfile()
        {
            CreateMap<HealthProvider, HealthProviderModel>();
            CreateMap<HealthProviderStaff, HealthProviderStaffModel>();
            CreateMap<PatientAllergy, PatientAllergyModel>();
            CreateMap<PatientAllergy, PatientAllergyModelV>();
            CreateMap<Patient, PatientModel>();
            CreateMap<PatientTreatment, PatientTreatmentModel>();
            CreateMap<PatientTreatment, PatientTreatmentModelV>();
            CreateMap<User, UserModel>();
            CreateMap<UserProfile, UserProfileModel>();
        
        }
    }
}
