using Agronexis.Model.RequestModel;

namespace Agronexis.Business.Configurations
{
    public interface IInvoiceService
    {
        Task<byte[]> GenerateGstInvoicePdfAsync(InvoiceDataModel invoiceData);
        string GenerateInvoiceHtml(InvoiceDataModel invoiceData);
        string GenerateQRCode(string data);
    }
}