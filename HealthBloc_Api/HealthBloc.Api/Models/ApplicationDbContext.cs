using Microsoft.EntityFrameworkCore;

namespace HealthBloc.Api.Models
{
    public class ApplicationDbContext: DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }

        public DbSet<Patient> Patients { get; set; }
        public DbSet<PatientAllergy> PatientAllergies { get; set; }
        public DbSet<PatientTreatment> PatientTreatments { get; set; }
        public DbSet<HealthProvider> HealthProviders { get; set; }
        public DbSet<HealthProviderStaff> HealthProviderStaffs { get; set; }

        public DbSet<User> Users { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }


    }
}
