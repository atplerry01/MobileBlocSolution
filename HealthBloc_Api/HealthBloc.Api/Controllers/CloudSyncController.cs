using AutoMapper;
using HealthBloc.Api.Models;
using HealthBloc.Api.VModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace HealthBloc.Api.Controllers
{
    [Route("api/[controller]")]
    public class CloudSyncController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        public CloudSyncController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpPost("UpdatePatientMedicalDetails/{patientId}")]
        public async Task<IActionResult> UpdatePatientMedicalDetails(string patientId)
        {
            var patient = await _context.Patients.FindAsync(patientId);

            if (patient == null)
            {
                var res2 = new ResponseModel { ResponseCode = HttpStatusCode.BadRequest, Message = "Error", Data = null };
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


            /// Summary
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
                LastTreatment = lastTreatmentS,
                Allergies = allergiesS,
                PatientTreatments = treatmentsS,
            };


            //// Start the process
            //////////////////////
            ///
            patient.FullMedicalData = medHistory.ToString();
            patient.SummarizedMedicalData = medHistorySummary.ToString();

            ///// Update NFCBlock
            patient.NfcMedicalData = medHistorySummary.ToString();

            /// Update Data
            _context.Patients.Update(patient);
            await _context.SaveChangesAsync();

            var patient2 = await _context.Patients.FindAsync(patientId);
            var patientResult = _mapper.Map<Patient, PatientModel>(patient2);

            var res1 = new ResponseModel { ResponseCode = HttpStatusCode.OK, Message = "Error", Data = patientResult };

            return Ok(res1);
        }

        [HttpPost("UpdateBlocReferences/{patientId}")]
        public async Task<IActionResult> UpdateBlocReferences([FromBody] string blocReference, string patientId) 
        {
            var patient = await _context.Patients.FindAsync(patientId);

            if (patient == null)
            {
                var res2 = new ResponseModel { ResponseCode = HttpStatusCode.BadRequest, Message = "Error", Data = null };
                return Ok(res2);
            }

            patient.BlocReference = blocReference;

            _context.Patients.Update(patient);
            await _context.SaveChangesAsync();

            var patient2 = await _context.Patients.FindAsync(patientId);
            var patientResult = _mapper.Map<Patient, PatientModel>(patient2);

            var res1 = new ResponseModel { ResponseCode = HttpStatusCode.OK, Message = "Error", Data = patientResult };

            return Ok(res1);
        }

        [HttpPost("UpdateIPFSReferences/{patientId}")]
        public async Task<IActionResult> UpdateIPFSReferences([FromBody] IPFSUpdateModel entity, string patientId)
        {
            var patient = await _context.Patients.FindAsync(patientId);

            if (patient == null)
            {
                var res2 = new ResponseModel { ResponseCode = HttpStatusCode.BadRequest, Message = "Error", Data = null };
                return Ok(res2);
            }

            patient.IpfsReference = entity.ReferenceHash;

            _context.Patients.Update(patient);
            await _context.SaveChangesAsync();

            var patient2 = await _context.Patients.FindAsync(patientId);
            var patientResult = _mapper.Map<Patient, PatientModel>(patient2);

            var res1 = new ResponseModel { ResponseCode = HttpStatusCode.OK, Message = "Error", Data = patientResult };

            return Ok(res1);
        }

    }
}
