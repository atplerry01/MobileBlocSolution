using System.Net;

namespace HealthBloc.Api.VModel
{
    public class ResponseModel
    {
        public HttpStatusCode ResponseCode { get; set; }
        public string Message { get; set; }
        public object Data { get; set; }
    }

}
