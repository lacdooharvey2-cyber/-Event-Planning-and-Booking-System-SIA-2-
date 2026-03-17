import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-6">&larr; Back</Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Terms and Conditions</h1>
          <p className="text-muted-foreground">Last updated: February 2026</p>
        </div>

        {/* Content */}
        <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">1. Agreement to Terms</h2>
            <p>
              By accessing and using Evora events ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or software) on Evora events for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Modifying or copying the materials</li>
              <li>Using the materials for any commercial purpose or for any public display</li>
              <li>Attempting to decompile or reverse engineer any software contained on Evora events</li>
              <li>Removing any copyright or other proprietary notations from the materials</li>
              <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">3. Disclaimer</h2>
            <p>
              The materials on Evora events are provided on an 'as is' basis. Evora events makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">4. Limitations</h2>
            <p>
              In no event shall Evora events or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Evora events, even if Evora events or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">5. Accuracy of Materials</h2>
            <p>
              The materials appearing on Evora events could include technical, typographical, or photographic errors. Evora events does not warrant that any of the materials on its website are accurate, complete, or current. Evora events may make changes to the materials contained on its website at any time without notice.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">6. Links</h2>
            <p>
              Evora events has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Evora events of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">7. Modifications</h2>
            <p>
              Evora events may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">8. Booking and Payment</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>All bookings made through Evora events are final once payment is processed</li>
              <li>Users are responsible for ensuring accurate booking details</li>
              <li>Cancellations must be made according to the venue's cancellation policy</li>
              <li>Evora events is not responsible for venue or service provider issues</li>
              <li>Refunds will be processed according to the venue's refund policy</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">9. User Responsibilities</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Users must provide accurate and truthful information</li>
              <li>Users are responsible for maintaining confidentiality of their account credentials</li>
              <li>Users agree not to use the platform for illegal or harmful purposes</li>
              <li>Users acknowledge that they are at least 18 years of age</li>
              <li>Users agree to comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">10. Payment Methods</h2>
            <p>
              Evora events accepts payments via Credit/Debit Card, GCash, and PayMaya. All payments are processed securely. Users acknowledge that they have authorized the payment and agree to pay the full amount as specified during checkout.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">11. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of the Philippines, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">12. Contact Information</h2>
            <p>
              If you have any questions about these Terms and Conditions, please contact us at:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-semibold">Evora events Support</p>
              <p>Email: support@Evora events.com</p>
              <p>Phone: +63 (2) 1234-5678</p>
              <p>Address: Manila, Philippines</p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-border">
          <Link href="/privacy" className="text-blue-600 hover:underline">
            Read our Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  )
}
