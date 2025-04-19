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

export default function TermsPage() {
  return (
    <MainLayout>
      <Helmet>
        <title>Terms of Use | GSC Supply Chain News</title>
        <meta
          name="description"
          content="Terms of Use for GSC Supply Chain News - Your trusted source for supply chain insights."
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
              <BreadcrumbPage>Terms of Use</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Use</h1>
          <p className="text-gray-600 mb-6">Last Updated: April 19, 2025</p>

          <div className="prose max-w-none prose-headings:text-[#BB1919] prose-headings:font-bold prose-p:text-gray-700">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using GSC Supply Chain News ("the Service"), you agree to be bound by these Terms of Use. If you disagree with any part of these terms, you do not have permission to access the Service.
            </p>

            <h2>2. Editorial Independence</h2>
            <p>
              GSC Supply Chain News maintains editorial independence in all content published on our platform. We strive to provide accurate, timely, and valuable information to our readers. Our editorial decisions are made independently from our business operations and advertising relationships.
            </p>

            <h2>3. Intellectual Property Rights</h2>
            <p>
              All content published on GSC Supply Chain News, including articles, videos, images, graphics, logos, and other materials, is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, create derivative works of, publicly display, or exploit any content from our Service without explicit written permission from GSC Supply Chain News.
            </p>

            <h2>4. User Accounts</h2>
            <p>
              When you create an account with us, you must provide accurate and complete information. You are responsible for safeguarding the password you use to access the Service and for any activities under your account. We reserve the right to disable any user account if we believe you have violated these Terms of Use.
            </p>

            <h2>5. User Content</h2>
            <p>
              If our Service allows users to post, link, or otherwise make available content, you agree not to post content that is illegal, offensive, threatening, defamatory, or otherwise objectionable. You retain ownership of any content you submit, but you grant GSC Supply Chain News a non-exclusive, royalty-free license to use, reproduce, modify, and display your content in connection with our Service.
            </p>

            <h2>6. Prohibited Activities</h2>
            <p>You agree not to engage in any of the following activities:</p>
            <ul>
              <li>Using the Service for any unlawful purpose or in violation of any laws</li>
              <li>Attempting to interfere with or disrupt the Service or servers</li>
              <li>Impersonating any person or entity</li>
              <li>Collecting or storing personal data about other users without their express permission</li>
              <li>Accessing the Service through automated means without our prior written permission</li>
            </ul>

            <h2>7. External Links</h2>
            <p>
              Our Service may contain links to third-party websites that are not owned or controlled by GSC Supply Chain News. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites. We encourage you to be aware when you leave our Service and to read the terms and privacy statements of other websites.
            </p>

            <h2>8. Service Modifications</h2>
            <p>
              We reserve the right to modify or discontinue, temporarily or permanently, the Service or any part of it with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the Service.
            </p>

            <h2>9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, GSC Supply Chain News shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of, or inability to access or use, the Service. This includes damages for loss of profits, goodwill, data, or other intangible losses.
            </p>

            <h2>10. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which GSC Supply Chain News is established, without regard to its conflict of law provisions.
            </p>

            <h2>11. Changes to Terms</h2>
            <p>
              We reserve the right to update or modify these Terms of Use at any time without prior notice. Your continued use of the Service after any changes to the Terms constitutes your acceptance of the revised Terms.
            </p>

            <h2>12. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p>
              <strong>Email:</strong> legal@gscsupplychainnews.com<br />
              <strong>Address:</strong> 1234 Supply Chain Drive, Logistics Center, NY 10001, USA
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}