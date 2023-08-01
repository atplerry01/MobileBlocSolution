using AutoMapper;
using HealthBloc.Api.Models;
using HealthBloc.Api.VModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Drawing;
using System.IO.Compression;
using System.Net;
using System.Text;
using System.Text.Json;
using static System.Net.Mime.MediaTypeNames;

namespace HealthBloc.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlayGroundsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public PlayGroundsController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }


        [HttpGet]
        public async Task<IActionResult> GetPatients()
        {
            if (_context.Patients == null)
            {
                var res1 = new ResponseModel
                {
                    ResponseCode = HttpStatusCode.NoContent,
                    Message = "Error",
                    Data = null
                };

                return Ok(res1);
            }

            var result = await _context.Patients.ToListAsync();

            // Deserialize JSON data into a list of points
            List<Point> coords = GenerateLatLongs(1000);

            // Original json data
            // string jsonData = JsonSerializer.Serialize(coords);
            string jsonData = "{\"name\":\"John\",\"age\":30,\"city\":\"New York\"}";

            // Compress JSON data using GZip
            byte[] compressedJsonData = CompressJsonData(jsonData);

            // Simplify the list of points using Douglas-Peucker algorithm
            List<Point> simplifiedPoints = DouglasPeuckerSimplification(coords, 0, coords.Count - 1, 45.0);
            string simplifiedJsonData = JsonSerializer.Serialize(simplifiedPoints);

            // Compressed peucker
            byte[] compressedPeucker = CompressJsonData(simplifiedJsonData);

            Console.WriteLine($"Original: {jsonData.Length} Bytes");
            Console.WriteLine($"Peucker: {simplifiedJsonData.Length} Bytes");
            Console.WriteLine($"Compressed (GZip): {compressedJsonData.Length} Bytes");
            Console.WriteLine($"Compressed Peucker: {compressedPeucker.Length} Bytes");

            return Ok(true);
        }


        [HttpGet("Compress")]
        public async Task<IActionResult> GetComplressPatients()
        {
            // Example usage
            string originalJson = "{\"name\":\"John\",\"age\":30,\"city\":\"New York\"}";

            string compressedJson = Compress(originalJson);
            Console.WriteLine($"Compressed JSON: {Encoding.UTF8.GetByteCount(compressedJson)}: {compressedJson}");

            string decompressedJson = Decompress(compressedJson);
            Console.WriteLine($"Decompressed JSON {Encoding.UTF8.GetByteCount(decompressedJson)}: {decompressedJson}");

            return Ok();
        }

        public static string Compress(string json)
        {
            byte[] jsonBytes = Encoding.UTF8.GetBytes(json);

            using (MemoryStream memoryStream = new MemoryStream())
            {
                using (GZipStream gzipStream = new GZipStream(memoryStream, CompressionMode.Compress, true))
                {
                    gzipStream.Write(jsonBytes, 0, jsonBytes.Length);
                }

                byte[] compressedBytes = memoryStream.ToArray();
                return Convert.ToBase64String(compressedBytes);
            }
        }

        public static string Decompress(string compressedJson)
        {
            byte[] compressedBytes = Convert.FromBase64String(compressedJson);

            using (MemoryStream memoryStream = new MemoryStream(compressedBytes))
            {
                using (GZipStream gzipStream = new GZipStream(memoryStream, CompressionMode.Decompress))
                {
                    using (StreamReader reader = new StreamReader(gzipStream))
                    {
                        string decompressedJson = reader.ReadToEnd();
                        return decompressedJson;
                    }
                }
            }
        }



        /// <summary>
        /// /////////
        /// </summary>
        /// <param name="jsonData"></param>
        /// <returns></returns>
        private static byte[] CompressJsonData(string jsonData)
        {
            byte[] byteArray = Encoding.UTF8.GetBytes(jsonData);

            using (var memoryStream = new MemoryStream())
            {
                using (var gzipStream = new GZipStream(memoryStream, CompressionLevel.Optimal))
                {
                    gzipStream.Write(byteArray, 0, byteArray.Length);
                }
                return memoryStream.ToArray();
            }
        }

        private static List<Point> DouglasPeuckerSimplification(List<Point> points, int firstIndex, int lastIndex, double epsilon)
        {
            double dmax = 0.0;
            int index = 0;

            for (int i = firstIndex + 1; i < lastIndex; i++)
            {
                double d = PerpendicularDistance(points[i], points[firstIndex], points[lastIndex]);
                if (d > dmax)
                {
                    index = i;
                    dmax = d;
                }
            }

            List<Point> result = new List<Point>();

            if (dmax > epsilon)
            {
                List<Point> recResults1 = DouglasPeuckerSimplification(points, firstIndex, index, epsilon);
                List<Point> recResults2 = DouglasPeuckerSimplification(points, index, lastIndex, epsilon);

                result.AddRange(recResults1);
                result.RemoveAt(result.Count - 1);
                result.AddRange(recResults2);
            }
            else
            {
                result.Add(points[firstIndex]);
                result.Add(points[lastIndex]);
            }

            return result;
        }

        private static double PerpendicularDistance(Point point, Point start, Point end)
        {
            double area = Math.Abs(0.5 * (start.X * end.Y + end.X * point.Y + point.X * start.Y - end.X * start.Y - point.X * end.Y - start.X * point.Y));
            double bottom = Math.Sqrt(Math.Pow(end.Y - start.Y, 2) + Math.Pow(end.X - start.X, 2));
            double height = area / bottom * 2;

            return height;
        }

        private static List<Point> GenerateLatLongs(int count)
        {
            List<Point> latLongs = new List<Point>();
            Random random = new Random();

            for (int i = 0; i < count; i++)
            {
                double latitude = random.NextDouble() * 180 - 90;
                double longitude = random.NextDouble() * 360 - 180;

                latLongs.Add(new Point() { X = latitude, Y = longitude });
            }

            return latLongs;
        }

    }

    internal class Point
    {
        public double X { get; set; }
        public double Y { get; set; }
    }
}
