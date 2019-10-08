using System.Collections.Generic;

namespace serverside {
    public class QueryResponse {
        public List<Feature> features { get; set; }
    }

    public class Feature {
        public Dictionary<string, object> attributes { get; set; }
    }
}
