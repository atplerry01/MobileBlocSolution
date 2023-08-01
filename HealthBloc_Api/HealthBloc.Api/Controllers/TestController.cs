using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HealthBloc.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : Controller
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        public TestController(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpGet("CompressX")]
        public async Task<IActionResult> GetComplressPatientsX()
        {
            var userId = _httpContextAccessor.HttpContext.User.Claims
                    .Where(x => x.Type == ClaimTypes.NameIdentifier).FirstOrDefault().Value;

            var patientId = _httpContextAccessor.HttpContext.User.Claims
                    .Where(x => x.Type == ClaimTypes.Name).FirstOrDefault().Value;

            var patientId2 = _httpContextAccessor.HttpContext.User.Claims
                    .Where(x => x.Type == ClaimTypes.Role).FirstOrDefault().Value;

            var patientId3 = _httpContextAccessor.HttpContext.User.Claims
                    .Where(x => x.Type == "ProviderId").FirstOrDefault().Value;

            return Ok(patientId3);
        }
    }
}
