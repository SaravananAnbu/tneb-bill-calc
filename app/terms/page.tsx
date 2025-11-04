import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service - TNEB Bill Calculator",
  description: "Terms of Service for TNEB Bill Calculator",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Terms of Service
          </h1>
          
          <div className="prose prose-blue max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: November 4, 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700 mb-4">
                By accessing and using TNEB Bill Calculator ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Description of Service
              </h2>
              <p className="text-gray-700 mb-4">
                TNEB Bill Calculator is a free online tool that provides electricity bill calculations based on Tamil Nadu Electricity Board (TNEB) tariff rates. The Service is provided for informational purposes only.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Accuracy of Information
              </h2>
              <p className="text-gray-700 mb-4">
                While we strive to provide accurate calculations based on current TNEB tariff rates, we make no warranties or guarantees about the accuracy, reliability, or completeness of the information provided. Actual electricity bills may vary based on:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Specific location and regional variations</li>
                <li>Additional charges not included in our calculations</li>
                <li>Changes in TNEB tariff rates</li>
                <li>Meter reading variations</li>
                <li>Government subsidies or special schemes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. User Responsibilities
              </h2>
              <p className="text-gray-700 mb-4">
                You agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Use the Service for lawful purposes only</li>
                <li>Not attempt to interfere with the proper functioning of the Service</li>
                <li>Verify all calculations with official TNEB sources</li>
                <li>Not use the Service for any commercial purpose without permission</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Limitation of Liability
              </h2>
              <p className="text-gray-700 mb-4">
                The Service is provided "as is" without any warranties, express or implied. We shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Intellectual Property
              </h2>
              <p className="text-gray-700 mb-4">
                All content, features, and functionality of the Service are owned by us and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Changes to Terms
              </h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these terms at any time. We will notify users of any material changes by updating the "Last updated" date at the top of this page.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Third-Party Services
              </h2>
              <p className="text-gray-700 mb-4">
                The Service may display advertisements and links to third-party websites. We are not responsible for the content, privacy policies, or practices of any third-party sites.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Contact Information
              </h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us through the information provided on our website.
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
