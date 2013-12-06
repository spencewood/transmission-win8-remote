using System;
using System.Threading.Tasks;
using Windows.Foundation;

namespace Transmission.Runtime
{
    public sealed class Remote
    {
        private string _server;
        private string _username;
        private string _password;

        public Remote(object server)//string server, string username, string password)
        {
            //_server = server;
            //_username = username;
            //_password = password;
        }

        private async Task<String> GetSessionAsync()
        {
            var client = new Transmission.Remote.Client();
            
            return await client.GetSession();
        }

        public IAsyncOperation<String> GetSession()
        {
            return GetSessionAsync().AsAsyncOperation();
        }
    }
}
