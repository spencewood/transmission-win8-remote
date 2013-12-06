using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Windows.Web.Http;
using Windows.Web.Http.Headers;
using Windows.Web.Http.Filters;
using Windows.Storage.Streams;
using Windows.Security.Cryptography.Certificates;

namespace Transmission.Remote
{
    public class Client
    {
        private static String url = "";
        private static String user = "";
        private static String pass = "";

        public async Task<String> SendRequest(string method, string sessionId = "")
        {
            var filters = new HttpBaseProtocolFilter();
            filters.IgnorableServerCertificateErrors.Add(ChainValidationResult.Expired);
            filters.IgnorableServerCertificateErrors.Add(ChainValidationResult.InvalidName);
            filters.IgnorableServerCertificateErrors.Add(ChainValidationResult.Untrusted);
            
            var client = new HttpClient(filters);
            var request = new HttpRequestMessage(HttpMethod.Post, new Uri(url));
            var payload = new
            {
                method = method
            };
            request.Headers.Add("X-Transmission-Session-Id", sessionId);
            request.Headers.Authorization = new HttpCredentialsHeaderValue("Basic",
                Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(String.Format("{0}:{1}", user, pass))));
            request.Content = new HttpStringContent(JsonConvert.SerializeObject(payload), UnicodeEncoding.Utf8 , "application/json");
            
            var response = await client.SendRequestAsync(request);
            
            if (response.StatusCode == HttpStatusCode.Conflict)
            {
                var id = response.Headers.FirstOrDefault(x => x.Key == "X-Transmission-Session-Id");
                return await SendRequest(method, id.Value);
            }

            return await response.Content.ReadAsStringAsync();
        }

        public async Task<String> GetSession()
        {
            return await SendRequest("session-get");
        }

        //public void SessionStats()
        //{
        //    SendRequest("session-stats");
        //}
    }
}
