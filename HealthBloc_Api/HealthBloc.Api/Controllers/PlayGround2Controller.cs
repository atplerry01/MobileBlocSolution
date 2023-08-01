using AutoMapper;
using HealthBloc.Api.Models;
using HealthBloc.Api.VModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.IO.Compression;
using System.Net;
using System.Text;

namespace HealthBloc.Api.Controllers
{
    public class PlayGround2Controller : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public PlayGround2Controller(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("CompressX")]
        public async Task<IActionResult> GetComplressPatientsX()
        {

            var profileId = "f2b87548-2223-4165-ab47-74b11ece463d";
  
            string originalString2 = "To work with BenchmarkDotNet you must install the BenchmarkDotNet package. " +
                "You can do this either via the NuGet Package Manager inside the Visual Studio 2019 IDE, " +
                "or by executing the Install-Package BenchmarkDotNet command at the NuGet Package Manager Console";

            string originalString = "{\"name\":\"John\",\"age\":30,\"city\":\"New York\"}";

            byte[] dataToCompress = Encoding.UTF8.GetBytes(originalString);
            var compressedData = CompressWithGZip(dataToCompress);
            var decompressedData = DecompressWithGZip(compressedData);

            Console.WriteLine($"aaaaaa: {System.Text.Encoding.UTF8.GetString(decompressedData)}");



            return Ok();
        }


        private static byte[] CompressWithGZip(byte[] inputData)
        {
            using (MemoryStream outputStream = new MemoryStream())
            {
                using (GZipStream gzipStream = new GZipStream(outputStream, CompressionLevel.Optimal))
                {
                    gzipStream.Write(inputData, 0, inputData.Length);
                }

                return outputStream.ToArray();
            }
        }

        private static byte[] DecompressWithGZip(byte[] compressedData)
        {
            using (MemoryStream inputStream = new MemoryStream(compressedData))
            using (GZipStream gzipStream = new GZipStream(inputStream, CompressionMode.Decompress))
            using (MemoryStream outputStream = new MemoryStream())
            {
                gzipStream.CopyTo(outputStream);
                return outputStream.ToArray();
            }
        }

        private static byte[] CompressWithBrotli(byte[] inputData)
        {
            using (MemoryStream outputStream = new MemoryStream())
            {
                using (BrotliStream brotliStream = new BrotliStream(outputStream, CompressionMode.Compress))
                {
                    brotliStream.Write(inputData, 0, inputData.Length);
                }

                return outputStream.ToArray();
            }
        }

        private static byte[] DecompressWithBrotli(byte[] compressedData)
        {
            using (MemoryStream inputStream = new MemoryStream(compressedData))
            using (BrotliStream brotliStream = new BrotliStream(inputStream, CompressionMode.Decompress))
            using (MemoryStream outputStream = new MemoryStream())
            {
                brotliStream.CopyTo(outputStream);
                return outputStream.ToArray();
            }
        }




    }
}
