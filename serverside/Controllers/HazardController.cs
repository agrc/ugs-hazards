using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using System.IO;

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

        private readonly IQueryService _service;

        private readonly ILogger<HazardController> _logger;

        public HazardController(IQueryService service, ILogger<HazardController> logger) {
            _service = service;
            _logger = logger;
        }

        [HttpGet]
        public string Get() {
            return "OK";
        }

        [HttpPost]
        public async Task<JsonResult> Post() {
            var areaOfInterest = string.Empty;
            using (var reader = new StreamReader(Request.Body)) {
                areaOfInterest = await reader.ReadToEndAsync();
            }

            if (string.IsNullOrEmpty(areaOfInterest)) {
                return new JsonResult("empty geometry") {
                    StatusCode = 400
                };
            }

            var queryTasks = _serviceUrls.Select(meta => _service.QueryUnitsAsync(meta, areaOfInterest)).ToArray();
            var queries = await Task.WhenAll(queryTasks);

            var hazardUnits = queries.Where(value => value.Text.Count() > 0);

            var reportInfo = _service.QueryHazardTableAsync(queries);
            var referenceInfo = _service.QueryHazardReferencesAsync(queries);
            var introInfo = _service.QueryIntroTextAsync(queries);

            var hazards = await Task.WhenAll(reportInfo);
            var references = await Task.WhenAll(referenceInfo);
            var introText = await Task.WhenAll(introInfo);

            return new JsonResult(new {
                introText,
                hazards,
                references
            }, new JsonSerializerOptions {
                IgnoreNullValues = true,
                PropertyNameCaseInsensitive = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });
        }
    }
}
