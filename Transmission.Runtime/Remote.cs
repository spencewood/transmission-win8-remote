using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Transmission.Remote;
using Windows.Foundation;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;

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
                "error",
                "uploadRatio",
                "sizeWhenDone",
                "webseedsSendingToUs",
                "peersConnected",
                "peersGettingFromUs",
                "peersSendingToUs",
                "isFinished",
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
                "recheckProgress",
                "seedRatioMode",
                "seedRatioLimit",
                "trackers",
                "downloadDir",
                "uploadedEver"
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

        private async Task<String> StartTorrentsAsync(IEnumerable<int> ids)
        {
            return await GetClient().StartTorrents(ids.ToList());
        }

        public IAsyncOperation<String> StartTorrents(IEnumerable<int> ids)
        {
            return StartTorrentsAsync(ids).AsAsyncOperation();
        }

        private async Task<String> StopTorrentsAsync(IEnumerable<int> ids)
        {
            return await GetClient().StopTorrents(ids.ToList());
        }

        public IAsyncOperation<String> StopTorrents(IEnumerable<int> ids)
        {
            return StopTorrentsAsync(ids).AsAsyncOperation();
        }

        private async Task<String> VerifyTorrentsAsync(IEnumerable<int> ids)
        {
            return await GetClient().VerifyTorrents(ids.ToList());
        }

        public IAsyncOperation<String> VerifyTorrents(IEnumerable<int> ids)
        {
            return VerifyTorrentsAsync(ids).AsAsyncOperation();
        }

        private async Task<String> ReannounceTorrentsAsync(IEnumerable<int> ids)
        {
            return await GetClient().ReannounceTorrents(ids.ToList());
        }

        public IAsyncOperation<String> ReannounceTorrents(IEnumerable<int> ids)
        {
            return ReannounceTorrentsAsync(ids).AsAsyncOperation();
        }

        private async Task<String> RemoveTorrentsAsync(IEnumerable<int> ids, bool deleteLocal)
        {
            return await GetClient().RemoveTorrents(ids.ToList(), deleteLocal);
        }

        public IAsyncOperation<String> RemoveTorrents(IEnumerable<int> ids, bool deleteLocal)
        {
            return RemoveTorrentsAsync(ids, deleteLocal).AsAsyncOperation();
        }

        private async Task<String> MoveTorrentsToTopAsync(IEnumerable<int> ids)
        {
            return await GetClient().MoveTorrentsToTop(ids.ToList());
        }

        public IAsyncOperation<String> MoveTorrentsToTop(IEnumerable<int> ids)
        {
            return MoveTorrentsToTopAsync(ids).AsAsyncOperation();
        }

        private async Task<String> MoveTorrentsToBottomAsync(IEnumerable<int> ids)
        {
            return await GetClient().MoveTorrentsToBottom(ids.ToList());
        }

        public IAsyncOperation<String> MoveTorrentsToBottom(IEnumerable<int> ids)
        {
            return MoveTorrentsToBottomAsync(ids).AsAsyncOperation();
        }

        private async Task<String> MoveTorrentsUpAsync(IEnumerable<int> ids)
        {
            return await GetClient().MoveTorrentsUp(ids.ToList());
        }

        public IAsyncOperation<String> MoveTorrentsUp(IEnumerable<int> ids)
        {
            return MoveTorrentsUpAsync(ids).AsAsyncOperation();
        }

        private async Task<String> MoveTorrentsDownAsync(IEnumerable<int> ids)
        {
            return await GetClient().MoveTorrentsDown(ids.ToList());
        }

        public IAsyncOperation<String> MoveTorrentsDown(IEnumerable<int> ids)
        {
            return MoveTorrentsDownAsync(ids).AsAsyncOperation();
        }

        private async Task<String> AddTorrentAsync(byte[] metainfo)
        {
            return await GetClient().AddTorrent(metainfo);
        }

        public IAsyncOperation<String> AddTorrent([ReadOnlyArray()] byte[] metainfo)
        {
            return AddTorrentAsync(metainfo).AsAsyncOperation();
        }
    }
}
