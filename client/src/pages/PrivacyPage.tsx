import React from "react";
import { Helmet } from "react-helmet";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="bg-gray-50">
      <Helmet>
        <title>Privacy Policy | GSC Supply Chain News</title>
        <meta
          name="description"
          content="Privacy Policy for GSC Supply Chain News - Learn how we protect your data and privacy."
        />
      </Helmet>

      <div className="container mx-auto py-6 px-4 md:px-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Privacy Policy</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-gray-600 mb-6">Last Updated: April 19, 2025</p>

          <div className="prose max-w-none prose-headings:text-[#BB1919] prose-headings:font-bold prose-p:text-gray-700">
            <h2>1. Introduction</h2>
            <p>
              At GSC Supply Chain News, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>

            <h2>2. Information We Collect</h2>
            <p>We may collect several types of information from and about users of our website, including:</p>
            <ul>
              <li><strong>Personal Data:</strong> Name, email address, mailing address, phone number, company information, job title, and other information you provide when registering, subscribing, or contacting us.</li>
              <li><strong>Account Information:</strong> Login credentials, account preferences, and subscription details.</li>
              <li><strong>Usage Data:</strong> Information about how you use our website, articles you view, time spent on pages, navigation paths, and other interaction data.</li>
              <li><strong>Technical Data:</strong> IP address, browser type and version, device information, operating system, and other technology identifiers.</li>
              <li><strong>Cookie Data:</strong> Information collected through cookies, web beacons, and other tracking technologies (see our Cookie Policy for more details).</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect for various purposes, including to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Process subscriptions, registrations, and transactions</li>
              <li>Personalize your experience and deliver content relevant to your interests</li>
              <li>Send you updates, newsletters, and marketing communications (if you've opted in)</li>
              <li>Respond to your inquiries, comments, or customer service requests</li>
              <li>Monitor and analyze usage patterns and trends to improve our website functionality</li>
              <li>Protect against, identify, and prevent fraud and other unlawful activity</li>
              <li>Comply with our legal obligations and enforce our terms of use</li>
            </ul>

            <h2>4. How We Share Your Information</h2>
            <p>We may share your personal information with:</p>
            <ul>
              <li><strong>Service Providers:</strong> Third-party vendors who provide services on our behalf, such as payment processing, data analysis, email delivery, hosting, and customer service.</li>
              <li><strong>Business Partners:</strong> With your consent, we may share your information with business partners to offer you certain products, services, or promotions.</li>
              <li><strong>Legal Requirements:</strong> When required by law or in response to legal process, to protect our rights, or to protect the safety of our users or the public.</li>
              <li><strong>Corporate Transactions:</strong> In connection with any merger, sale of company assets, financing, or acquisition of all or a portion of our business.</li>
            </ul>

            <h2>5. Your Privacy Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul>
              <li>Access to and copies of your personal data</li>
              <li>Correction of inaccurate or incomplete information</li>
              <li>Deletion of your personal data</li>
              <li>Restriction or objection to processing of your data</li>
              <li>Data portability</li>
              <li>Withdrawal of consent</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the details provided in the "Contact Us" section below.
            </p>

            <h2>6. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect the security of your personal information. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h2>7. International Data Transfers</h2>
            <p>
              Your information may be transferred to, and processed in, countries other than the country in which you reside. These countries may have data protection laws that differ from those in your country. We ensure appropriate safeguards are in place to protect your information when transferred internationally.
            </p>

            <h2>8. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes for which we collected it, including for the purposes of satisfying any legal, accounting, or reporting requirements.
            </p>

            <h2>9. Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under the age of 16. We do not knowingly collect or solicit personal information from children. If we learn that we have collected personal information from a child, we will delete it promptly.
            </p>

            <h2>10. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these websites. We encourage you to read the privacy policies of these third parties before providing any information to them.
            </p>

            <h2>11. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The date at the top of this page indicates when it was last revised. We will notify you of any material changes by posting the new Privacy Policy on this page or by sending you a notification.
            </p>

            <h2>12. Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy, please contact us at:
            </p>
            <p>
              <strong>Email:</strong> privacy@gscsupplychainnews.com<br />
              <strong>Address:</strong> 1234 Supply Chain Drive, Logistics Center, NY 10001, USA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}