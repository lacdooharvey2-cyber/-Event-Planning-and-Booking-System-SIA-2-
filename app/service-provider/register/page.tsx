'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { AlertCircle, ArrowLeft } from 'lucide-react'

export default function ServiceProviderRegister() {
  const router = useRouter()
  const { user, signup } = useAuth()
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
    businessName: '',
    serviceType: 'photography',
    phone: '',
    address: '',
    yearsExperience: '',
    portfolio: '',
    certifications: '',
  })

  const serviceTypes = [
    { value: 'photography', label: 'Photography & Videography' },
    { value: 'catering', label: 'Catering & Food Services' },
    { value: 'decoration', label: 'Decoration & Styling' },
    { value: 'entertainment', label: 'Entertainment & Music' },
    { value: 'planning', label: 'Event Planning Services' },
    { value: 'other', label: 'Other Services' },
  ]

  const handleStepOne = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setStep(2)
  }

  const handleStepTwo = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.businessName || !formData.phone || !formData.serviceType) {
      setError('Please fill in all required fields')
      return
    }

    setStep(3)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.yearsExperience || !formData.portfolio) {
      setError('Please fill in all required fields')
      return
    }

    setIsLoading(true)
    try {
      await signup(formData.email, formData.password, formData.name, 'service_provider')
      router.push('/service-provider/dashboard')
    } catch {
      setError('Failed to register. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              1
            </div>
            <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              2
            </div>
            <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              3
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Step {step} of 3: {step === 1 ? 'Account Setup' : step === 2 ? 'Business Information' : 'Professional Details'}
            </p>
          </div>
        </div>

        <Card className="p-8">
          {/* Step 1: Account Setup */}
          {step === 1 && (
            <>
              <h1 className="text-2xl font-bold mb-2">Create Your Service Provider Account</h1>
              <p className="text-muted-foreground mb-6">Join Evora events as a service provider and grow your business</p>

              <form onSubmit={handleStepOne} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}

                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Continue to Business Info
                </Button>
              </form>
            </>
          )}

          {/* Step 2: Business Information */}
          {step === 2 && (
            <>
              <h1 className="text-2xl font-bold mb-2">Business Information</h1>
              <p className="text-muted-foreground mb-6">Tell us about your service business</p>

              <form onSubmit={handleStepTwo} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}

                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    placeholder="e.g., Perfect Moments Photography"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="serviceType">Service Type *</Label>
                  <select
                    id="serviceType"
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background"
                  >
                    {serviceTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+63 XXX XXXX XXX"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Business Address</Label>
                  <Input
                    id="address"
                    placeholder="Street address, city, region"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                    Continue to Professional Details
                  </Button>
                </div>
              </form>
            </>
          )}

          {/* Step 3: Professional Details */}
          {step === 3 && (
            <>
              <h1 className="text-2xl font-bold mb-2">Professional Details</h1>
              <p className="text-muted-foreground mb-6">Showcase your expertise and experience</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}

                <div>
                  <Label htmlFor="yearsExperience">Years of Experience *</Label>
                  <Input
                    id="yearsExperience"
                    type="number"
                    placeholder="e.g., 5"
                    min="0"
                    required
                    value={formData.yearsExperience}
                    onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="portfolio">Portfolio URL / Website *</Label>
                  <Input
                    id="portfolio"
                    type="url"
                    placeholder="https://www.example.com"
                    required
                    value={formData.portfolio}
                    onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Link to your portfolio or social media</p>
                </div>

                <div>
                  <Label htmlFor="certifications">Certifications & Qualifications</Label>
                  <Input
                    id="certifications"
                    placeholder="e.g., Professional Photography Certification, Culinary Arts Diploma"
                    value={formData.certifications}
                    onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                  />
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-900">
                    <span className="font-semibold">✓ Ready to join Evora events!</span> By registering, you agree to our Terms of Service and will be able to manage your service listings and bookings.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
                    {isLoading ? 'Registering...' : 'Complete Registration'}
                  </Button>
                </div>
              </form>
            </>
          )}
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{' '}
          <Link href="/signin" className="text-blue-600 hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
