using HealthBloc.Api.Models;

namespace HealthBloc.Api.VModel
{
    public class HealthProviderStaffModel
    {

        public string Id { get; set; }
        public string UserProfileId { get; set; }
        public virtual UserProfileModel UserProfile { get; set; }

        public string HealthProviderId { get; set; }
        public virtual HealthProviderModel HealthProvider { get; set; }

        public string Role { get; set; }


        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }

    }

    public class HealthProviderStaffCreate
    {
        public string UserProfileId { get; set; }
        public string HealthProviderId { get; set; }
        public string Role { get; set; }

    }

    public class HealthProviderStaffUpdate
    {

        public string Id { get; set; }
        public string UserProfileId { get; set; }
        public string HealthProviderId { get; set; }
        public string Role { get; set; }

    }

}
