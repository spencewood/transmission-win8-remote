using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Transmission.Remote.Enums
{
    public enum TorrentStatus
    {
        Stopped,
        CheckWait,
        Check,
        DownloadWait,
        Download,
        QueueSeed,
        Seed
    }
}
