using AutoMapper;
using Azure;
using HealthBloc.Api.Common;
using HealthBloc.Api.Models;
using HealthBloc.Api.VModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace HealthBloc.Api.Controllers
{
    public class AuthController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public AuthController(ApplicationDbContext context, IMapper mapper, IConfiguration configuration)
        {
            _configuration = configuration;
            _context = context;
            _mapper = mapper;
        }

        /// <summary>
        /// Registration Session
        /// </summary>
        /// <param name="password"></param>
        /// <param name="passwordHash"></param>
        /// <param name="passwordSalt"></param>

        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync([FromBody] UserProfileCreate entity)
        {
         
            if (await UserExists(entity.Username))
            {
                return Ok(new ResponseModel { ResponseCode = HttpStatusCode.BadRequest, Message = "User already Exits", Data = null });
            }

            CreatePasswordHash(entity.Password, out byte[] passwordHash, out byte[] passwordSalt);

            var userMod = _mapper.Map<UserProfileCreate, User>(entity);

            userMod.PasswordHash = passwordHash;
            userMod.PasswordSalt = passwordSalt;

            userMod.Id = Guid.NewGuid().ToString();

            _context.Users.Add(userMod);

            // Create the UserProfile
            var userProfileMod = _mapper.Map<UserProfileCreate, UserProfile>(entity);
            
            userProfileMod.Id = Guid.NewGuid().ToString();
            userProfileMod.UserId = userMod.Id;

            _context.UserProfiles.Add(userProfileMod);

            var res1 = _mapper.Map<UserProfile, UserProfileModel>(userProfileMod);

            // Uow
            await _context.SaveChangesAsync();

            return Ok(new ResponseModel { ResponseCode = HttpStatusCode.OK, Message = "Successful", Data = res1 });
        }



        public async Task<bool> UserExists(string username)
        {
            if (await _context.Users.AnyAsync(u => u.Username.ToLower() == username.ToLower()))
            {
                return true;
            }
            return false;
        }
        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash);
            }
        }




        /// <summary>
        /// // Login Session
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>

        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync([FromBody] LoginModel entity)
        {
            var ip = ipAddress();
            var user = await _context.Users.Where(x => x.Username == entity.Username).FirstOrDefaultAsync();
            var userModel = _mapper.Map<User, UserModel>(user);

            var authResponse = new AuthResponse();

            if (user == null)
            {
                return Ok(new ResponseModel { ResponseCode = HttpStatusCode.BadRequest, Message = "Unauthrized, User not profiled", Data = false });
            }
            else if (!VerifyPasswordHash(entity.Password, user.PasswordHash, user.PasswordSalt))
            {
                return Ok(new ResponseModel { ResponseCode = HttpStatusCode.BadRequest, Message = "Wrong Password", Data = false });
            } else
            {
                var userProfile = await _context.UserProfiles.Where(x => x.UserId == user.Id).FirstOrDefaultAsync();

                string providerId = "";
                string patientId = "";
                string staffId = "";

                if (userProfile != null && userProfile.IsDoctor)
                {
                    var staff = await _context.HealthProviderStaffs.Where(x => x.UserProfileId == userProfile.Id).FirstOrDefaultAsync();

                    if (staff != null)
                    {
                        providerId = staff.HealthProviderId;
                        staffId = staff.Id;

                    } else
                    {
                        return Ok(new ResponseModel { ResponseCode = HttpStatusCode.BadRequest, Message = "Doctor Profile Not Assign to a HealthProvider", Data = false });
                    }

                } else
                {
                    var userProfile2 = await _context.UserProfiles.Where(x => x.UserId == user.Id).FirstOrDefaultAsync();

                    var patient = await _context.Patients.Where(x => x.UserProfileId == userProfile2.Id).FirstOrDefaultAsync();
                    
                    patientId =patient == null ? "" :  patient.Id;
                }

                var token = generateJwtToken(userProfile, providerId, patientId, staffId);
                var refreshToken = generateRefreshToken(ip);

                var profileModel = _mapper.Map<UserProfile, UserProfileModel>(userProfile);
                
                authResponse.UserDetails = profileModel;
                authResponse.JwtToken = token.ToString();
                authResponse.RefreshToken = refreshToken.Token;
            }
            

            return Ok(new ResponseModel { ResponseCode = HttpStatusCode.OK, Message = "Successful", Data = authResponse });
        }


        private string generateJwtToken(UserProfile profile, string providerId, string patientId, string staffId)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, profile.Id.ToString()),
                new Claim(ClaimTypes.Name, profile.Email),
                new Claim(ClaimTypes.Role, profile.IsDoctor == true ? "Doctor" : "Patient"),
                new Claim("ProviderId", providerId),
                new Claim("PatientId", patientId),
                new Claim("StaffId", staffId)
            };

            var appSettingsToken = _configuration.GetSection("AppSettings:Token").Value;
            if (appSettingsToken is null)
                throw new Exception("AppSettings Token is null!");

            SymmetricSecurityKey key = new SymmetricSecurityKey(System.Text.Encoding.UTF8
                .GetBytes(appSettingsToken));

            SigningCredentials creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
        private RefreshToken generateRefreshToken(string ipAddress)
        {
            using (var rngCryptoServiceProvider = new RNGCryptoServiceProvider())
            {
                var randomBytes = new byte[64];
                rngCryptoServiceProvider.GetBytes(randomBytes);
                return new RefreshToken
                {
                    Token = Convert.ToBase64String(randomBytes),
                    Expires = DateTime.UtcNow.AddDays(70), // TODO
                    Created = DateTime.UtcNow,
                    CreatedByIp = ipAddress
                };
            }
        }
        private string ipAddress()
        {
            if (Request.Headers.ContainsKey("X-Forwarded-For"))
                return Request.Headers["X-Forwarded-For"];
            else
                return HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
        }


    }
}
