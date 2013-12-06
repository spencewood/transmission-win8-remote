using System;
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

        private async Task<String> GetTorrentsAsync()
        {
            return await GetClient().GetTorrents();
        }

        public IAsyncOperation<String> GetTorrents()
        {
            //TODO: pass params like ids and fields
            return GetTorrentsAsync().AsAsyncOperation();
        }
    }
}
