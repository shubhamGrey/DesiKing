using System.Net;

public class RepositoryException : Exception
{
    public string CorrelationId { get; }
    public HttpStatusCode StatusCode { get; }

    public RepositoryException(
        string message,
        string correlationId,
        Exception innerException = null)
        : base(message, innerException)
    {
        CorrelationId = correlationId;
    }
}
