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
using Transmission.Remote.Transmission;

namespace Transmission.Remote
{
    public class Client
    {
        private TransmissionClient _client;

        public Client(string url, int port, string rpcPath, bool useSsl = false, string user = "", string pass = "")
        {
            _client = new TransmissionClient(url, port, rpcPath, useSsl, user, pass);
        }

        public async Task<String> SendRequest(string method, object data)
        {
            var response = await _client.MakeRequest(method, data);

            if (response.StatusCode != HttpStatusCode.Ok)
            {
                throw new Exception(response.ReasonPhrase);
            }

            return await response.Content.ReadAsStringAsync();
        }

        public async Task<String> GetSession()
        {
            return await SendRequest("session-get", null);
        }

        public async Task<String> SetSession(string properties)
        {
            return await SendRequest("session-set", JsonConvert.DeserializeObject(properties));
        }

        public async Task<String> SessionStats()
        {
            return await SendRequest("session-stats", null);
        }

        public async Task<String> GetTorrents(List<String> fields)
        {
            return await GetTorrents(fields, null);
        }

        public async Task<String> GetTorrents(List<String> fields, int? id)
        {
            var args = new JObject();

            if (id != null)
            {
                args["id"] = id;
            }
            args["fields"] = new JArray(fields);

            return await SendRequest("torrent-get", args);
        }

        public async Task<String> GetFreeSpace()
        {
            return await SendRequest("free-space", new
            {
                path = "/"
            });
        }

        public async Task<String> StartTorrents(List<int> ids, bool noqueue = false)
        {
            var method = noqueue ? "torrent-start-now" : "torrent-start";
            return await SendRequest(method, new
            {
                ids = ids
            });
        }

        public async Task<String> StopTorrents(List<int> ids)
        {
            return await SendRequest("torrent-stop", new
            {
                ids = ids
            });
        }

        public async Task<String> VerifyTorrents(List<int> ids)
        {
            return await SendRequest("torrent-verify", new
            {
                ids = ids
            });
        }

        public async Task<String> ReannounceTorrents(List<int> ids)
        {
            return await SendRequest("torrent-reannounce", new
            {
                ids = ids
            });
        }

        public async Task<String> RemoveTorrents(List<int> ids, bool deleteLocal = false)
        {
            var args = new JObject();

            args["ids"] = new JArray(ids);
            args["delete-local-data"] = deleteLocal;

            return await SendRequest("torrent-remove", args);
        }


        public async Task<String> MoveTorrentsToTop(List<int> ids)
        {
            return await SendRequest("queue-move-top", new
            {
                ids = ids
            });
        }

        public async Task<String> MoveTorrentsToBottom(List<int> ids)
        {
            return await SendRequest("queue-move-bottom", new
            {
                ids = ids
            });
        }

        public async Task<String> MoveTorrentsUp(List<int> ids)
        {
            return await SendRequest("queue-move-up", new
            {
                ids = ids
            });
        }
        public async Task<String> MoveTorrentsDown(List<int> ids)
        {
            return await SendRequest("queue-move-down", new
            {
                ids = ids
            });
        }

        public async Task<String> AddTorrent(Byte[] metainfo)
        {
            var args = new JObject();

            args["metainfo"] = Convert.ToBase64String(metainfo);
            return await SendRequest("torrent-add", args);
        }

        public async Task<String> AddTorrent(String url)
        {
            var args = new JObject();
            args["filename"] = url;

            return await SendRequest("torrent-add", args);
            /*
               "download-dir"       | string      path to download the torrent to
               "filename"           | string      filename or URL of the .torrent file
               "metainfo"           | string      base64-encoded .torrent content
               "paused"             | boolean     if true, don't start the torrent
               "peer-limit"         | number      maximum number of peers
               "bandwidthPriority"  | number      torrent's bandwidth tr_priority_t 
               "files-wanted"       | array       indices of file(s) to download
               "files-unwanted"     | array       indices of file(s) to not download
               "priority-high"      | array       indices of high-priority file(s)
               "priority-low"       | array       indices of low-priority file(s)
               "priority-normal"    | array       indices of normal-priority file(s)
             */
        }

        public async Task<String> TestPort(){
            return await SendRequest("port-test", null);
        }
    }
}
