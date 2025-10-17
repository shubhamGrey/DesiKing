using Agronexis.Model.RequestModel;
using PuppeteerSharp;
using QRCoder;
using System.Text;

namespace Agronexis.Business.Configurations
{
    public class InvoiceService : IInvoiceService
    {
        public async Task<byte[]> GenerateGstInvoicePdfAsync(InvoiceDataModel invoiceData)
        {
            try
            {
                // Download browser if not exists
                var browserFetcher = new BrowserFetcher();
                
                Console.WriteLine("Checking browser availability...");
                await browserFetcher.DownloadAsync();
                
                // Generate HTML content
                var htmlContent = GenerateInvoiceHtml(invoiceData);
                Console.WriteLine("HTML content generated.");

                // Launch Puppeteer with enhanced compatibility options for macOS
                Console.WriteLine("Launching browser...");
                
                var launchOptions = new LaunchOptions
                {
                    Headless = true,
                    Args = new[] { 
                        "--no-sandbox", 
                        "--disable-setuid-sandbox",
                        "--disable-dev-shm-usage",
                        "--disable-accelerated-2d-canvas",
                        "--no-first-run",
                        "--no-zygote",
                        "--single-process",
                        "--disable-gpu",
                        "--disable-extensions",
                        "--disable-plugins",
                        "--disable-features=VizDisplayCompositor"
                    },
                    IgnoreHTTPSErrors = true,
                    DefaultViewport = new ViewPortOptions { Width = 1024, Height = 768 },
                    Timeout = 30000 // 30 seconds timeout
                };

                using var browser = await Puppeteer.LaunchAsync(launchOptions);
                Console.WriteLine("Browser launched successfully.");

                using var page = await browser.NewPageAsync();

                // Set content and generate PDF
                await page.SetContentAsync(htmlContent);

                var pdfOptions = new PdfOptions
                {
                    Format = PuppeteerSharp.Media.PaperFormat.A4,
                    PrintBackground = true,
                    MarginOptions = new PuppeteerSharp.Media.MarginOptions
                    {
                        Top = "20px",
                        Bottom = "20px",
                        Left = "20px",
                        Right = "20px"
                    }
                };

                var pdfBytes = await page.PdfDataAsync(pdfOptions);
                Console.WriteLine("PDF generated successfully.");
                return pdfBytes;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in PDF generation: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                throw new Exception($"Error generating PDF: {ex.Message}", ex);
            }
        }

        public string GenerateInvoiceHtml(InvoiceDataModel invoiceData)
        {
            var html = new StringBuilder();

            html.Append(@"
<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>GST Invoice</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
            background-color: #fff;
        }
        
        .invoice-container {
            max-width: 210mm;
            margin: 0 auto;
            padding: 20px;
            background: white;
        }
        
        .header {
            background: linear-gradient(135deg, #2E7D32, #4CAF50);
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            margin-bottom: 0;
        }
        
        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .company-info h1 {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .company-info p {
            font-size: 14px;
            opacity: 0.9;
        }
        
        .invoice-title {
            text-align: right;
        }
        
        .invoice-title h2 {
            font-size: 24px;
            margin-bottom: 5px;
        }
        
        .invoice-details {
            background: #f8f9fa;
            padding: 20px;
            border: 1px solid #e9ecef;
            border-top: none;
        }
        
        .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
        }
        
        .detail-section h3 {
            color: #2E7D32;
            font-size: 16px;
            margin-bottom: 10px;
            border-bottom: 2px solid #4CAF50;
            padding-bottom: 5px;
        }
        
        .detail-item {
            margin-bottom: 8px;
        }
        
        .detail-label {
            font-weight: 600;
            color: #555;
            display: inline-block;
            min-width: 120px;
        }
        
        .addresses-section {
            margin: 20px 0;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            overflow: hidden;
        }
        
        .addresses-header {
            background: #2E7D32;
            color: white;
            padding: 12px 20px;
            font-weight: 600;
            font-size: 16px;
        }
        
        .addresses-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0;
        }
        
        .address-box {
            padding: 20px;
            border-right: 1px solid #e9ecef;
        }
        
        .address-box:last-child {
            border-right: none;
        }
        
        .address-title {
            font-weight: 600;
            color: #2E7D32;
            margin-bottom: 10px;
            font-size: 14px;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 11px;
        }
        
        .items-table th {
            background: #2E7D32;
            color: white;
            padding: 12px 8px;
            text-align: center;
            font-weight: 600;
            border: 1px solid #fff;
        }
        
        .items-table td {
            padding: 10px 8px;
            text-align: center;
            border: 1px solid #ddd;
        }
        
        .items-table tbody tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        
        .items-table tbody tr:hover {
            background-color: #e8f5e8;
        }
        
        .text-left { text-align: left !important; }
        .text-right { text-align: right !important; }
        
        .tax-summary {
            margin: 20px 0;
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            overflow: hidden;
        }
        
        .tax-summary-header {
            background: #2E7D32;
            color: white;
            padding: 12px 20px;
            font-weight: 600;
            font-size: 16px;
        }
        
        .tax-content {
            padding: 20px;
        }
        
        .tax-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
        }
        
