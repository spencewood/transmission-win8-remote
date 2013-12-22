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
using Newtonsoft.Json.Linq;
using Windows.Foundation;

namespace Transmission.Remote
{
    internal class TransmissionClient
    {
        private readonly String _host = String.Empty;
        private readonly int _port = 0;
        private readonly String _user = String.Empty;
        private readonly String _pass = String.Empty;
        private readonly String _rpcPath = String.Empty;
        private readonly bool _useSsl = false;
        private bool _requiresAuth
        {
            get
            {
                return !(_user == String.Empty && _pass == String.Empty);
            }
        }
        private String _server
        {
            get
            {
                return String.Format("{0}://{1}:{2}{3}", _useSsl ? "https" : "http", _host, _port, _rpcPath);
            }
        }
        public string _sessionId { get; private set; }

        public TransmissionClient(string host, int port, string rpcPath, bool useSsl, string user, string pass, string sessionId = "")
        {
            _host = host;
            _port = port;
            _rpcPath = rpcPath;
            _user = user;
            _pass = pass;
            _useSsl = useSsl;
            _sessionId = sessionId;
        }

        public TransmissionClient(string host, bool useSsl, string sessionId = "")
        {
            _host = host;
            _useSsl = useSsl;
            _sessionId = sessionId;
        }

        private HttpClient GetClient(bool useSsl)
        {
            if (useSsl)
            {
                var filters = new HttpBaseProtocolFilter();
                filters.IgnorableServerCertificateErrors.Add(ChainValidationResult.Expired);
                filters.IgnorableServerCertificateErrors.Add(ChainValidationResult.InvalidName);
                filters.IgnorableServerCertificateErrors.Add(ChainValidationResult.Untrusted);
                return new HttpClient(filters);
            }
            return new HttpClient();
        }

        private object GetPayload(string method, object data)
        {
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

            return payload;
        }

        private HttpRequestMessage GetRequest(object payload)
        {
            var request = new HttpRequestMessage(HttpMethod.Post, new Uri(_server));

            request.Headers.Add("X-Transmission-Session-Id", _sessionId);
            if (_requiresAuth)
            {
                request.Headers.Authorization = new HttpCredentialsHeaderValue("Basic",
                Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(String.Format("{0}:{1}", _user, _pass))));
            }
            request.Content = new HttpStringContent(JsonConvert.SerializeObject(payload), UnicodeEncoding.Utf8, "application/json");

            return request;
        }

        public async Task<HttpResponseMessage> MakeRequest(string method, object data)
        {
            var client = GetClient(_useSsl);
            var payload = GetPayload(method, data);
            var request = GetRequest(payload);

            var response = await client.SendRequestAsync(request);
            if (response.StatusCode == HttpStatusCode.Conflict)
            {
                var id = response.Headers.FirstOrDefault(x => x.Key == "X-Transmission-Session-Id");
                _sessionId = id.Value;
                return await MakeRequest(method, data);
            }

            return response;
        }
    }
}
