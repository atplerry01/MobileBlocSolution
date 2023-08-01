using System.ComponentModel.DataAnnotations.Schema;

namespace HealthBloc.Api.Models
{
    public class UserProfile
    {
        public UserProfile()
        {
            Id = new Guid().ToString();
            IsActive = true;
            IsDeleted = false;
            CreatedOn = DateTime.Now;
            UpdatedOn = DateTime.Now;
        }

        public string Id { get; set; }

        [ForeignKey("UserId")]
        public string UserId { get; set; }
        public virtual User User { get; set; }

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
        public bool IsDoctor { get; set; } = false;

        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }

    }
}
