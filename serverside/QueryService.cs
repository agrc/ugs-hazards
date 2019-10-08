using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.WebUtilities;

namespace serverside {
    public class QueryService : IQueryService {
        private readonly HttpClient _httpClient;
        public QueryService(HttpClient client) {
            _httpClient = client;
        }

        public async Task<StringResult> QueryUnitsAsync(FeatureClassMap meta, string areaOfInterest) {
            var queryParams = new Dictionary<string, string>() {
                    {"outFields", meta.Unit},
                    {"geometry", areaOfInterest},
                    {"geometryType", "esriGeometryPolygon"},
                    {"inSR", "3857"},
                    {"returnGeometry", "false"},
                    {"returnCentroid", "false"},
                    {"spatialRel", "esriSpatialRelIntersects"},
                    {"f", "json"}
                };

            var url = QueryHelpers.AddQueryString(meta.Url, queryParams);

            using var request = new HttpRequestMessage(HttpMethod.Get, url);

            using var response = await _httpClient.SendAsync(request);

            response.EnsureSuccessStatusCode();

            using var resultStream = await response.Content.ReadAsStreamAsync();

            var queryResponse = await JsonSerializer.DeserializeAsync<QueryResponse>(resultStream, new JsonSerializerOptions {
                IgnoreNullValues = true,
                PropertyNameCaseInsensitive = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            if (!queryResponse.IsSuccessful) {
                return new StringResult {
                    Unit = meta.Unit,
                    Error = queryResponse.Error.Message,
                    LayerName = meta.Url
                };
            }

            return new StringResult {
                Unit = meta.Unit,
                Text = queryResponse.Features.Select(feature => feature.Attributes[meta.Unit].ToString()),
                LayerName = meta.Url
            };
        }

        public async Task<DictionaryResult> QueryHazardTableAsync(IEnumerable<StringResult> results) {
            const string reportTables = "Report_Tables_View/FeatureServer/4/query";
            var units = results.SelectMany(value => value.Text);
            var whereClause = units.Select(x => $"'{x}'").ToArray();

            var queryParams = new Dictionary<string, string>() {
                    {"where", $"HazardUnit IN ({string.Join(',', whereClause)})"},
                    {"outFields", "HazardUnit,HowToUse,Description"},
                    {"returnGeometry", "false"},
                    {"returnCentroid", "false"},
                    {"f", "json"}
                };

            var url = QueryHelpers.AddQueryString(reportTables, queryParams);

            using var request = new HttpRequestMessage(HttpMethod.Get, url);
            using var response = await _httpClient.SendAsync(request);

            response.EnsureSuccessStatusCode();

            using var resultStream = await response.Content.ReadAsStreamAsync();

            var queryResponse = await JsonSerializer.DeserializeAsync<QueryResponse>(resultStream, new JsonSerializerOptions {
                IgnoreNullValues = true,
                PropertyNameCaseInsensitive = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            if (!queryResponse.IsSuccessful) {
                return new DictionaryResult {
                    Error = queryResponse.Error.Message
                };
            }

            return new DictionaryResult {
                Data = queryResponse.Features.Select(feature => feature.Attributes)
            };
        }

        public async Task<DictionaryResult> QueryHazardReferencesAsync(IEnumerable<StringResult> results) {
            const string reportTables = "Report_Tables_View/FeatureServer/3/query";

            var units = results.SelectMany(value => value.Text);
            var whereClause = units.Select(value => $"'{value.Substring(1).ToUpper()}'");

            var queryParams = new Dictionary<string, string>() {
                    {"where", $"Hazard IN ({string.Join(',', whereClause)})"},
                    {"outFields", "Hazard,Text"},
                    {"returnGeometry", "false"},
                    {"returnCentroid", "false"},
                    {"f", "json"}
                };

            var url = QueryHelpers.AddQueryString(reportTables, queryParams);

            using var request = new HttpRequestMessage(HttpMethod.Get, url);

            using var response = await _httpClient.SendAsync(request);

            response.EnsureSuccessStatusCode();

            using var resultStream = await response.Content.ReadAsStreamAsync();

            var queryResponse = await JsonSerializer.DeserializeAsync<QueryResponse>(resultStream, new JsonSerializerOptions {
                IgnoreNullValues = true,
                PropertyNameCaseInsensitive = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            if (!queryResponse.IsSuccessful) {
                return new DictionaryResult {
                    Error = queryResponse.Error.Message
                };
            }

            return new DictionaryResult {
                Data = queryResponse.Features.Select(feature => feature.Attributes)
            };
        }

        public async Task<DictionaryResult> QueryIntroTextAsync(IEnumerable<StringResult> results) {
            const string reportTables = "Report_Tables_View/FeatureServer/2/query";

            var units = results.SelectMany(value => value.Text);
            var whereClause = units.Select(value => $"'{value.Substring(1).ToUpper()}'");

            var queryParams = new Dictionary<string, string>() {
                    {"where", $"Hazard IN ({string.Join(',', whereClause)})"},
                    {"outFields", "Hazard,Text"},
                    {"returnGeometry", "false"},
                    {"returnCentroid", "false"},
                    {"f", "json"}
                };

            var url = QueryHelpers.AddQueryString(reportTables, queryParams);

            using var request = new HttpRequestMessage(HttpMethod.Get, url);

            using var response = await _httpClient.SendAsync(request);

            response.EnsureSuccessStatusCode();

            using var resultStream = await response.Content.ReadAsStreamAsync();

            var queryResponse = await JsonSerializer.DeserializeAsync<QueryResponse>(resultStream, new JsonSerializerOptions {
                IgnoreNullValues = true,
                PropertyNameCaseInsensitive = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            if (!queryResponse.IsSuccessful) {
                return new DictionaryResult {
                    Error = queryResponse.Error.Message
                };
            }

            return new DictionaryResult {
                Data = queryResponse.Features.Select(feature => feature.Attributes)
            };
        }
    }

    public interface IQueryService {
        Task<StringResult> QueryUnitsAsync(FeatureClassMap meta, string areaOfInterest);
        Task<DictionaryResult> QueryHazardTableAsync(IEnumerable<StringResult> results);
        Task<DictionaryResult> QueryHazardReferencesAsync(IEnumerable<StringResult> results);
        Task<DictionaryResult> QueryIntroTextAsync(IEnumerable<StringResult> results);
    }
}