        .tax-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 5px 0;
        }
        
        .tax-item.total {
            border-top: 2px solid #2E7D32;
            margin-top: 10px;
            padding-top: 10px;
            font-weight: 600;
            font-size: 14px;
            color: #2E7D32;
        }
        
        .payment-info {
            margin: 20px 0;
            background: #e8f5e8;
            border: 1px solid #4CAF50;
            border-radius: 8px;
            padding: 20px;
        }
        
        .payment-title {
            color: #2E7D32;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 15px;
        }
        
        .payment-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        
        .terms-section {
            margin: 20px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            border: 1px solid #e9ecef;
        }
        
        .terms-title {
            color: #2E7D32;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 15px;
        }
        
        .terms-list {
            list-style: none;
            padding: 0;
        }
        
        .terms-list li {
            margin-bottom: 8px;
            padding-left: 20px;
            position: relative;
        }
        
        .terms-list li:before {
            content: '•';
            color: #4CAF50;
            font-weight: bold;
            position: absolute;
            left: 0;
        }
        
        .footer {
            margin-top: 30px;
            text-align: center;
            padding: 20px;
            background: #2E7D32;
            color: white;
            border-radius: 8px;
        }
        
        .signature-section {
            margin: 30px 0;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
        }
        
        .signature-box {
            text-align: center;
        }
        
        .signature-line {
            border-top: 1px solid #333;
            margin-top: 40px;
            padding-top: 10px;
            font-size: 12px;
            color: #666;
        }
        
        @media print {
            .invoice-container {
                max-width: none;
                margin: 0;
                padding: 0;
            }
            
            body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
            }
        }
    </style>
