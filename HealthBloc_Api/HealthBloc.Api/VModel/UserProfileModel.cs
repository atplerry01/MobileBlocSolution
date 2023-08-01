using HealthBloc.Api.Models;

namespace HealthBloc.Api.VModel
{
    public class LoginCreate
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class UserProfileModel
    {
        public string Id { get; set; }
        public string UserId { get; set; }

        public string Email { get; set; }
        public string FullName { get; set; }
        public string Gender { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string Region { get; set; }
        public string Country { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string NationalID { get; set; }


        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsDoctor { get; set; }

        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }

    }

    public class UserProfileCreate
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string Gender { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string Region { get; set; }
        public string Country { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string NationalID { get; set; }
    }

}
