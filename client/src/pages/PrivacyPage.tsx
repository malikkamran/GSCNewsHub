import React from "react";
import { Helmet } from "react-helmet";
import MainLayout from "@/components/layout/MainLayout";
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
    <MainLayout>
      <Helmet>
        <title>Privacy Policy | GSC Supply Chain News</title>
        <meta
          name="description"
          content="Privacy Policy for GSC Supply Chain News - Learn how we collect, use, and protect your personal information."
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
            <p className="lead">
              At GSC Supply Chain News, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>

            <h2>1. Information We Collect</h2>
            <h3>Personal Information</h3>
            <p>
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul>
              <li>Register for an account</li>
              <li>Subscribe to our newsletter</li>
              <li>Respond to surveys or questionnaires</li>
              <li>Contact us with inquiries</li>
              <li>Participate in promotions or contests</li>
              <li>Comment on articles or engage with our content</li>
            </ul>
            <p>
              This information may include your name, email address, company name, job title, and professional interests.
            </p>

            <h3>Automatically Collected Information</h3>
            <p>
              When you access our website, our servers may automatically log standard data provided by your web browser, such as:
            </p>
            <ul>
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Referring website</li>
              <li>Pages visited</li>
              <li>Time and date of visits</li>
              <li>Time spent on pages</li>
            </ul>

            <h3>Cookies and Similar Technologies</h3>
            <p>
              We use cookies, web beacons, and similar tracking technologies to enhance your experience on our site, analyze usage patterns, and deliver personalized content. You can control cookie settings through your browser preferences.
            </p>

            <h2>2. How We Use Your Information</h2>
            <p>We may use the information we collect for various purposes, including to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Create and manage your account</li>
              <li>Send you newsletters, updates, and promotional materials</li>
              <li>Personalize your experience based on your preferences</li>
              <li>Analyze usage patterns and improve our website</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Protect against unauthorized access and legal liabilities</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>3. Information Sharing and Disclosure</h2>
            <p>
              We may share your information with third parties only in the following circumstances:
            </p>
            <ul>
              <li>With service providers who perform services on our behalf</li>
              <li>To comply with legal obligations</li>
              <li>To protect and defend our rights and property</li>
              <li>With your consent, or at your direction</li>
              <li>In connection with a business transfer (such as a merger, acquisition, or sale of assets)</li>
            </ul>
            <p>
              We do not sell, rent, or trade your personal information to third parties for their marketing purposes without your explicit consent.
            </p>

            <h2>4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h2>5. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
            </p>

            <h2>6. Your Privacy Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul>
              <li>Access to the personal information we hold about you</li>
              <li>Correction of inaccurate or incomplete information</li>
              <li>Deletion of your personal information</li>
              <li>Restriction or objection to processing</li>
              <li>Data portability</li>
              <li>Withdrawal of consent</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information provided at the end of this policy.
            </p>

            <h2>7. Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under the age of 16. We do not knowingly collect or solicit personal information from children. If we learn that we have collected personal information from a child, we will promptly delete it.
            </p>

            <h2>8. Third-Party Websites</h2>
            <p>
              Our website may contain links to third-party websites. This Privacy Policy does not apply to those websites, and we encourage you to review the privacy policies of any third-party sites you visit.
            </p>

            <h2>9. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your country of residence, which may have different data protection laws. We will take appropriate measures to ensure that your personal information receives an adequate level of protection.
            </p>

            <h2>10. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the revised policy on our website.
            </p>

            <h2>11. Contact Us</h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <p>
              <strong>Email:</strong> privacy@gscsupplychainnews.com<br />
              <strong>Address:</strong> 1234 Supply Chain Drive, Logistics Center, NY 10001, USA
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}