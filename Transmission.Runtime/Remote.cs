using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Transmission.Remote;
using Windows.Foundation;
using System.Linq;

namespace Transmission.Runtime
{
    public sealed class Remote
    {
        private readonly string _server;
        private readonly string _username;
        private readonly string _password;
        private string _sessionId;

        public Remote(string server, string username, string password)
        {
            _server = server;
            _username = username;
            _password = password;
        }

        private Client GetClient()
        {
            if(_sessionId != null){
                return new Transmission.Remote.Client(_server, _username, _password, _sessionId);
            }
            return new Transmission.Remote.Client(_server, _username, _password);
        }

        public void SetSession(string sessionId)
        {
            _sessionId = sessionId;
        }

        private async Task<String> StoreSessionIdAsync()
        {
            var client = GetClient();
            await client.GetFreeSpace();
            _sessionId = client._sessionId;
            return client._sessionId;
        }

        public IAsyncOperation<String> StoreSessionId()
        {
            return StoreSessionIdAsync().AsAsyncOperation();
        }

        private async Task<String> GetSessionAsync()
        {
            return await GetClient().GetSession();
        }

        public IAsyncOperation<String> GetSession()
        {
            return GetSessionAsync().AsAsyncOperation();
        }

        private async Task<String> SessionStatsAsync()
        {
            return await GetClient().SessionStats();
        }

        public IAsyncOperation<String> SessionStats()
        {
            return SessionStatsAsync().AsAsyncOperation();
        }

        private async Task<String> GetTorrentsAsync(List<String> fields)
        {
            return await GetClient().GetTorrents(fields);
        }

        public IAsyncOperation<String> GetTorrents()
        {
            var fields = new List<String>{
                "id",
                "name",
                "queuePosition",
                "totalSize",
                "percentDone",
                "rateDownload",
	            "rateUpload",
                "status",
                "error"
            };

            return GetTorrentsAsync(fields).AsAsyncOperation();
        }

        public IAsyncOperation<String> GetTorrentStats()
        {
            var fields = new List<String>{
                "addedDate",
                "errorstring",
                "eta",
                "isStalled",
                "leftUntilDone",
                "metadataPercentComplete",
                "peersConnected",
                "peersGettingFromUs",
                "peersSendingToUs",
                "recheckProgress",
                "seedRatioMode",
                "seedRatioLimit",
                "isFinished",
                "sizeWhenDone",
                "trackers",
                "downloadDir",
                "uploadedEver",
                "uploadRatio",
                "webseedsSendingToUs"
            };
            return GetTorrentsAsync(fields).AsAsyncOperation();
        }

        private async Task<String> GetFreeSpaceAsync()
        {
            return await GetClient().GetFreeSpace();
        }

        public IAsyncOperation<String> GetFreeSpace()
        {
            //TODO: pass in directory
            return GetFreeSpaceAsync().AsAsyncOperation();
        }
    }
}