</head>
<body>
    <div class='invoice-container'>
        <!-- Header -->
        <div class='header'>
            <div class='header-content'>
                <div class='company-info'>
                    <h1>" + invoiceData.Supplier.Name + @"</h1>
                    <p>" + invoiceData.Supplier.Address + @"</p>
                    <p>GSTIN: " + invoiceData.Supplier.Gstin + @" | PAN: " + invoiceData.Supplier.PanNumber + @"</p>
                    <p>📧 " + invoiceData.Supplier.Email + @" | 📞 " + invoiceData.Supplier.Phone + @"</p>
                </div>
                <div class='invoice-title'>
                    <h2>TAX INVOICE</h2>
                    <p>GST Compliant</p>
                </div>
            </div>
        </div>
        
        <!-- Invoice Details -->
        <div class='invoice-details'>
            <div class='details-grid'>
                <div class='detail-section'>
                    <h3>Invoice Information</h3>
                    <div class='detail-item'>
                        <span class='detail-label'>Invoice No:</span>
                        <span>" + invoiceData.Invoice.Number + @"</span>
                    </div>
                    <div class='detail-item'>
                        <span class='detail-label'>Invoice Date:</span>
                        <span>" + invoiceData.Invoice.Date + @"</span>
                    </div>
                    <div class='detail-item'>
                        <span class='detail-label'>Due Date:</span>
                        <span>" + invoiceData.Invoice.DueDate + @"</span>
                    </div>
                    <div class='detail-item'>
                        <span class='detail-label'>Financial Year:</span>
                        <span>" + invoiceData.Invoice.FinancialYear + @"</span>
                    </div>
                </div>
                <div class='detail-section'>
                    <h3>Order Information</h3>
                    <div class='detail-item'>
                        <span class='detail-label'>Order No:</span>
                        <span>" + invoiceData.Invoice.OrderNumber + @"</span>
                    </div>
                    <div class='detail-item'>
                        <span class='detail-label'>Order Date:</span>
                        <span>" + invoiceData.Invoice.OrderDate + @"</span>
                    </div>
                    <div class='detail-item'>
                        <span class='detail-label'>Place of Supply:</span>
                        <span>" + invoiceData.TaxSummary.PlaceOfSupply + @"</span>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Addresses -->
        <div class='addresses-section'>
            <div class='addresses-header'>Bill To & Ship To</div>
            <div class='addresses-content'>
                <div class='address-box'>
                    <div class='address-title'>🏢 Bill To (Customer Details)</div>
                    <div><strong>" + invoiceData.Customer.Name + @"</strong></div>
                    <div>" + invoiceData.Customer.Address + @"</div>
                    <div>" + invoiceData.Customer.City + @", " + invoiceData.Customer.State + @" - " + invoiceData.Customer.Pincode + @"</div>
                    <div>📞 " + invoiceData.Customer.Phone + @"</div>");

            if (!string.IsNullOrEmpty(invoiceData.Customer.Email))
            {
                html.Append($@"<div>📧 {invoiceData.Customer.Email}</div>");
            }

            if (!string.IsNullOrEmpty(invoiceData.Customer.Gstin))
            {
                html.Append($@"<div><strong>GSTIN:</strong> {invoiceData.Customer.Gstin}</div>");
            }

            html.Append(@"
                    <div><strong>State Code:</strong> " + invoiceData.Customer.StateCode + @"</div>
                </div>
                <div class='address-box'>
                    <div class='address-title'>🚚 Ship To</div>");

            if (invoiceData.DeliveryAddress != null)
            {
                html.Append($@"
                    <div><strong>{invoiceData.DeliveryAddress.Name}</strong></div>
                    <div>{invoiceData.DeliveryAddress.Address}</div>
                    <div>{invoiceData.DeliveryAddress.City}, {invoiceData.DeliveryAddress.State} - {invoiceData.DeliveryAddress.Pincode}</div>
                    <div>📞 {invoiceData.DeliveryAddress.Phone}</div>
                    <div><strong>State Code:</strong> {invoiceData.DeliveryAddress.StateCode}</div>");
            }
            else
            {
                html.Append(@"<div style='color: #666; font-style: italic;'>Same as billing address</div>");
            }

            html.Append(@"
                </div>
            </div>
        </div>
        
        <!-- Items Table -->
        <table class='items-table'>
            <thead>
                <tr>
                    <th width='5%'>S.No</th>
                    <th width='25%' class='text-left'>Description of Goods</th>
                    <th width='10%'>HSN/SAC</th>
                    <th width='8%'>Qty</th>
                    <th width='8%'>Unit</th>
                    <th width='10%'>Rate (₹)</th>
                    <th width='12%'>Taxable Value (₹)</th>
                    <th width='8%'>CGST %</th>
                    <th width='8%'>SGST %</th>
                    <th width='8%'>IGST %</th>
                    <th width='12%'>Total (₹)</th>
                </tr>
            </thead>
            <tbody>");

            foreach (var item in invoiceData.Items)
            {
                html.Append($@"
                <tr>
                    <td>{item.SlNo}</td>
                    <td class='text-left'>{item.Description}</td>
                    <td>{item.HsnCode}</td>
                    <td>{item.Quantity}</td>
                    <td>{item.Unit}</td>
                    <td class='text-right'>{item.Rate:F2}</td>
                    <td class='text-right'>{item.TaxableValue:F2}</td>
                    <td>{item.CgstRate:F1}%</td>
                    <td>{item.SgstRate:F1}%</td>
                    <td>{item.IgstRate:F1}%</td>
                    <td class='text-right'><strong>{item.TotalAmount:F2}</strong></td>
                </tr>");
            }

            html.Append(@"
            </tbody>
        </table>
        
        <!-- Tax Summary -->
        <div class='tax-summary'>
            <div class='tax-summary-header'>Tax Summary & Totals</div>
            <div class='tax-content'>
                <div class='tax-grid'>
                    <div>
                        <div class='tax-item'>
                            <span>Total Taxable Value:</span>
                            <span>₹" + invoiceData.TaxSummary.TotalTaxableValue.ToString("F2") + @"</span>
                        </div>
                        <div class='tax-item'>
                            <span>Total Discount:</span>
                            <span>₹" + invoiceData.TaxSummary.TotalDiscount.ToString("F2") + @"</span>
                        </div>
                        <div class='tax-item'>
                            <span>Shipping Charges:</span>
                            <span>₹" + invoiceData.TaxSummary.ShippingCharges.ToString("F2") + @"</span>
                        </div>
                    </div>
                    <div>
                        <div class='tax-item'>
                            <span>Total CGST:</span>
                            <span>₹" + invoiceData.TaxSummary.TotalCGST.ToString("F2") + @"</span>
                        </div>
                        <div class='tax-item'>
                            <span>Total SGST:</span>
                            <span>₹" + invoiceData.TaxSummary.TotalSGST.ToString("F2") + @"</span>
                        </div>
                        <div class='tax-item'>
                            <span>Total IGST:</span>
                            <span>₹" + invoiceData.TaxSummary.TotalIGST.ToString("F2") + @"</span>
                        </div>
                    </div>
                </div>
                <div class='tax-item total'>
                    <span>Grand Total:</span>
                    <span>₹" + invoiceData.TaxSummary.GrandTotal.ToString("F2") + @"</span>
                </div>
            </div>
        </div>
        
        <!-- Payment Information -->
        <div class='payment-info'>
            <div class='payment-title'>💳 Payment Details</div>
            <div class='payment-grid'>
                <div>
                    <div class='tax-item'>
                        <span>Payment Method:</span>
                        <span>" + invoiceData.Payment.Method + @"</span>
                    </div>
                    <div class='tax-item'>
                        <span>Transaction ID:</span>
                        <span>" + invoiceData.Payment.TransactionId + @"</span>
                    </div>
                </div>
                <div>
                    <div class='tax-item'>
                        <span>Payment Date:</span>
                        <span>" + invoiceData.Payment.PaymentDate + @"</span>
                    </div>
                    <div class='tax-item'>
                        <span>Amount Paid:</span>
                        <span>₹" + invoiceData.Payment.AmountPaid.ToString("F2") + @"</span>
                    </div>
                </div>
            </div>
        </div>");

            // Terms and Conditions
            if (invoiceData.Terms?.Any() == true)
            {
                html.Append(@"
        <!-- Terms and Conditions -->
        <div class='terms-section'>
            <div class='terms-title'>📋 Terms and Conditions</div>
            <ul class='terms-list'>");

                foreach (var term in invoiceData.Terms)
                {
                    html.Append($@"<li>{term}</li>");
                }

                html.Append(@"
            </ul>
        </div>");
            }

            html.Append(@"
        <!-- Signature Section -->
        <div class='signature-section'>
            <div class='signature-box'>
                <div>Customer Signature</div>
                <div class='signature-line'>Received the goods in good condition</div>
            </div>
            <div class='signature-box'>
                <div>Authorized Signatory</div>
                <div class='signature-line'>" + invoiceData.Supplier.Name + @"</div>
            </div>
        </div>
        
        <!-- Footer -->
        <div class='footer'>
            <p>🌐 Visit us at " + invoiceData.Supplier.Website + @" | This is a computer-generated invoice</p>
            <p>Thank you for choosing " + invoiceData.Supplier.Name + @" - India's Premium Spice Destination! 🌶️</p>
        </div>
    </div>
</body>
</html>");

            return html.ToString();
        }

        public string GenerateQRCode(string data)
        {
            try
            {
                using var qrGenerator = new QRCodeGenerator();
                using var qrCodeData = qrGenerator.CreateQrCode(data, QRCodeGenerator.ECCLevel.Q);
                using var qrCode = new PngByteQRCode(qrCodeData);
                var qrCodeBytes = qrCode.GetGraphic(20);
                return Convert.ToBase64String(qrCodeBytes);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error generating QR code: {ex.Message}", ex);
            }
        }
    }
}