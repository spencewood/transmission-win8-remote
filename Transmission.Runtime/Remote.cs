using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Transmission.Remote;
using Transmission.Remote.Models;
using Transmission.Remote.Extensions;
using Windows.Foundation;
using System.Linq;

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

        //private async Task<String> GetSessionAsync()
        //{
        //    return await GetClient().GetSession();
        //}

        //public IAsyncOperation<String> GetSession()
        //{
        //    return GetSessionAsync().AsAsyncOperation();
        //}

        //private async Task<String> SessionStatsAsync()
        //{
        //    return await GetClient().SessionStats();
        //}

        //public IAsyncOperation<String> SessionStats()
        //{
        //    return SessionStatsAsync().AsAsyncOperation();
        //}

        private async Task<List<TorrentMeta>> GetTorrentsAsync(List<String> fields)
        {
            var torrents = await GetClient().GetTorrents(fields);
            return torrents;
        }

        public IAsyncOperation<String> GetTorrents(String status)
        {
            var fields = new List<String>{ 
                "name",
                "queuePosition",
                "totalSize",
                "percentDone",
                "rateDownload",
	            "rateUpload",
                "status",
                "error"
            };

            return GetTorrentsAsync(fields)
                .ContinueWith(x => x.Result.FilterByStatus(status))
                .ContinueWith(x => JsonConvert.SerializeObject(x.Result))
                .AsAsyncOperation();
        }

        //public IAsyncOperation<String> GetTorrentStats()
        //{
        //    var fields = new List<String>{
        //        "addedDate",
        //        "errorstring",
        //        "eta",
        //        "isStalled",
        //        "leftUntilDone",
        //        "metadataPercentComplete",
        //        "peersConnected",
        //        "peersGettingFromUs",
        //        "peersSendingToUs",
        //        "recheckProgress",
        //        "seedRatioMode",
        //        "seedRatioLimit",
        //        "isFinished",
        //        "sizeWhenDone",
        //        "trackers",
        //        "downloadDir",
        //        "uploadedEver",
        //        "uploadRatio",
        //        "webseedsSendingToUs"
        //    };
        //    return GetTorrentsAsync(fields).AsAsyncOperation();
        //}

        //private async Task<String> GetFreeSpaceAsync()
        //{
        //    return await GetClient().GetFreeSpace();
        //}

        //public IAsyncOperation<String> GetFreeSpace()
        //{
        //    //TODO: pass in directory
        //    return GetFreeSpaceAsync().AsAsyncOperation();
        //}
    }
}
