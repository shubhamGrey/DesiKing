import { Container, Typography, Box } from "@mui/material";
import React from "react";
import { michroma } from "@/styles/fonts";

const Shipping: React.FC = () => {
  return (
    <Container sx={{ mt: 4, mx: 6, mb: 6, justifySelf: "center" }}>
      <Box sx={{ mb: 5, p: 3 }}>
        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
        >
          Shipping Policy
        </Typography>
        <Typography variant="body2" gutterBottom>
          Last updated: April 23, 2025
        </Typography>
      </Box>

      <Box sx={{ mb: 5, p: 3 }}>
        <Typography variant="body2" gutterBottom>
          Agro Nexis India Overseas Private Limited (&quot;we&quot; and
          &quot;us&quot;) is the operator of (https://www.agronexis.com)
          (&quot;Website&quot;). By placing an order through this Website, you
          will be agreeing to the terms below. These are provided to ensure both
          parties are aware of and agree upon this arrangement to mutually
          protect and set expectations on our service.
        </Typography>
      </Box>

      <Box sx={{ mb: 5, p: 3 }}>
        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
        >
          1. General
        </Typography>
        <Typography variant="body2" gutterBottom>
          Subject to stock availability. We try to maintain accurate stock
          counts on our website but from time to time there may be a stock
          discrepancy and we will not be able to fulfil all your items at the
          time of purchase. In this instance, we will fulfil the available
          products to you, and contact you about whether you would prefer to
          await restocking of the back-ordered item or if you would prefer for
          us to process a refund.
        </Typography>
      </Box>

      <Box sx={{ mb: 5, p: 3 }}>
        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
        >
          2. Shipping Costs
        </Typography>
        <Typography variant="body2" gutterBottom>
          Shipping costs are calculated during checkout based on weight,
          dimensions, and destination of the items in the order. Payment for
          shipping will be collected with the purchase. This price will be the
          final price for shipping cost to the customer.
        </Typography>
      </Box>

      <Box sx={{ mb: 5, p: 3 }}>
        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
        >
          3. Returns
        </Typography>
        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
          sx={{ mt: 2 }}
        >
          3.1 Return Due To Change of Mind
        </Typography>
        <Typography variant="body2" gutterBottom>
          Agro Nexis India Overseas Private Limited will happily accept returns
          due to a change of mind as long as a request to return is received by
          us within 2 days of receipt of item and are returned to us in original
          packaging, unused, and in resalable condition. Return shipping will be
          paid at the customer&apos;s expense and will be required to arrange
          their own shipping. Once returns are received and accepted, refunds
          will be processed to store credit for a future purchase. We will
          notify you once this has been completed through email. (Agro Nexis)
          will refund the value of the goods returned but will NOT refund the
          value of any shipping paid.
        </Typography>

        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
          sx={{ mt: 2 }}
        >
          3.2 Warranty Returns
        </Typography>
        <Typography variant="body2" gutterBottom>
          Agro Nexis will happily honour any valid warranty claims, provided a
          claim is submitted within 90 days of receipt of items. Customers will
          be required to pre-pay the return shipping, however, we will reimburse
          you upon successful warranty claim. Upon return receipt of items for a
          warranty claim, you can expect Agro Nexis to process your warranty
          claim within 7 days. Once the warranty claim is confirmed, you will
          receive the choice of:
        </Typography>
        <ul style={{ paddingLeft: "1.5rem", marginTop: "1rem" }}>
          <li>
            <Typography variant="body2" gutterBottom>
              (a) refund to your payment method
            </Typography>
          </li>
          <li>
            <Typography variant="body2" gutterBottom>
              (b) a refund in-store credit
            </Typography>
          </li>
          <li>
            <Typography variant="body2" gutterBottom>
              (c) a replacement item sent to you (if stock is available)
            </Typography>
          </li>
        </ul>
      </Box>

      <Box sx={{ mb: 5, p: 3 }}>
        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
        >
          4. Delivery Terms
        </Typography>
        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
          sx={{ mt: 2 }}
        >
          4.1 Transit Time Domestically
        </Typography>
        <Typography variant="body2" gutterBottom>
          In general, domestic shipments are in transit for 2 - 7 days
        </Typography>

        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
          sx={{ mt: 2 }}
        >
          4.2 Transit time Internationally
        </Typography>
        <Typography variant="body2" gutterBottom>
          Generally, orders shipped internationally are in transit for 4 - 22
          days. This varies greatly depending on the courier you have selected.
          We are able to offer a more specific estimate when you are choosing
          your courier at the checkout.
        </Typography>

        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
          sx={{ mt: 2 }}
        >
          4.3 Dispatch Time
        </Typography>
        <Typography variant="body2" gutterBottom>
          Orders are usually dispatched within 2 business days of payment of an
          order. Our warehouse operates on Monday to Friday during standard
          business hours, except on national holidays at which time the
          warehouse will be closed. In these instances, we take steps to ensure
          shipment delays will be kept to a minimum.
        </Typography>

        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
          sx={{ mt: 2 }}
        >
          4.4 Change of Delivery Address
        </Typography>
        <Typography variant="body2" gutterBottom>
          For a change of delivery address request, we are able to change the
          address at any time before the order has been dispatched.
        </Typography>

        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
          sx={{ mt: 2 }}
        >
          4.5 P.O. Box Shipping
        </Typography>
        <Typography variant="body2" gutterBottom>
          Agro Nexis will ship to P.O. box addresses using postal services only.
          We are unable to offer courier services to these locations.
        </Typography>

        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
          sx={{ mt: 2 }}
        >
          4.6 Military Address Shipping
        </Typography>
        <Typography variant="body2" gutterBottom>
          We are able to ship to military addresses using USPS. We are unable to
          offer this service using courier services.
        </Typography>

        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
          sx={{ mt: 2 }}
        >
          4.7 Items Out of Stock
        </Typography>
        <Typography variant="body2" gutterBottom>
          If an item is out of stock, we will wait for the item to be available
          before dispatching your order. Existing items in the order will be
          reserved while we await this item.
        </Typography>

        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
          sx={{ mt: 2 }}
        >
          4.8 Delivery Time Exceeded
        </Typography>
        <Typography variant="body2" gutterBottom>
          If the delivery time has exceeded the forecasted time, please contact
          us so that we can conduct an investigation.
        </Typography>
      </Box>

      <Box sx={{ mb: 5, p: 3 }}>
        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
        >
          5. Tracking Notifications
        </Typography>
        <Typography variant="body2" gutterBottom>
          Upon dispatch, customers will receive a tracking link from which they
          will be able to follow the progress of their shipment based on the
          latest updates made available by the shipping provider.
        </Typography>
      </Box>

      <Box sx={{ mb: 5, p: 3 }}>
        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
        >
          6. Parcels Damaged in Transit
        </Typography>
        <Typography variant="body2" gutterBottom>
          If you find a parcel is damaged in transit, if possible, please reject
          the parcel from the courier and get in touch with our customer
          service. If the parcel has been delivered without you being present,
          please contact customer service with the next steps.
        </Typography>
      </Box>

      <Box sx={{ mb: 5, p: 3 }}>
        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
        >
          7. Duties & Taxes
        </Typography>
        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
          sx={{ mt: 2 }}
        >
          7.1 GST Tax
        </Typography>
        <Typography variant="body2" gutterBottom>
          GST tax has already been applied to the price of the goods as
          displayed on the website
        </Typography>

        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
          sx={{ mt: 2 }}
        >
          7.2 Import Duties & Taxes
        </Typography>
        <Typography variant="body2" gutterBottom>
          Import duties and taxes for international shipments will be pre-paid,
          without any additional fees to be paid by the customer upon arrival in
          the destination country
        </Typography>
      </Box>

      <Box sx={{ mb: 5, p: 3 }}>
        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
        >
          8. Cancellations
        </Typography>
        <Typography variant="body2" gutterBottom>
          If you change your mind before you have received your order, we are
          able to accept cancellations at any time on the same day of Order
          placed. If an order has already been dispatched, please refer to our
          refund policy.
        </Typography>
      </Box>

      <Box sx={{ mb: 5, p: 3 }}>
        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
        >
          9. Insurance
        </Typography>
        <Typography variant="body2" gutterBottom>
          Parcels are insured for loss and damage up to the value as stated by
          the courier.
        </Typography>

        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
          sx={{ mt: 2 }}
        >
          9.1 Process for parcel damaged in-transit
        </Typography>
        <Typography variant="body2" gutterBottom>
          We will process a refund or replacement as soon as the courier has
          completed their investigation into the claim.
        </Typography>

        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
          sx={{ mt: 2 }}
        >
          9.2 Process for parcel lost in transit
        </Typography>
        <Typography variant="body2" gutterBottom>
          We will process a refund or replacement as soon as the courier has
          conducted an investigation and deemed the parcel lost.
        </Typography>
      </Box>

      <Box sx={{ mb: 5, p: 3 }}>
        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
        >
          10. Customer Service
        </Typography>
        <Typography variant="body2" gutterBottom>
          For all customer service inquiries, please email us at:
        </Typography>
        <ul style={{ paddingLeft: "1.5rem", marginTop: "1rem" }}>
          <li>
            <Typography variant="body2" gutterBottom>
              <strong>Email:</strong> care@agronexis.com
            </Typography>
          </li>
        </ul>
      </Box>
    </Container>
  );
};

export default Shipping;
