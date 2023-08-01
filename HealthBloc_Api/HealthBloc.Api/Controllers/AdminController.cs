using HealthBloc.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace HealthBloc.Api.Controllers
{
    public class AdminController : ControllerBase
    {

        private readonly ApplicationDbContext _context;
        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }


    }
}
