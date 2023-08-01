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
    public class HealthProviderStaffsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public HealthProviderStaffsController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("{providerId}")]
        public async Task<IActionResult> GetHealthProviderStaffs(string providerId)
        {
            var hStaff = await _context.HealthProviderStaffs.Where(x => x.HealthProviderId == providerId).FirstOrDefaultAsync();

            if (hStaff == null)
            {
                var res1 = new ResponseModel
                {
                    ResponseCode = HttpStatusCode.NoContent,
                    Message = "Error",
                    Data = null
                };

                return Ok(res1);
            }

            var providerStaffs = await _context.HealthProviderStaffs.Include(u => u.UserProfile).Include(p => p.HealthProvider)
                    .Where(x => x.HealthProviderId == providerId).ToListAsync();
            
            var lists = _mapper.Map<List<HealthProviderStaff>, List<HealthProviderStaffModel>>(providerStaffs);

            var res = new ResponseModel { ResponseCode = HttpStatusCode.OK, Message = "Successful", Data = lists };

            return Ok(res);
        }

        [HttpGet("{providerId}/GetStaffById/{StaffId}")]
        public async Task<IActionResult> GetHealthProviderStaffs(string providerId, string staffId)
        {
            var hStaff = await _context.HealthProviderStaffs.Where(x => x.HealthProviderId == providerId).FirstOrDefaultAsync();

            if (hStaff == null)
            {
                var res1 = new ResponseModel
                {
                    ResponseCode = HttpStatusCode.NoContent,
                    Message = "Error",
                    Data = null
                };

                return Ok(res1);
            }

            var staffDetails = await _context.HealthProviderStaffs.Include(u => u.UserProfile).Include(p => p.HealthProvider)
                    .Where(x => x.HealthProviderId == providerId).FirstOrDefaultAsync();

            var lists = _mapper.Map<HealthProviderStaff, HealthProviderStaffModel>(staffDetails);

            var res = new ResponseModel { ResponseCode = HttpStatusCode.OK, Message = "Successful", Data = lists };

            return Ok(res);
        }


        [HttpPost("create")]
        public async Task<IActionResult> PostHealthProviderStaff([FromBody]HealthProviderStaffCreate entity)
        {
            var provider = await _context.HealthProviders.FindAsync(entity.HealthProviderId);

            if (provider == null)
            {
                var res1 = new ResponseModel { ResponseCode = HttpStatusCode.BadRequest, Message = "Provider record not found", Data = null };
                return Ok(res1);
            }

            var userProfile = await _context.UserProfiles.FindAsync(entity.UserProfileId);

            if (userProfile == null)
            {
                var res1 = new ResponseModel { ResponseCode = HttpStatusCode.BadRequest, Message = "User profile not found", Data = null };
                return Ok(res1);
            }

            var ent = _mapper.Map<HealthProviderStaffCreate, HealthProviderStaff>(entity);

            ent.Id = Guid.NewGuid().ToString();
            ent.UpdatedOn = DateTime.Now;
            ent.CreatedOn = DateTime.Now;

            // Create the Staff as Doctor
            _context.HealthProviderStaffs.Add(ent);

            // Update the profile as a doctor
            userProfile.IsDoctor = true;
            _context.UserProfiles.Update(userProfile);

            await _context.SaveChangesAsync();

            var res = new ResponseModel
            {
                ResponseCode = HttpStatusCode.Created,
                Message = "New Data Added Successfully",
                Data = ent
            };

            return Ok(res);
        }

        private bool HealthProviderStaffExists(string id)
        {
            return (_context.HealthProviderStaffs?.Any(e => e.Id == id)).GetValueOrDefault();
        }


        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutHealthProviderStaff(string id, HealthProviderStaffUpdate entity)
        //{
        //    if (id != entity.Id)
        //    {
        //        var res2 = new ResponseModel { ResponseCode = HttpStatusCode.BadRequest, Message = "Request Id not valid with teh payload Id", Data = null };
        //        return Ok(res2);
        //    }

        //    var ent = _mapper.Map<HealthProviderStaffUpdate, HealthProviderStaff>(entity);

        //    ent.UpdatedOn = DateTime.Now;
        //    _context.Entry(ent).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!HealthProviderStaffExists(id))
        //        {
        //            // return NotFound();
        //            var res3 = new ResponseModel { ResponseCode = HttpStatusCode.NotFound, Message = "Error", Data = null };
        //            return Ok(res3);
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    var res = new ResponseModel { ResponseCode = HttpStatusCode.OK, Message = "Successful", Data = null };
        //    return Ok(res);

        //}

        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteHealthProviderStaff(string id)
        //{
        //    if (_context.HealthProviderStaffs == null)
        //    {
        //        //return NotFound();
        //        var res1 = new ResponseModel { ResponseCode = HttpStatusCode.NotFound, Message = "Error", Data = null };
        //        return Ok(res1);
        //    }
        //    var entity = await _context.HealthProviderStaffs.FindAsync(id);
        //    if (entity == null)
        //    {
        //        //return NotFound();
        //        var res2 = new ResponseModel { ResponseCode = HttpStatusCode.NotFound, Message = "Error", Data = null };
        //        return Ok(res2);
        //    }

        //    _context.HealthProviderStaffs.Remove(entity);
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
