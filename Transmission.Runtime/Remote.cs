using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Transmission.Remote;
using Windows.Foundation;

namespace Transmission.Runtime
{
    public sealed class Remote
    {
        private readonly string _server;
        private readonly string _username;
        private readonly string _password;

        public Remote(string server, string username, string password)
        {
            _server = server;
            _username = username;
            _password = password;

            //TODO: store session id
        }

        private Client GetClient()
        {
            return new Transmission.Remote.Client(_server, _username, _password);
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

        private async Task<String> GetTorrentsAsync(List<string> fields)
        {
            return await GetClient().GetTorrents(fields);
        }

        public IAsyncOperation<String> GetTorrentMetaData()
        {
            var fields = new List<string>{ 
                "addedDate",
                "name",
                "totalSize"
            };
            return GetTorrentsAsync(fields).AsAsyncOperation();
        }

        public IAsyncOperation<String> GetTorrentStats()
        {
            var fields = new List<string>{
                "error",
	            "errorString",
	            "eta",
	            "isFinished",
	            "isStalled",
	            "leftUntilDone",
	            "metadataPercentComplete",
	            "peersConnected",
	            "peersGettingFromUs",
	            "peersSendingToUs",
	            "percentDone",
	            "queuePosition",
	            "rateDownload",
	            "rateUpload",
	            "recheckProgress",
	            "seedRatioMode",
	            "seedRatioLimit",
	            "sizeWhenDone",
	            "status",
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
