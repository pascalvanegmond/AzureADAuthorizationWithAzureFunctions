using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;
using User.Models;

namespace User
{
    public static class Function1
    {
        [FunctionName("Function1")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            log.Info("C# HTTP trigger function processed a request.");

            // parse query parameter
            string name = req.GetQueryNameValuePairs()
                .FirstOrDefault(q => string.Compare(q.Key, "name", true) == 0)
                .Value;

            if (name == null)
            {
                // Get request body
                dynamic data = await req.Content.ReadAsAsync<object>();
                name = data?.name;
            }

            return name == null
                ? req.CreateResponse(HttpStatusCode.BadRequest, "Please pass a name on the query string or in the request body")
                : req.CreateResponse(HttpStatusCode.OK, "Hello " + name);
        }

        [FunctionName("users")]
        public static async Task<HttpResponseMessage> Users([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequestMessage req, ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            var users = new Users
            {
                UserList = new List<UserDetails>
                {
                    new UserDetails {Username = "Sjors"},
                    new UserDetails {Username = "Kees"},
                    new UserDetails {Username = "Bas"},
                    new UserDetails {Username = "Wolkje"}
                }
            };


            return req.CreateResponse(HttpStatusCode.OK, users);
        }

        [FunctionName("info")]
        public static async Task<HttpResponseMessage> Info([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequestMessage req, ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            var result = new List<KeyValuePair<string, string>>();

            // Get current user claims    
            foreach (Claim claim in ClaimsPrincipal.Current.Claims)
            {
                result.Add(new KeyValuePair<string, string>(claim.Type, claim.Value));
            }

            return req.CreateResponse(HttpStatusCode.OK, result);
        }
    }
}
