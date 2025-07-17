import { Container, Typography, Box } from "@mui/material";
import React from "react";
import { michroma } from "@/styles/fonts";

const TermsOfServices: React.FC = () => {
  return (
    <Container sx={{ mt: 4, mx: 6, mb: 6, justifySelf: "center" }}>
      <Box sx={{ mb: 5, p: 3 }}>
        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
        >
          Terms of Services
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
          Privacy Commitment
        </Typography>
        <Typography variant="body2" gutterBottom>
          We are committed to safeguarding the privacy of our website visitors;
          this policy sets out how we will treat your personal information. Our
          website uses cookies. By using our website and agreeing to this
          policy, you consent to our use of cookies in accordance with the terms
          of this policy.
        </Typography>
      </Box>
      <Box sx={{ mb: 5, p: 3 }}>
        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
        >
          1. What Information Do We Collect?
        </Typography>
        <Typography variant="body2" gutterBottom>
          We may collect, store and use the following kinds of personal
          information:
        </Typography>
        <ul style={{ paddingLeft: "1.5rem", marginTop: "1rem" }}>
          <li>
            <Typography variant="body2" gutterBottom>
              Information about your computer and about your visits to and use
              of this website (including your IP address, geographical location,
              browser type, and version, operating system, referral source,
              length of visit, page views, website navigation)
            </Typography>
          </li>
          <li>
            <Typography variant="body2" gutterBottom>
              Information relating to any transactions carried out between you
              and us on or in relation to this website, including information
              relating to any purchases you make of our goods or services
            </Typography>
          </li>
          <li>
            <Typography variant="body2" gutterBottom>
              Information that you provide to us for the purpose of registering
              with us
            </Typography>
          </li>
          <li>
            <Typography variant="body2" gutterBottom>
              Information that you provide to us for the purpose of subscribing
              to our website services, email notifications, and/or newsletters
            </Typography>
          </li>
          <li>
            <Typography variant="body2" gutterBottom>
              Any other information that you choose to send to us
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
          2. Cookies
        </Typography>
        <Typography variant="body2" gutterBottom>
          A cookie consists of information sent by a web server to a web browser
          and stored by the browser. The information is then sent back to the
          server each time the browser requests a page from the server. This
          enables the webserver to identify and track the web browser.
        </Typography>
        <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
          We may use both &quot;session&quot; cookies and &quot;persistent&quot;
          cookies on the website. We will use the session cookies to keep track
          of you whilst you navigate the website. We will use the persistent
          cookies to enable our website to recognize you when you visit.
        </Typography>
        <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
          Session cookies will be deleted from your computer when you close your
          browser. Persistent cookies will remain stored on your computer until
          deleted, or until they reach a specified expiry date.
        </Typography>
        <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
          We use Google Analytics to analyse the use of this website. Google
          Analytics generates statistical and other information about website
          use by means of cookies, which are stored on users&apos; computers.
        </Typography>
      </Box>
      <Box sx={{ mb: 5, p: 3 }}>
        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
        >
          3. Using Your Personal Information
        </Typography>
        <Typography variant="body2" gutterBottom>
          Personal information submitted to us via this website will be used for
          the purposes specified in this privacy policy or in relevant parts of
          the website. We may use your personal information to:
        </Typography>
        <ul style={{ paddingLeft: "1.5rem", marginTop: "1rem" }}>
          <li>
            <Typography variant="body2" gutterBottom>
              Administer the website
            </Typography>
          </li>
          <li>
            <Typography variant="body2" gutterBottom>
              Improve your browsing experience by personalizing the website
            </Typography>
          </li>
          <li>
            <Typography variant="body2" gutterBottom>
              Enable your use of the services available on the website
            </Typography>
          </li>
          <li>
            <Typography variant="body2" gutterBottom>
              Send to you goods purchased via the website, and supply to you
              services purchased via the website
            </Typography>
          </li>
          <li>
            <Typography variant="body2" gutterBottom>
              Send statements and invoices to you, and collect payments from you
            </Typography>
          </li>
          <li>
            <Typography variant="body2" gutterBottom>
              Send you general (non-marketing) commercial communications
            </Typography>
          </li>
          <li>
            <Typography variant="body2" gutterBottom>
              Send you email notifications that you have specifically requested
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
          4. Disclosures
        </Typography>
        <Typography variant="body2" gutterBottom>
          We may disclose information about you to any of our employees,
          officers, agents, suppliers, or subcontractors insofar as reasonably
          necessary for the purposes as set out in this privacy policy. In
          addition, we may disclose your personal information:
        </Typography>
        <ul style={{ paddingLeft: "1.5rem", marginTop: "1rem" }}>
          <li>
            <Typography variant="body2" gutterBottom>
              To the extent that we are required to do so by law
            </Typography>
          </li>
          <li>
            <Typography variant="body2" gutterBottom>
              In connection with any legal proceedings or prospective legal
              proceedings
            </Typography>
          </li>
          <li>
            <Typography variant="body2" gutterBottom>
              In order to establish, exercise, or defend our legal rights
              (including providing information to others for the purposes of
              fraud prevention and reducing credit risk)
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
          5. Security of Your Personal Information
        </Typography>
        <Typography variant="body2" gutterBottom>
          We will take reasonable technical and organizational precautions to
          prevent the loss, misuse, or alteration of your personal information.
          We will store all the personal information you provide on our secure
          (password- and firewall-protected) servers.
        </Typography>
        <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
          All electronic transactions you make to or receive from us will be
          encrypted using SSL technology. Of course, data transmission over the
          internet is inherently insecure, and we cannot guarantee the security
          of data sent over the internet.
        </Typography>
        <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
          You are responsible for keeping your password and user details
          confidential. We will not ask you for your password (except when you
          log in to the website).
        </Typography>
      </Box>
      <Box sx={{ mb: 5, p: 3 }}>
        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
        >
          6. Your Rights
        </Typography>
        <Typography variant="body2" gutterBottom>
          You may instruct us to provide you with any personal information we
          hold about you. Provision of such information will be subject to the
          payment of a fee. We may withhold such personal information to the
          extent permitted by law.
        </Typography>
        <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
          You may instruct us not to process your personal information for
          marketing purposes by email at any time. In practice, you will usually
          either expressly agree in advance to our use of your personal
          information for marketing purposes, or we will provide you with an
          opportunity to opt-out of the use of your personal information for
          marketing purposes.
        </Typography>
      </Box>
      <Box sx={{ mb: 5, p: 3 }}>
        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
        >
          7. Policy Amendments
        </Typography>
        <Typography variant="body2" gutterBottom>
          We may update this privacy policy from time to time by posting a new
          version on our website. You should check this page occasionally to
          ensure you are happy with any changes. We may also notify you of
          changes to our privacy policy by email.
        </Typography>
      </Box>
      <Box sx={{ mb: 5, p: 3 }}>
        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
        >
          8. Your Rights
        </Typography>
        <Typography variant="body2" gutterBottom>
          You may instruct us to provide you with any personal information we
          hold about you. Provision of such information will be subject to the
          payment of a fee. We may withhold such personal information to the
          extent permitted by law.
        </Typography>
        <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
          You may instruct us not to process your personal information for
          marketing purposes by email at any time. In practice, you will usually
          either expressly agree in advance to our use of your personal
          information for marketing purposes, or we will provide you with an
          opportunity to opt-out of the use of your personal information for
          marketing purposes.
        </Typography>
      </Box>
      <Box sx={{ mb: 5, p: 3 }}>
        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
        >
          9. Third Party Websites
        </Typography>
        <Typography variant="body2" gutterBottom>
          The website contains links to other websites. We are not responsible
          for the privacy policies or practices of third-party websites.
        </Typography>
      </Box>
      <Box sx={{ mb: 5, p: 3 }}>
        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
        >
          10. Updating Information
        </Typography>
        <Typography variant="body2" gutterBottom>
          Please let us know if the personal information which we hold about you
          needs to be corrected or updated.
        </Typography>
      </Box>
      <Box sx={{ mb: 5, p: 3 }}>
        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          gutterBottom
        >
          11. Contact Us
        </Typography>
        <Typography variant="body2" gutterBottom>
          If you have any questions about this privacy policy or our treatment
          of your personal information, You can contact us:
        </Typography>
        <ul style={{ paddingLeft: "1.5rem", marginTop: "1rem" }}>
          <li>
            <Typography variant="body2" gutterBottom>
              <strong>By email:</strong> care@agronexis.com
            </Typography>
          </li>
        </ul>
      </Box>
    </Container>
  );
};

export default TermsOfServices;
