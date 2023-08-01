using Microsoft.AspNetCore.Mvc;
using System.IO.Compression;
using System.Text;

namespace HealthBloc.Api.Controllers
{
    public class CompressedController : Controller
    {
        public CompressedController()
        {
            
        }

        [HttpGet("CompressX")]
        public async Task<IActionResult> GetComplressPatientsX()
        {
            // https://www.infoworld.com/article/3660629/how-to-compress-and-decompress-strings-in-c-sharp.html
            var profileId = "f2b87548-2223-4165-ab47-74b11ece463d";

            string originalString = "To work with BenchmarkDotNet you must install the BenchmarkDotNet package. " +
                "You can do this either via the NuGet Package Manager inside the Visual Studio 2019 IDE, " +
                "or by executing the Install-Package BenchmarkDotNet command at the NuGet Package Manager Console";

            string originalString3 = "{\"name\":\"John\",\"age\":30,\"city\":\"New York\"}";

            //// Gzip
            byte[] dataToCompress = Encoding.UTF8.GetBytes(originalString);
            var compressedData = CompressWithGZip(dataToCompress);
            string compressedString = Convert.ToBase64String(compressedData);

            Console.WriteLine("Length of originalString string: " + originalString.Length);
            Console.WriteLine("Length of compressed string: " + compressedString.Length);

    


            ///// Brocolli
            //byte[] dataToCompress2 = Encoding.UTF8.GetBytes(originalString);
            //var compressedData2 = CompressWithBrotli(dataToCompress);

            //var decompressedData2 = DecompressWithBrotli(compressedData);

            //Console.WriteLine($"1. : {compressedData}");

            //// Console.WriteLine($"1. : {System.Text.Encoding.UTF8.GetString(compressedData)}");
            //// Console.WriteLine($"2. : {System.Text.Encoding.UTF8.GetString(compressedData2)}");

            return Ok(true);
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


        /// <summary>
        /// Gzip
        /// </summary>
        /// <param name="bytes"></param>
        /// <returns></returns>
        public async static Task<byte[]> CompressAsync(byte[] bytes)
        {
            using (var memoryStream = new MemoryStream())
            {
                using (var gzipStream = new GZipStream(memoryStream, CompressionLevel.Optimal))
                {
                    await gzipStream.WriteAsync(bytes, 0, bytes.Length);
                }
                return memoryStream.ToArray();
            }
        }

        public async static Task<byte[]> DecompressAsync(byte[] bytes)
        {
            using (var memoryStream = new MemoryStream(bytes))
            {
                using (var outputStream = new MemoryStream())
                {
                    using (var decompressStream = new GZipStream(memoryStream, CompressionMode.Decompress))
                    {
                        await decompressStream.CopyToAsync(outputStream);
                    }
                    return outputStream.ToArray();
                }
            }
        }


        /// <summary>
        /// Brotli
        /// </summary>
        /// <param name="bytes"></param>
        /// <returns></returns>
        public static async Task<byte[]> CompressBrotliAsync(byte[] bytes)
        {
            using (var memoryStream = new MemoryStream())
            {
                using (var brotliStream = new BrotliStream(memoryStream, CompressionLevel.Optimal))
                {
                    await brotliStream.WriteAsync(bytes, 0, bytes.Length);
                }
                return memoryStream.ToArray();
            }
        }

        public static async Task<byte[]> DecompressBrotliAsync(byte[] bytes)
        {
            using (var memoryStream = new MemoryStream(bytes))
            {
                using (var outputStream = new MemoryStream())
                {
                    using (var brotliStream = new BrotliStream(memoryStream, CompressionMode.Decompress))
                    {
                        await brotliStream.CopyToAsync(outputStream);
                    }
                    return outputStream.ToArray();
                }
            }
        }




    }
}
