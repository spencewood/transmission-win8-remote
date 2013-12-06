using System;
using System.Threading.Tasks;
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
        }

        private async Task<String> GetSessionAsync()
        {
            var client = new Transmission.Remote.Client(_server, _username, _password);
            
            return await client.GetSession();
        }

        public IAsyncOperation<String> GetSession()
        {
            return GetSessionAsync().AsAsyncOperation();
        }
    }
}
