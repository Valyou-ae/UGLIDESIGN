export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 space-y-6 text-gray-200">
          <p className="text-sm text-gray-400">Last Updated: December 25, 2025</p>
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
            <p className="mb-4">We collect information you provide directly to us, including:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Account Information:</strong> Name, email address, password when you create an account</li>
              <li><strong>OAuth Information:</strong> Profile information from Google, GitHub, or Apple when you sign in</li>
              <li><strong>Payment Information:</strong> Billing details processed securely through Stripe</li>
              <li><strong>Generated Content:</strong> Images, prompts, and mockups you create</li>
              <li><strong>Usage Data:</strong> How you interact with our service, features used, and generation history</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide, maintain, and improve our AI image generation services</li>
              <li>Process your payments and manage your subscription</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Detect, prevent, and address technical issues and fraudulent activity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Data Storage and Security</h2>
            <p className="mb-4">
              We implement appropriate technical and organizational measures to protect your personal data:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>All data is encrypted in transit using HTTPS/TLS</li>
              <li>Passwords are hashed using industry-standard bcrypt</li>
              <li>Database hosted on secure Neon infrastructure with automatic backups</li>
              <li>Access controls and authentication required for all sensitive operations</li>
              <li>Regular security audits and monitoring</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Data Sharing and Disclosure</h2>
            <p className="mb-4">We do not sell your personal information. We may share your information:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>With Service Providers:</strong> Stripe for payments, Google Gemini for AI generation</li>
              <li><strong>For Legal Reasons:</strong> When required by law or to protect our rights</li>
              <li><strong>With Your Consent:</strong> When you explicitly authorize us to share information</li>
              <li><strong>Public Content:</strong> Images you mark as "public" are visible in our gallery</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Your Rights (GDPR)</h2>
            <p className="mb-4">If you are in the European Economic Area, you have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Erasure:</strong> Request deletion of your personal data</li>
              <li><strong>Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Objection:</strong> Object to processing of your data</li>
              <li><strong>Restriction:</strong> Request restriction of processing</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, contact us at <a href="mailto:privacy@ugli.design" className="text-pink-400 hover:text-pink-300">privacy@ugli.design</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Cookies and Tracking</h2>
            <p className="mb-4">We use cookies and similar technologies to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Keep you signed in (essential cookies)</li>
              <li>Remember your preferences</li>
              <li>Understand how you use our service</li>
              <li>Improve our service based on usage patterns</li>
            </ul>
            <p className="mt-4">
              You can control cookies through your browser settings. Note that disabling cookies may affect functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Data Retention</h2>
            <p>
              We retain your personal data for as long as your account is active or as needed to provide services. 
              When you delete your account, we will delete your personal data within 30 days, except where we are 
              required to retain it for legal obligations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Children's Privacy</h2>
            <p>
              Our service is not intended for children under 13. We do not knowingly collect personal information 
              from children under 13. If you believe we have collected such information, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your own. We ensure 
              appropriate safeguards are in place to protect your data in accordance with this privacy policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">10. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by posting 
              the new policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">11. Contact Us</h2>
            <p className="mb-4">If you have questions about this privacy policy, please contact us:</p>
            <ul className="space-y-2">
              <li><strong>Email:</strong> <a href="mailto:privacy@ugli.design" className="text-pink-400 hover:text-pink-300">privacy@ugli.design</a></li>
              <li><strong>Support:</strong> <a href="mailto:support@ugli.design" className="text-pink-400 hover:text-pink-300">support@ugli.design</a></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
