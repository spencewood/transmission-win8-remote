using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Transmission.Remote;
using Windows.Foundation;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Net.Http;

namespace Transmission.Runtime
{
    public sealed class Remote
    {
        private Client _client;

        public Remote(string host, int port, string rpcPath, bool useSsl, string username, string password)
        {
            _client = new Client(host, port, rpcPath, useSsl, username, password);
        }

        public Remote(string server, int port, string rpcPath, bool useSsl, string sessionId)
        {
            _client = new Client(server, port, rpcPath, useSsl: useSsl);
        }

        private async Task<String> GetSessionAsync()
        {
            return await _client.GetSession();
        }

        public IAsyncOperation<String> GetSession()
        {
            return GetSessionAsync().AsAsyncOperation();
        }

        private async Task<String> SetSessionAsync(string properties)
        {
            return await _client.SetSession(properties);
        }

        public IAsyncOperation<String> SetSession(string properties)
        {
            return SetSessionAsync(properties).AsAsyncOperation();
        }

        private async Task<String> SessionStatsAsync()
        {
            return await _client.SessionStats();
        }

        public IAsyncOperation<String> SessionStats()
        {
            return SessionStatsAsync().AsAsyncOperation();
        }

        private async Task<String> GetTorrentsAsync(List<String> fields)
        {
            return await _client.GetTorrents(fields);
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
            return await _client.GetFreeSpace();
        }

        public IAsyncOperation<String> GetFreeSpace()
        {
            //TODO: pass in directory
            return GetFreeSpaceAsync().AsAsyncOperation();
        }

        private async Task<String> StartTorrentsAsync(IEnumerable<int> ids)
        {
            return await _client.StartTorrents(ids.ToList());
        }

        public IAsyncOperation<String> StartTorrents(IEnumerable<int> ids)
        {
            return StartTorrentsAsync(ids).AsAsyncOperation();
        }

        private async Task<String> StopTorrentsAsync(IEnumerable<int> ids)
        {
            return await _client.StopTorrents(ids.ToList());
        }

        public IAsyncOperation<String> StopTorrents(IEnumerable<int> ids)
        {
            return StopTorrentsAsync(ids).AsAsyncOperation();
        }

        private async Task<String> VerifyTorrentsAsync(IEnumerable<int> ids)
        {
            return await _client.VerifyTorrents(ids.ToList());
        }

        public IAsyncOperation<String> VerifyTorrents(IEnumerable<int> ids)
        {
            return VerifyTorrentsAsync(ids).AsAsyncOperation();
        }

        private async Task<String> ReannounceTorrentsAsync(IEnumerable<int> ids)
        {
            return await _client.ReannounceTorrents(ids.ToList());
        }

        public IAsyncOperation<String> ReannounceTorrents(IEnumerable<int> ids)
        {
            return ReannounceTorrentsAsync(ids).AsAsyncOperation();
        }

        private async Task<String> RemoveTorrentsAsync(IEnumerable<int> ids, bool deleteLocal)
        {
            return await _client.RemoveTorrents(ids.ToList(), deleteLocal);
        }

        public IAsyncOperation<String> RemoveTorrents(IEnumerable<int> ids, bool deleteLocal)
        {
            return RemoveTorrentsAsync(ids, deleteLocal).AsAsyncOperation();
        }

        private async Task<String> MoveTorrentsToTopAsync(IEnumerable<int> ids)
        {
            return await _client.MoveTorrentsToTop(ids.ToList());
        }

        public IAsyncOperation<String> MoveTorrentsToTop(IEnumerable<int> ids)
        {
            return MoveTorrentsToTopAsync(ids).AsAsyncOperation();
        }

        private async Task<String> MoveTorrentsToBottomAsync(IEnumerable<int> ids)
        {
            return await _client.MoveTorrentsToBottom(ids.ToList());
        }

        public IAsyncOperation<String> MoveTorrentsToBottom(IEnumerable<int> ids)
        {
            return MoveTorrentsToBottomAsync(ids).AsAsyncOperation();
        }

        private async Task<String> MoveTorrentsUpAsync(IEnumerable<int> ids)
        {
            return await _client.MoveTorrentsUp(ids.ToList());
        }

        public IAsyncOperation<String> MoveTorrentsUp(IEnumerable<int> ids)
        {
            return MoveTorrentsUpAsync(ids).AsAsyncOperation();
        }

        private async Task<String> MoveTorrentsDownAsync(IEnumerable<int> ids)
        {
            return await _client.MoveTorrentsDown(ids.ToList());
        }

        public IAsyncOperation<String> MoveTorrentsDown(IEnumerable<int> ids)
        {
            return MoveTorrentsDownAsync(ids).AsAsyncOperation();
        }

        private async Task<String> AddTorrentAsync(byte[] metainfo)
        {
            return await _client.AddTorrent(metainfo);
        }

        public IAsyncOperation<String> AddTorrent([ReadOnlyArray()] byte[] metainfo)
        {
            return AddTorrentAsync(metainfo).AsAsyncOperation();
        }

        private async Task<String> TestPortAsync()
        {
            return await _client.TestPort();
        }

        public IAsyncOperation<String> TestPort()
        {
            return TestPortAsync().AsAsyncOperation();
        }
    }
}
