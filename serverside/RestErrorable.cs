using System.Collections.Generic;

namespace serverside
{
    public abstract class RestErrorable {
        public virtual RestEndpointError Error { get; set; }
        public virtual bool IsSuccessful => Error == null;
    }

    public class RestEndpointError {
        public int Code { get; set; }
        public string Message { get; set; }
        public IReadOnlyCollection<object> Details { get; set; }
    }
}
