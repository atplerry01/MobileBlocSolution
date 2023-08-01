using AutoMapper;
using HealthBloc.Api.Models;
using HealthBloc.Api.VModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Versioning;
using System.Net;

namespace HealthBloc.Api.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class PatientsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public PatientsController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("ByProviderId/{providerId}")]
        public async Task<IActionResult> GetPatientByProviders(string providerId)
        {
            var result = await _context.Patients.Include(u => u.UserProfile).Include(p => p.PrimaryHealthProvider).Include(l => l.LastHealthProvider)
                    .Where(x => x.PrimaryHealthProviderId == providerId).ToListAsync();

            var res2 = _mapper.Map<List<Patient>, List<PatientModel>>(result);

            var res = new ResponseModel { ResponseCode = HttpStatusCode.OK, Message = "Successful", Data = res2 };

            return Ok(res);
        }

        [HttpGet("ById/{patientId}")]
        public async Task<IActionResult> GetPatient(string patientId)
        {
            if (_context.Patients == null)
            {
                var res1 = new ResponseModel { ResponseCode = HttpStatusCode.NoContent, Message = "Error", Data = null };
                return Ok(res1);
            }

            ////
            var patient = await _context.Patients
                    .Include(u => u.UserProfile)
                    .Include(p => p.PrimaryHealthProvider)
                    .Include(l => l.LastHealthProvider)
                    .Where(x => x.Id == patientId).SingleOrDefaultAsync();

            var result = _mapper.Map<Patient, PatientModel>(patient);

            if (patient == null)
            {
                var res2 = new ResponseModel { ResponseCode = HttpStatusCode.NotFound, Message = "Error", Data = null };
                return Ok(res2);
            }

            /// Full Data
            // lastTreatment
            var lastTreatment2 = await _context.PatientTreatments.Where(p => p.PatientId == patient.Id).OrderByDescending(o => o.CreatedOn).FirstOrDefaultAsync();
            var lastTreatment = _mapper.Map<PatientTreatment, PatientTreatmentModel>(lastTreatment2);

            // Allergies
            var allergies2 = await _context.PatientAllergies.Where(p => p.PatientId == patient.Id).OrderByDescending(o => o.CreatedOn).ToListAsync();
            var allergies = _mapper.Map<List<PatientAllergy>, List<PatientAllergyModel>>(allergies2);

            // PatietsTreatment
            var treatments2 = await _context.PatientTreatments.Where(p => p.PatientId == patient.Id).OrderByDescending(o => o.CreatedOn).ToListAsync();
            var treatments = _mapper.Map<List<PatientTreatment>, List<PatientTreatmentModel>>(treatments2);

            var medHistory = new PatientMedicalHistoryModel()
            {
                LastTreatment = lastTreatment,
                Allergies = allergies,
                PatientTreatments = treatments,
            };


            ///////////
            /// Summary
            /// /////////////
            var lastTreatmentS2 = await _context.PatientTreatments.Where(p => p.PatientId == patient.Id).OrderByDescending(o => o.CreatedOn).FirstOrDefaultAsync();
            var lastTreatmentS = _mapper.Map<PatientTreatment, PatientTreatmentModelV>(lastTreatment2);

            // Allergies
            var allergiesS2 = await _context.PatientAllergies.Where(p => p.PatientId == patient.Id).OrderByDescending(o => o.CreatedOn).Take(2).ToListAsync();
            var allergiesS = _mapper.Map<List<PatientAllergy>, List<PatientAllergyModelV>>(allergies2);

            // PatietsTreatment
            var treatmentsS2 = await _context.PatientTreatments.Where(p => p.PatientId == patient.Id).OrderByDescending(o => o.CreatedOn).Take(2).ToListAsync();
            var treatmentsS = _mapper.Map<List<PatientTreatment>, List<PatientTreatmentModelV>>(treatments2);

            var medHistorySummary = new PatientMedicalHistorySummaryModel()
            {
                PatientId = patient.Id,
                PatientName = patient.UserProfile.FullName,
                ProviderName = patient?.PrimaryHealthProvider.Name,
                LastTreatment = lastTreatmentS,
                Allergies = allergiesS,
                PatientTreatments = treatmentsS,
            };


            result.PatientMedicalHistory = medHistory;
            result.PatientMedicalHistorySummary = medHistorySummary;

            var res = new ResponseModel { ResponseCode = HttpStatusCode.OK, Message = "Successful", Data = result };

            return Ok(res);
        }

        [HttpPost("{profileId}/Provider/{providerId}/create")]
        public async Task<IActionResult> PatientProviderCreate(string profileId, string providerId)
        {
            var currentUser = await _context.UserProfiles.Where(x => x.Id == profileId).FirstOrDefaultAsync();
            var currentProvider = await _context.HealthProviders.Where(x => x.Id == providerId).FirstOrDefaultAsync();
            var providerPatient = await _context.Patients.Where(x => x.UserProfileId == profileId
                    && x.PrimaryHealthProviderId == providerId).FirstOrDefaultAsync();
            
            if (currentProvider == null)
            {
                var res1 = new ResponseModel
                {
                    ResponseCode = HttpStatusCode.BadRequest,
                    Message = "Provider does not exist",
                    Data = false
                };

                return Ok(res1);
            }

            if (currentUser == null)
            {
                var res2 = new ResponseModel
                {
                    ResponseCode = HttpStatusCode.BadRequest,
                    Message = "UserProfile does not exist",
                    Data = false
                };

                return Ok(res2);
            }

            if (providerPatient == null) {
                // Create a new entry
                var patientMod2 = new Patient()
                {
                    Id = Guid.NewGuid().ToString(),
                    UserProfileId = profileId,
                    PrimaryHealthProviderId = providerId,
                    LastHealthProviderId = providerId,

                    CreatedOn = DateTime.Now,
                    UpdatedOn = DateTime.Now
                };

                _context.Patients.Add(patientMod2);
            } else
            {
                // TODO: 
                // Patient Already Exist
                // Make default 
            }

            await _context.SaveChangesAsync();

            var providerPatient2 = await _context.Patients.Where(x => x.UserProfileId == profileId
                && x.PrimaryHealthProviderId == providerId).FirstOrDefaultAsync();

            var res = new ResponseModel
            {
                ResponseCode = HttpStatusCode.Created,
                Message = "New Data Added Successfully",
                Data = providerPatient2
            };

            return Ok(res);
        }


        private bool PatientExists(string id)
        {
            return (_context.Patients?.Any(e => e.Id == id)).GetValueOrDefault();
        }

        //[HttpDelete("{patientId}")]
        //public async Task<IActionResult> DeletePatient(string patientId)
        //{
        //    if (_context.Patients == null)
        //    {
        //        //return NotFound();
        //        var res1 = new ResponseModel { ResponseCode = HttpStatusCode.NotFound, Message = "Error", Data = null };
        //        return Ok(res1);
        //    }
        //    var entity = await _context.Patients.FindAsync(patientId);
        //    if (entity == null)
        //    {
        //        //return NotFound();
        //        var res2 = new ResponseModel { ResponseCode = HttpStatusCode.NotFound, Message = "Error", Data = null };
        //        return Ok(res2);
        //    }

        //    _context.Patients.Remove(entity);
        //    await _context.SaveChangesAsync();

        //    var res = new ResponseModel
        //    {
        //        ResponseCode = HttpStatusCode.OK,
        //        Message = "Data Successfully Deleted",
        //        Data = null
        //    };

        //    return Ok(res);
        //}


    }


}
