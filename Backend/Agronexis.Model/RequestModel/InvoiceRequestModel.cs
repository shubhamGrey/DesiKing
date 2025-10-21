using System.ComponentModel.DataAnnotations;

namespace Agronexis.Model.RequestModel
{
    public class InvoicePdfGenerationRequest
    {
        public Guid OrderId { get; set; }
        public Guid UserId { get; set; }
        public Guid? ShippingAddressId { get; set; }
        public InvoiceDataModel? InvoiceData { get; set; }
    }



    public class GenerateInvoiceRequestModel
    {
        [Required]
        public string OrderId { get; set; } = string.Empty;

        [Required]
        public InvoiceDataModel InvoiceData { get; set; } = new();
    }

    public class InvoiceDataModel
    {
        public InvoiceSupplierModel Supplier { get; set; } = new();
        public InvoiceDetailsModel Invoice { get; set; } = new();
        public InvoiceCustomerModel Customer { get; set; } = new();
        public InvoiceAddressModel? DeliveryAddress { get; set; }
        public List<InvoiceItemModel> Items { get; set; } = new();
        public InvoiceTaxSummaryModel TaxSummary { get; set; } = new();
        public InvoicePaymentModel Payment { get; set; } = new();
        public List<string> Terms { get; set; } = new();
        public InvoiceEInvoiceModel EInvoice { get; set; } = new();
    }

    public class InvoiceSupplierModel
    {
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Gstin { get; set; } = string.Empty;
        public string PanNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Website { get; set; } = string.Empty;
    }

    public class InvoiceDetailsModel
    {
        public string Number { get; set; } = string.Empty;
        public string Date { get; set; } = string.Empty;
        public string DueDate { get; set; } = string.Empty;
        public string FinancialYear { get; set; } = string.Empty;
        public string OrderNumber { get; set; } = string.Empty;
        public string OrderDate { get; set; } = string.Empty;
    }

    public class InvoiceCustomerModel
    {
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string Pincode { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Gstin { get; set; }
        public string StateCode { get; set; } = string.Empty;
    }

    public class InvoiceAddressModel
    {
        public string Name { get; set; } = string.Empty;         // FullName
        public string Address { get; set; } = string.Empty;      // AddressLine
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;        // StateMaster.StateName
        public string StateCode { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;      // CountryMaster.CountryName
        public string CountryCode { get; set; } = string.Empty;
        public string Pincode { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
    }

    public class InvoiceItemModel
    {
        public int SlNo { get; set; }
        public string Description { get; set; } = string.Empty;
        public string HsnCode { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public string Unit { get; set; } = string.Empty;
        public decimal Rate { get; set; }
        public decimal TaxableValue { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal CgstRate { get; set; }
        public decimal SgstRate { get; set; }
        public decimal IgstRate { get; set; }
        public decimal CgstAmount { get; set; }
        public decimal SgstAmount { get; set; }
        public decimal IgstAmount { get; set; }
        public decimal TotalAmount { get; set; }
    }

    public class InvoiceTaxSummaryModel
    {
        public decimal TotalTaxableValue { get; set; }
        public decimal TotalDiscount { get; set; }
        public decimal TotalCGST { get; set; }
        public decimal TotalSGST { get; set; }
        public decimal TotalIGST { get; set; }
        public decimal TotalTax { get; set; }
        public decimal ShippingCharges { get; set; }
        public decimal GrandTotal { get; set; }
        public string PlaceOfSupply { get; set; } = string.Empty;
    }

    public class InvoicePaymentModel
    {
        public string Method { get; set; } = string.Empty;
        public string TransactionId { get; set; } = string.Empty;
        public string PaymentDate { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public decimal AmountPaid { get; set; }
    }

    public class InvoiceEInvoiceModel
    {
        public string? Irn { get; set; }
        public string? QrCode { get; set; }
        public string? AckNo { get; set; }
        public string? AckDate { get; set; }
    }
}