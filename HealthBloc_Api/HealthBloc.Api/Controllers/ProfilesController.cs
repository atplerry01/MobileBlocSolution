using AutoMapper;
using HealthBloc.Api.Models;
using HealthBloc.Api.VModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace HealthBloc.Api.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ProfilesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public ProfilesController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetProfiles()
        {
            if (_context.UserProfiles == null)
            {
                var res1 = new ResponseModel
                {
                    ResponseCode = HttpStatusCode.NoContent,
                    Message = "Error",
                    Data = null
                };

                return Ok(res1);
            }

            var result = await _context.UserProfiles.ToListAsync();

            var res = new ResponseModel { ResponseCode = HttpStatusCode.OK, Message = "Successful", Data = result };

            return Ok(res);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProfile(string id)
        {
            if (_context.UserProfiles == null)
            {
                var res1 = new ResponseModel { ResponseCode = HttpStatusCode.NoContent, Message = "Error", Data = null };
                return Ok(res1);
            }

            ////
            var entity = await _context.UserProfiles.FindAsync(id);
            var result = _mapper.Map<UserProfile, UserProfileModel>(entity);

            if (entity == null)
            {
                var res2 = new ResponseModel { ResponseCode = HttpStatusCode.NotFound, Message = "Error", Data = null };
                return Ok(res2);
            }

            var res = new ResponseModel { ResponseCode = HttpStatusCode.OK, Message = "Successful", Data = result };

            return Ok(res);
        }

        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteProfile(string id)
        //{
        //    if (_context.UserProfiles == null)
        //    {
        //        //return NotFound();
        //        var res1 = new ResponseModel { ResponseCode = HttpStatusCode.NotFound, Message = "Error", Data = null };
        //        return Ok(res1);
        //    }
        //    var entity = await _context.UserProfiles.FindAsync(id);
        //    if (entity == null)
        //    {
        //        //return NotFound();
        //        var res2 = new ResponseModel { ResponseCode = HttpStatusCode.NotFound, Message = "Error", Data = null };
        //        return Ok(res2);
        //    }

        //    _context.UserProfiles.Remove(entity);
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
