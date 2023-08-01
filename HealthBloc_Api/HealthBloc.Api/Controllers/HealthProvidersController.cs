using AutoMapper;
using HealthBloc.Api.Models;
using HealthBloc.Api.VModel;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace HealthBloc.Api.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class HealthProvidersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public HealthProvidersController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetHealthProviders()
        {

            var result = await _context.HealthProviders.ToListAsync();

            var res =  new ResponseModel { ResponseCode = HttpStatusCode.OK, Message = "Successful", Data = result };

            return Ok(res);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetHealthProvider(string id)
        {
            if (_context.HealthProviders == null)
            {
                var res1 = new ResponseModel { ResponseCode = HttpStatusCode.NoContent, Message = "Error", Data = null };
                return Ok(res1);
            }

            ////
            var entity = await _context.HealthProviders.FindAsync(id);
            var result = _mapper.Map<HealthProvider, HealthProviderModel>(entity);

            if (entity == null)
            {
                var res2 = new ResponseModel { ResponseCode = HttpStatusCode.NotFound, Message = "Error", Data = null };
                return Ok(res2);
            }

            var res = new ResponseModel { ResponseCode = HttpStatusCode.OK, Message = "Successful", Data = result };

            return Ok(res);
        }

        [HttpPost("create")]
        public async Task<IActionResult> PostHealthProvider(HealthProviderCreate entity)
        {

            var ent = _mapper.Map<HealthProviderCreate, HealthProvider>(entity);

            ent.CreatedOn = DateTime.Now;
            ent.UpdatedOn = DateTime.Now;

            _context.HealthProviders.Add(ent);
            await _context.SaveChangesAsync();

            var res = new ResponseModel
            {
                ResponseCode = HttpStatusCode.Created,
                Message = "New Data Added Successfully",
                Data = ent
            };

            return Ok(res);
        }

        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutHealthProvider(string id, HealthProviderUpdate entity)
        //{
        //    if (id != entity.Id)
        //    {
        //        var res2 = new ResponseModel { ResponseCode = HttpStatusCode.BadRequest, Message = "Request Id not valid with teh payload Id", Data = null };
        //        return Ok(res2);
        //    }

        //    var ent = _mapper.Map<HealthProviderUpdate, HealthProvider>(entity);

        //    ent.UpdatedOn = DateTime.Now;

        //    _context.Entry(ent).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!HealthProviderExists(id))
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
        //public async Task<IActionResult> DeleteHealthProvider(string id)
        //{
        //    if (_context.HealthProviders == null)
        //    {
        //        //return NotFound();
        //        var res1 = new ResponseModel { ResponseCode = HttpStatusCode.NotFound, Message = "Error", Data = null };
        //        return Ok(res1);
        //    }
        //    var entity = await _context.HealthProviders.FindAsync(id);
        //    if (entity == null)
        //    {
        //        //return NotFound();
        //        var res2 = new ResponseModel { ResponseCode = HttpStatusCode.NotFound, Message = "Error", Data = null };
        //        return Ok(res2);
        //    }

        //    _context.HealthProviders.Remove(entity);
        //    await _context.SaveChangesAsync();

        //    var res = new ResponseModel
        //    {
        //        ResponseCode = HttpStatusCode.OK,
        //        Message = "Data Successfully Deleted",
        //        Data = null
        //    };

        //    return Ok(res);
        //}

        private bool HealthProviderExists(string id)
        {
            return (_context.HealthProviders?.Any(e => e.Id == id)).GetValueOrDefault();
        }

    }


}
