using System.Collections.Generic;

namespace serverside {
    public class StringResult {
        public IEnumerable<string> Text { get; set; }
        public string Unit { get; set; }
        public string LayerName { get; set; }
        public string Error { get; set; }
    }

    public class DictionaryResult {
        public IEnumerable<Dictionary<string, object>> Data { get; set; }
        public string Unit { get; set; }
        public string LayerName { get; set; }
        public string Error { get; set; }
    }
}
