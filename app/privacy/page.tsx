import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-6">&larr; Back</Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: February 2026</p>
        </div>

        {/* Content */}
        <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">1. Introduction</h2>
            <p>
              Evora events ("we", "our", or "us") operates the Evora events website and mobile application (the "Platform"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Platform and the choices you have associated with that data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">2. Information Collection and Use</h2>
            <p>
              We collect several different types of information for various purposes to provide and improve our Platform:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Personal Data:</strong> Name, email address, phone number, address</li>
              <li><strong>Payment Information:</strong> Credit card details, GCash account info, PayMaya details (processed securely)</li>
              <li><strong>Usage Data:</strong> Browser type, IP address, pages visited, time spent</li>
              <li><strong>Location Data:</strong> City/region preferences for event searches</li>
              <li><strong>Communication Data:</strong> Messages between customers and service providers</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">3. Use of Data</h2>
            <p>Evora events uses the collected data for various purposes:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>To provide and maintain our Platform</li>
              <li>To notify you about changes to our Platform</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information to improve our Platform</li>
              <li>To monitor the usage of our Platform</li>
              <li>To detect, prevent and address technical and security issues</li>
              <li>To process payments securely</li>
              <li>To send promotional communications (with your consent)</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">4. Security of Data</h2>
            <p>
              The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">5. Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our Platform. Cookies are files with small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">6. Service Providers</h2>
            <p>
              We may employ third party companies and individuals to facilitate our Platform, provide the Platform on our behalf, or assist us in analyzing how our Platform is used. These third parties have access to your personal data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">7. Payment Processing</h2>
            <p>
              Payment information is processed securely through our payment gateway partners. We do not store full credit card details on our servers. All payment transactions are encrypted and comply with PCI DSS standards.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">8. Links to Other Sites</h2>
            <p>
              Our Platform may contain links to other sites that are not operated by us. This Privacy Policy applies only to our Platform, and we are not responsible for the privacy practices of other sites. We encourage you to review the privacy statements of any other site before providing your personal data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">9. Children's Privacy</h2>
            <p>
              Our Platform is not addressed to children under the age of 18. We do not knowingly collect personally identifiable information from children under 18. If we become aware that a child under 18 has provided us with personal data, we will take steps to delete such information and terminate the child's account.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">10. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "effective date" at the top of this Privacy Policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">11. Your Rights</h2>
            <p>Depending on your location, you may have the following rights:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>The right to access your personal data</li>
              <li>The right to correct inaccurate data</li>
              <li>The right to request deletion of your data</li>
              <li>The right to restrict processing of your data</li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent</li>
              <li>The right to lodge a complaint with a supervisory authority</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">12. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-semibold">Evora events Data Protection Officer</p>
              <p>Email: privacy@Evora events.com</p>
              <p>Phone: +63 (2) 1234-5678</p>
              <p>Address: Manila, Philippines</p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-border">
          <Link href="/terms" className="text-blue-600 hover:underline">
            Read our Terms and Conditions
          </Link>
        </div>
      </div>
    </div>
  )
}
