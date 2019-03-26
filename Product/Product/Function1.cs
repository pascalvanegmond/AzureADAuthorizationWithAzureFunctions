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
using Product.Models;

namespace Product
{
    public static class Function1
    {
        [FunctionName("Function1")]
        public static async Task<HttpResponseMessage> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)]
            HttpRequestMessage req, ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

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
                ? req.CreateResponse(HttpStatusCode.BadRequest,
                    "Please pass a name on the query string or in the request body")
                : req.CreateResponse(HttpStatusCode.OK, "Hello " + name);
        }

        [FunctionName("products")]
        public static async Task<HttpResponseMessage> Products([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequestMessage req, ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            var products = new List<Item>
            {
                new Item {name = "item 1", price = 10},
                new Item {name = "item 2", price = 10},
                new Item {name = "item 3", price = 10},
            };

            return req.CreateResponse(HttpStatusCode.OK, products);
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
