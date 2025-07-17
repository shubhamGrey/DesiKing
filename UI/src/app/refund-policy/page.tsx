import { Container, Typography, Box } from "@mui/material";
import React from "react";
import { michroma } from "@/styles/fonts";

const Refund: React.FC = () => {
  return (
    <Container sx={{ mt: 4, mx: 6, mb: 6, justifySelf: "center" }}>
      <Box sx={{ mb: 5, p: 3 }}>
        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
        >
          Refund Policy
        </Typography>
        <Typography variant="body2" gutterBottom>
          Last updated: April 23, 2025
        </Typography>
      </Box>

      <Box sx={{ mb: 5, p: 3 }}>
        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
        >
          Return Policy Overview
        </Typography>
        <Typography variant="body2" gutterBottom>
          We have a <strong>2-day return policy</strong>, which means you have{" "}
          <strong>2 days after receiving your item</strong> to request a return
          as part of <strong>Change of Mind facility</strong> (Refer Shipping
          Policy). To be eligible for a return, your item must be in the{" "}
          <strong>same condition that you received it</strong>, unworn or
          unused, with tags, and in its <strong>original packaging</strong>.
          You&apos;ll also need the{" "}
          <strong>receipt or proof of purchase</strong>.
        </Typography>
        <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
          To start a return, you can contact us at{" "}
          <strong>care@agronexis.com</strong>. If your return is accepted,
          we&apos;ll send you a <strong>return shipping label</strong>, as well
          as instructions on how and where to send your package. Items sent back
          to us without first requesting a return will{" "}
          <strong>not be accepted</strong>.
        </Typography>
        <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
          You can always contact us for any return question at{" "}
          <strong>care@agronexis.com</strong>.
        </Typography>
      </Box>

      <Box sx={{ mb: 5, p: 3 }}>
        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
        >
          Damages and Issues
        </Typography>
        <Typography variant="body2" gutterBottom>
          Please <strong>inspect your order upon reception</strong> and contact
          us immediately if the item is <strong>defective, damaged</strong> or
          if you <strong>receive the wrong item</strong>, so that we can
          evaluate the issue and make it right.
        </Typography>
      </Box>

      <Box sx={{ mb: 5, p: 3 }}>
        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
        >
          Exceptions / Non-returnable Items
        </Typography>
        <Typography variant="body2" gutterBottom>
          Certain types of items <strong>cannot be returned</strong>, including:
        </Typography>
        <ul style={{ paddingLeft: "1.5rem", marginTop: "1rem" }}>
          <li>
            <Typography variant="body2" gutterBottom>
              Perishable goods (such as food, flowers, or plants)
            </Typography>
          </li>
          <li>
            <Typography variant="body2" gutterBottom>
              Custom products (such as special orders or personalized items)
            </Typography>
          </li>
          <li>
            <Typography variant="body2" gutterBottom>
              Personal care goods (such as beauty products)
            </Typography>
          </li>
          <li>
            <Typography variant="body2" gutterBottom>
              Hazardous materials, flammable liquids, or gases
            </Typography>
          </li>
          <li>
            <Typography variant="body2" gutterBottom>
              Sale items or gift cards
            </Typography>
          </li>
        </ul>
        <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
          Please get in touch if you have questions or concerns about your
          specific item.
        </Typography>
      </Box>

      <Box sx={{ mb: 5, p: 3 }}>
        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
        >
          Exchanges
        </Typography>
        <Typography variant="body2" gutterBottom>
          The fastest way to ensure you get what you want is to return the item
          you have, and once the return is accepted, make a separate purchase
          for the new item.
        </Typography>
      </Box>

      <Box sx={{ mb: 5, p: 3 }}>
        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
        >
          Refunds
        </Typography>
        <Typography variant="body2" gutterBottom>
          We will notify you once we&apos;ve{" "}
          <strong>received and inspected your return</strong>, and let you know
          if the <strong>refund was approved or not</strong>. If approved,
          you&apos;ll be{" "}
          <strong>
            automatically refunded on your original payment method
          </strong>
          .
        </Typography>
        <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
          Please remember it can take some time for your{" "}
          <strong>
            bank or credit card company to process and post the refund
          </strong>{" "}
          too.
        </Typography>
      </Box>

      <Box sx={{ mb: 5, p: 3 }}>
        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
        >
          Contact Us
        </Typography>
        <Typography variant="body2" gutterBottom>
          If you have any questions about our refund policy, You can contact us:
        </Typography>
        <ul style={{ paddingLeft: "1.5rem", marginTop: "1rem" }}>
          <li>
            <Typography variant="body2" gutterBottom>
              <strong>By email:</strong> <strong>care@agronexis.com</strong>
            </Typography>
          </li>
        </ul>
      </Box>
    </Container>
  );
};

export default Refund;
