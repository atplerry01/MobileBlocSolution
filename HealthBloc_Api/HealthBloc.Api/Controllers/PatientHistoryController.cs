using AutoMapper;
using HealthBloc.Api.Models;
using HealthBloc.Api.VModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace HealthBloc.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientHistoryController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        public PatientHistoryController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        /// Allergy
        [HttpGet("{patientId}/Allergy")]
        public async Task<IActionResult> GetPatientAllergies(string patientId)
        {

            var patientAllergies = await _context.PatientAllergies.Where(x => x.PatientId == patientId).ToListAsync();

            if (patientAllergies == null)
            {
                var res1 = new ResponseModel
                {
                    ResponseCode = HttpStatusCode.NoContent,
                    Message = "No Content",
                    Data = null
                };

                return Ok(res1);
            }

            var r = _mapper.Map<List<PatientAllergy>, List<PatientAllergyModel>>(patientAllergies);

            var res = new ResponseModel { ResponseCode = HttpStatusCode.OK, Message = "Successful", Data = r };

            return Ok(res);
        }

        [HttpPost("{patientId}/Allery/create")]
        public async Task<IActionResult> PatientAllergyCreate([FromBody] PatientAllergyCreate entity, string patientId)
        {
            var patient = await _context.Patients.FindAsync(patientId);

            if (patient == null)
            {
                var res2 = new ResponseModel
                {
                    ResponseCode = HttpStatusCode.BadRequest,
                    Message = "UserProfile does not exist",
                    Data = false
                };

                return Ok(res2);
            }

            if (patientId != entity.PatientId)
            {
                var res3 = new ResponseModel
                {
                    ResponseCode = HttpStatusCode.BadRequest,
                    Message = "Inconsistent patientId",
                    Data = false
                };

                return Ok(res3);
            }

            var allery = _mapper.Map<PatientAllergyCreate, PatientAllergy>(entity);

            allery.Id = Guid.NewGuid().ToString();
            allery.CreatedOn = DateTime.Now;
            allery.UpdatedOn = DateTime.Now;

            _context.PatientAllergies.Add(allery);
            await _context.SaveChangesAsync();

            var res = new ResponseModel
            {
                ResponseCode = HttpStatusCode.Created,
                Message = "New Data Added Successfully",
                Data = allery
            };

            return Ok(res);
        }



        /// 
        /// Treatment
        [HttpGet("{patientId}/Treatments")]
        public async Task<IActionResult> GetPatientTreatments(string patientId)
        {

            var patientTreatments = await _context.PatientTreatments.Where(x => x.Id == patientId).ToListAsync();

            if (patientTreatments == null)
            {
                var res1 = new ResponseModel
                {
                    ResponseCode = HttpStatusCode.BadRequest,
                    Message = "Error",
                    Data = null
                };

                return Ok(res1);
            }


            var r = _mapper.Map<List<PatientTreatment>, List<PatientTreatmentModel>>(patientTreatments);

            var res = new ResponseModel { ResponseCode = HttpStatusCode.OK, Message = "Successful", Data = r };

            return Ok(res);
        }

        [HttpPost("{patientId}/Treatment/create")]
        public async Task<IActionResult> PatientTreatmentCreate([FromBody] PatientTreatmentCreate entity, string patientId)
        {
            var patient = await _context.Patients.FindAsync(patientId);
            var healthProvider = await _context.HealthProviders.FindAsync(entity.HealthProviderId);

            if (patient == null)
            {
                var res2 = new ResponseModel
                {
                    ResponseCode = HttpStatusCode.BadRequest,
                    Message = "Patient does not exist",
                    Data = false
                };

                return Ok(res2);
            }

            if (healthProvider == null)
            {
                var res2 = new ResponseModel
                {
                    ResponseCode = HttpStatusCode.BadRequest,
                    Message = "HealthProvider does not exist",
                    Data = false
                };

                return Ok(res2);
            }

            var treatment = _mapper.Map<PatientTreatmentCreate, PatientTreatment>(entity);

            treatment.Id = Guid.NewGuid().ToString();
            treatment.CreatedOn = DateTime.Now;
            treatment.UpdatedOn = DateTime.Now;

            _context.PatientTreatments.Add(treatment);
            await _context.SaveChangesAsync();

            var res = new ResponseModel
            {
                ResponseCode = HttpStatusCode.Created,
                Message = "New Data Added Successfully",
                Data = treatment
            };

            return Ok(res);
        }

    }
}
