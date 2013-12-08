using Transmission.Remote.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Transmission.Remote.Models
{
    public sealed class TorrentMeta
    {
        public string name { get; set; }
        public string queuePosition { get; set; }
        public Int64 totalSize { get; set; }
        public float percentDone { get; set; }
        public int rateDownload { get; set; }
        public int rateUpload { get; set; }
        public TorrentStatus status { get; set; }
        public bool error { get; set; }
    }
}
