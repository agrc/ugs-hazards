using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.WebUtilities;
using System.Text.Json;

namespace serverside.Controllers
{
  [ApiController]
    [Route("/")]
    public class HazardController : ControllerBase {
        private readonly IReadOnlyCollection<FeatureClassMap> _serviceUrls = new List<FeatureClassMap>() {
            new FeatureClassMap {
                Url="Utah_Geologic_Hazards/FeatureServer/1/query",
                Unit="FLHHazardUnit"
            },
             new FeatureClassMap {
                Url="Utah_Geologic_Hazards/FeatureServer/2/query",
                Unit="SGSHazardUnit"
            },
            new FeatureClassMap {
                Url="Utah_Geologic_Hazards/FeatureServer/3/query",
                Unit="LSSHazardUnit"
            },
            new FeatureClassMap {
                Url="Utah_Geologic_Hazards/FeatureServer/5/query",
                Unit="LSUnit"
            },
            new FeatureClassMap {
                Url="Utah_Geologic_Hazards/FeatureServer/6/query",
                Unit="CASHazardUnit"
            },
            new FeatureClassMap {
                Url="Utah_Geologic_Hazards/FeatureServer/7/query",
                Unit="CSSHazardUnit"
            },
            new FeatureClassMap {
                Url="Utah_Geologic_Hazards/FeatureServer/8/query",
                Unit="CRSHazardUnit"
            },
            new FeatureClassMap {
                Url="Utah_Geologic_Hazards/FeatureServer/9/query",
                Unit="EFHHazardUnit"
            },
            new FeatureClassMap {
                Url="Utah_Geologic_Hazards/FeatureServer/10/query",
                Unit="ERZHazardUnit"
            },
            new FeatureClassMap {
                Url="Utah_Geologic_Hazards/FeatureServer/11/query",
                Unit="EXSHazardUnit"
            },
            new FeatureClassMap {
                Url="Utah_Geologic_Hazards/FeatureServer/12/query",
                Unit="GSPHazardUnit"
            },
            new FeatureClassMap {
                Url="Utah_Geologic_Hazards/FeatureServer/13/query",
                Unit="MKFHazardUnit"
            },
            new FeatureClassMap {
                Url="Utah_Geologic_Hazards/FeatureServer/14/query",
                Unit="PESHazardUnit"
            },
            new FeatureClassMap {
                Url="Utah_Geologic_Hazards/FeatureServer/15/query",
                Unit="GRSHazardUnit"
            },
            new FeatureClassMap {
                Url="Utah_Geologic_Hazards/FeatureServer/16/query",
                Unit="RFHHazardUnit"
            },
            new FeatureClassMap {
                Url="Utah_Geologic_Hazards/FeatureServer/17/query",
                Unit="SDHHazardUnit"
            },
            new FeatureClassMap {
                Url="Utah_Geologic_Hazards/FeatureServer/18/query",
                Unit="SBPHazardUnit"
            },
            new FeatureClassMap {
                Url="Utah_Geologic_Hazards/FeatureServer/19/query",
                Unit="SLSHazardUnit"
            },
            new FeatureClassMap {
                Url="Utah_Geologic_Hazards/FeatureServer/20/query",
                Unit="WSSHazardUnit"
            },
            new FeatureClassMap {
                Url="Utah_Earthquake_Hazards/FeatureServer/3/query",
                Unit="LQSHazardUnit"
            },
            new FeatureClassMap {
                Url="Utah_Earthquake_Hazards/FeatureServer/4/query",
                Unit="SFRHazardUnit"
            }
        };

        private const string _reportTables = "Report_Tables_View/FeatureServer";

        private readonly IHttpClientFactory _clientFactory;

        private readonly ILogger<HazardController> _logger;


        public HazardController(IHttpClientFactory clientFactory, ILogger<HazardController> logger) {
            _clientFactory = clientFactory;
            _logger = logger;
        }

        [HttpGet]
        public string Get() {
            return "OK";
        }

    [HttpPost]
        public async Task<JsonResult> Post(string json) {
            var client = _clientFactory.CreateClient("agol");

            var meta = _serviceUrls.First();
            var queryParams = new Dictionary<string, string>() {
                {"outFields", meta.Unit},
                {"geometry", "{ \"rings\": [[[-12472025.223916203, 4967174.1688544145], [-12471929.677630847, 4967107.2864546655], [-12471920.123002311, 4966696.437427633], [-12472522.064600056, 4966744.210570311], [-12472464.736828843, 4967279.269768307], [-12472025.223916203, 4967174.1688544145]]] }"},
                {"geometryType", "esriGeometryPolygon"},
                {"inSR", "3857"},
                {"returnGeometry", "false"},
                {"returnCentroid", "false"},
                {"spatialRel", "esriSpatialRelIntersects"},
                {"f", "json"}
            };
            var url = QueryHelpers.AddQueryString(meta.Url, queryParams);

            using var request = new HttpRequestMessage(HttpMethod.Get, url);

            var response = await client.SendAsync(request);

            response.EnsureSuccessStatusCode();

            var result = await response.Content.ReadAsStreamAsync();
            var obj = await JsonSerializer.DeserializeAsync<QueryResponse>(result);

            return new JsonResult(obj.features.FirstOrDefault().attributes[meta.Unit]);
        }
    }
}
