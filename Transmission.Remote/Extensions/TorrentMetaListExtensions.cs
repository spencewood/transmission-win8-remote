using Transmission.Remote.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Transmission.Remote.Models;

namespace Transmission.Remote.Extensions
{
    public static class TorrentMetaListExtensions
    {
        public static IEnumerable<TorrentMeta> FilterByStatus(this List<TorrentMeta> torrents, String status)
        {
            switch (status)
            {
                case "downloading":
                    return torrents.Where(x => x.status == TorrentStatus.Download);
                case "active":
                    return torrents.Where(x => x.status == TorrentStatus.Download);
                case "inactive":
                    return torrents.Where(x => x.status != TorrentStatus.Download);
                case "stopped":
                    return torrents.Where(x => x.status == TorrentStatus.Stopped);
                case "error":
                    return torrents.Where(x => x.error);
            }

            return torrents;
        }
    }
}
