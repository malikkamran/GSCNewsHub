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

export default function CookiePage() {
  return (
    <div className="bg-gray-50">
      <Helmet>
        <title>Cookie Policy | GSC Supply Chain News</title>
        <meta
          name="description"
          content="Cookie Policy for GSC Supply Chain News - Learn how we use cookies on our website."
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
              <BreadcrumbPage>Cookie Policy</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Cookie Policy</h1>
          <p className="text-gray-600 mb-6">Last Updated: April 19, 2025</p>

          <div className="prose max-w-none prose-headings:text-[#BB1919] prose-headings:font-bold prose-p:text-gray-700">
            <h2>1. Introduction</h2>
            <p>
              This Cookie Policy explains how GSC Supply Chain News ("we", "us", or "our") uses cookies and similar technologies on our website. By using our website, you consent to the use of cookies as described in this policy.
            </p>

            <h2>2. What Are Cookies?</h2>
            <p>
              Cookies are small text files that are stored on your device (computer, tablet, mobile phone) when you visit a website. They allow the website to recognize your device and remember certain information about your visit, such as your preferences and actions on the site. Cookies are widely used to make websites work more efficiently and provide valuable information to website owners.
            </p>

            <h2>3. Types of Cookies We Use</h2>
            <p>We use the following types of cookies on our website:</p>
            <ul>
              <li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly. They enable basic functions like page navigation, secure areas access, and enable our services to work correctly. These cookies do not collect personal information and cannot be disabled.</li>
              <li><strong>Performance Cookies:</strong> These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. They help us improve the functionality of our website.</li>
              <li><strong>Functionality Cookies:</strong> These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.</li>
              <li><strong>Targeting/Advertising Cookies:</strong> These cookies are used to track visitors across websites to enable publishers to display relevant and engaging advertisements.</li>
              <li><strong>Analytics Cookies:</strong> These cookies help us analyze and understand how you use our website, allowing us to improve its structure and content.</li>
            </ul>

            <h2>4. Specific Cookies We Use</h2>
            <p>The following table provides more detailed information about the specific cookies we use:</p>
            
            <table className="min-w-full border-collapse border border-gray-300 my-4">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2 bg-gray-100">Cookie Name</th>
                  <th className="border border-gray-300 px-4 py-2 bg-gray-100">Purpose</th>
                  <th className="border border-gray-300 px-4 py-2 bg-gray-100">Duration</th>
                  <th className="border border-gray-300 px-4 py-2 bg-gray-100">Type</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">_ga</td>
                  <td className="border border-gray-300 px-4 py-2">Used by Google Analytics to distinguish users</td>
                  <td className="border border-gray-300 px-4 py-2">2 years</td>
                  <td className="border border-gray-300 px-4 py-2">Analytics</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">_gid</td>
                  <td className="border border-gray-300 px-4 py-2">Used by Google Analytics to distinguish users</td>
                  <td className="border border-gray-300 px-4 py-2">24 hours</td>
                  <td className="border border-gray-300 px-4 py-2">Analytics</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">_gat</td>
                  <td className="border border-gray-300 px-4 py-2">Used by Google Analytics to throttle request rate</td>
                  <td className="border border-gray-300 px-4 py-2">1 minute</td>
                  <td className="border border-gray-300 px-4 py-2">Analytics</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">connect.sid</td>
                  <td className="border border-gray-300 px-4 py-2">Session identifier for authentication</td>
                  <td className="border border-gray-300 px-4 py-2">Session</td>
                  <td className="border border-gray-300 px-4 py-2">Essential</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">user_preferences</td>
                  <td className="border border-gray-300 px-4 py-2">Stores user preferences for site customization</td>
                  <td className="border border-gray-300 px-4 py-2">1 year</td>
                  <td className="border border-gray-300 px-4 py-2">Functionality</td>
                </tr>
              </tbody>
            </table>

            <h2>5. Third-Party Cookies</h2>
            <p>
              Some cookies are placed by third parties on our website. These third parties may include analytics providers (like Google Analytics), advertising networks, and social media platforms. These third-party services are outside our control, and their cookies are governed by the third party's privacy policy.
            </p>

            <h2>6. Managing Cookies</h2>
            <p>
              Most web browsers allow you to manage your cookie preferences. You can set your browser to refuse cookies, or to alert you when cookies are being sent. The methods for doing so vary from browser to browser, and from version to version.
            </p>
            <p>
              You can obtain up-to-date information about blocking and deleting cookies via these links:
            </p>
            <ul>
              <li><a href="https://support.google.com/chrome/answer/95647" className="text-[#BB1919] hover:underline">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" className="text-[#BB1919] hover:underline">Mozilla Firefox</a></li>
              <li><a href="https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd" className="text-[#BB1919] hover:underline">Microsoft Edge</a></li>
              <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" className="text-[#BB1919] hover:underline">Safari</a></li>
            </ul>
            <p>
              Please note that restricting cookies may impact the functionality of our website. Disabling cookies will not prevent all tracking; you would need to adjust your privacy settings in your browser for this purpose.
            </p>

            <h2>7. Changes to This Cookie Policy</h2>
            <p>
              We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date. If we make significant changes to this policy, we may provide additional notice, such as a prominent website notice or an email notification.
            </p>

            <h2>8. Contact Us</h2>
            <p>
              If you have any questions about our Cookie Policy, please contact us at:
            </p>
            <p>
              <strong>Email:</strong> info@GSCnews.co
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}