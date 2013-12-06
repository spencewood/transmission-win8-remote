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
        private readonly string _url = "";
        private readonly string _user = "";
        private readonly string _pass = "";

        public Client(string url, string user, string pass){
            _url = url;
            _user = user;
            _pass = pass;
        }

        public async Task<String> SendRequest(string method, object data, string sessionId = "")
        {
            var filters = new HttpBaseProtocolFilter();
            filters.IgnorableServerCertificateErrors.Add(ChainValidationResult.Expired);
            filters.IgnorableServerCertificateErrors.Add(ChainValidationResult.InvalidName);
            filters.IgnorableServerCertificateErrors.Add(ChainValidationResult.Untrusted);

            var client = new HttpClient(filters);
            var request = new HttpRequestMessage(HttpMethod.Post, new Uri(_url));

            object payload = null;

            if (data != null)
            {
                payload = new
                {
                    method = method,
                    arguments = data
                };
            }
            else
            {
                payload = new
                {
                    method = method
                };
            }

            request.Headers.Add("X-Transmission-Session-Id", sessionId);
            request.Headers.Authorization = new HttpCredentialsHeaderValue("Basic",
                Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(String.Format("{0}:{1}", _user, _pass))));
            request.Content = new HttpStringContent(JsonConvert.SerializeObject(payload), UnicodeEncoding.Utf8, "application/json");

            var response = await client.SendRequestAsync(request);

            if (response.StatusCode == HttpStatusCode.Conflict)
            {
                var id = response.Headers.FirstOrDefault(x => x.Key == "X-Transmission-Session-Id");
                return await SendRequest(method, data, id.Value);
            }

            return await response.Content.ReadAsStringAsync();
        }

        public async Task<String> GetSession()
        {
            return await SendRequest("session-get", null);
        }

        public async Task<String> SessionStats()
        {
            return await SendRequest("session-stats", null);
        }

        public async Task<String> GetTorrents()
        {
            return await SendRequest("torrent-get", new
            {
                fields = new[] { "addedDate", "name", "totalSize" }
            });
        }
    }
}
