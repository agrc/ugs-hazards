using System.Collections.Generic;

namespace serverside {
    public class QueryResponse : RestErrorable {
        public List<Feature> Features { get; set; }
    }

    public class Feature {
        public Dictionary<string, object> Attributes { get; set; }
    }
}
