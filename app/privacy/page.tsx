import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - TNEB Bill Calculator",
  description: "Privacy Policy for TNEB Bill Calculator",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Privacy Policy
          </h1>
          
          <div className="prose prose-blue max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: November 4, 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-700 mb-4">
                Welcome to TNEB Bill Calculator ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your information when you use our Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Information We Collect
              </h2>
              <p className="text-gray-700 mb-4">
                <strong>2.1 Information You Provide</strong>
              </p>
              <p className="text-gray-700 mb-4">
                When you use our calculator, you provide:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Electricity consumption units (kWh)</li>
                <li>Usage type (domestic or commercial)</li>
              </ul>
              <p className="text-gray-700 mb-4">
                This information is processed locally in your browser and is not stored on our servers.
              </p>

              <p className="text-gray-700 mb-4">
                <strong>2.2 Automatically Collected Information</strong>
              </p>
              <p className="text-gray-700 mb-4">
                We may automatically collect certain information when you visit our Service:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>IP address</li>
                <li>Pages visited and time spent</li>
                <li>Referring website</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-gray-700 mb-4">
                We use the collected information to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Provide and maintain our Service</li>
                <li>Improve and optimize the Service</li>
                <li>Analyze usage patterns and trends</li>
                <li>Detect and prevent technical issues</li>
                <li>Display relevant advertisements (if applicable)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Cookies and Tracking Technologies
              </h2>
              <p className="text-gray-700 mb-4">
                We may use cookies and similar tracking technologies to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Remember your preferences</li>
                <li>Understand how you use the Service</li>
                <li>Serve relevant advertisements through Google AdSense</li>
              </ul>
              <p className="text-gray-700 mb-4">
                You can control cookies through your browser settings. However, disabling cookies may affect the functionality of the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Third-Party Services
              </h2>
              <p className="text-gray-700 mb-4">
                <strong>5.1 Google AdSense</strong>
              </p>
              <p className="text-gray-700 mb-4">
                We may use Google AdSense to display advertisements. Google AdSense uses cookies to serve ads based on your prior visits to our website or other websites. You can opt out of personalized advertising by visiting Google's Ads Settings.
              </p>
              
              <p className="text-gray-700 mb-4">
                <strong>5.2 Analytics</strong>
              </p>
              <p className="text-gray-700 mb-4">
                We may use analytics services to understand how visitors use our Service. These services may collect information about your device and usage patterns.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Data Security
              </h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational measures to protect your information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Data Retention
              </h2>
              <p className="text-gray-700 mb-4">
                Since we process your calculation data locally in your browser, we do not retain this information on our servers. Automatically collected information may be retained for as long as necessary for the purposes outlined in this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Your Rights
              </h2>
              <p className="text-gray-700 mb-4">
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Right to access your personal information</li>
                <li>Right to correct inaccurate information</li>
                <li>Right to delete your information</li>
                <li>Right to object to processing</li>
                <li>Right to data portability</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Children's Privacy
              </h2>
              <p className="text-gray-700 mb-4">
                Our Service is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Changes to This Privacy Policy
              </h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. Contact Us
              </h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy, please contact us through the information provided on our website.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link 
              href="/"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              ← Back to Calculator
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
