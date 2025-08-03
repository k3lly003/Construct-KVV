"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Check, Star, Users, Building, Hammer, ShoppingCart, Calculator, Phone, Mail } from "lucide-react"

type UserRole = "constructor" | "architect" | "supplier" | "buyer"

interface PricingPlan {
  name: string
  price: string
  description: string
  features: string[]
  popular?: boolean
  cta: string
}

const pricingPlans: Record<UserRole, PricingPlan[]> = {
  constructor: [
    {
      name: "Starter",
      price: "$29",
      description: "Perfect for individual contractors and small teams",
      features: [
        "Up to 3 active projects",
        "Basic supplier directory",
        "Standard support",
        "Mobile app access",
        "Basic analytics",
      ],
      cta: "Start Building",
    },
    {
      name: "Professional",
      price: "$79",
      description: "Ideal for growing construction companies",
      features: [
        "Unlimited projects",
        "Premium supplier network",
        "Priority support",
        "Advanced project management",
        "Team collaboration tools",
        "Custom reporting",
      ],
      popular: true,
      cta: "Try Free",
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large construction firms with complex needs",
      features: [
        "Everything in Professional",
        "Dedicated account manager",
        "Custom integrations",
        "White-label options",
        "Advanced security",
        "SLA guarantee",
      ],
      cta: "Contact Sales",
    },
  ],
  architect: [
    {
      name: "Starter",
      price: "$39",
      description: "For independent architects and small studios",
      features: [
        "Up to 5 design projects",
        "Material specification tools",
        "Basic 3D visualization",
        "Client collaboration portal",
        "Standard support",
      ],
      cta: "Start Designing",
    },
    {
      name: "Professional",
      price: "$99",
      description: "Perfect for established architectural firms",
      features: [
        "Unlimited design projects",
        "Advanced visualization suite",
        "Supplier integration",
        "Team collaboration",
        "Client presentation tools",
        "Advanced analytics",
      ],
      popular: true,
      cta: "Try Free",
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large architectural practices",
      features: [
        "Everything in Professional",
        "Custom workflow automation",
        "API access",
        "Dedicated support",
        "Advanced security",
        "Multi-office management",
      ],
      cta: "Contact Sales",
    },
  ],
  supplier: [
    {
      name: "Starter",
      price: "$49",
      description: "For small suppliers and local vendors",
      features: [
        "Product catalog (up to 100 items)",
        "Basic storefront",
        "Order management",
        "Payment processing",
        "Standard support",
      ],
      cta: "Start Selling",
    },
    {
      name: "Professional",
      price: "$149",
      description: "For established suppliers and distributors",
      features: [
        "Unlimited product catalog",
        "Premium storefront",
        "Bulk order management",
        "Advanced analytics",
        "Marketing tools",
        "Priority listing",
      ],
      popular: true,
      cta: "Try Free",
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large suppliers and manufacturers",
      features: [
        "Everything in Professional",
        "Custom pricing tiers",
        "API integration",
        "Dedicated account manager",
        "White-label marketplace",
        "Advanced reporting",
      ],
      cta: "Contact Sales",
    },
  ],
  buyer: [
    {
      name: "Starter",
      price: "$19",
      description: "For individual buyers and small projects",
      features: [
        "Access to supplier network",
        "Basic price comparison",
        "Order tracking",
        "Mobile app",
        "Standard support",
      ],
      cta: "Start Shopping",
    },
    {
      name: "Professional",
      price: "$59",
      description: "For procurement managers and large projects",
      features: [
        "Advanced supplier search",
        "Bulk ordering discounts",
        "Procurement analytics",
        "Team management",
        "Priority support",
        "Custom reporting",
      ],
      popular: true,
      cta: "Try Free",
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations with complex procurement",
      features: [
        "Everything in Professional",
        "Custom approval workflows",
        "ERP integration",
        "Dedicated support",
        "Advanced security",
        "Volume discounts",
      ],
      cta: "Contact Sales",
    },
  ],
}

const features = [
  { name: "File uploads", starter: true, professional: true, enterprise: true },
  { name: "Supplier ratings", starter: false, professional: true, enterprise: true },
  { name: "Bulk order deals", starter: false, professional: true, enterprise: true },
  { name: "Dedicated support", starter: false, professional: false, enterprise: true },
  { name: "Analytics reports", starter: false, professional: true, enterprise: true },
  { name: "API access", starter: false, professional: false, enterprise: true },
  { name: "Custom integrations", starter: false, professional: false, enterprise: true },
  { name: "White-label options", starter: false, professional: false, enterprise: true },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Project Manager, BuildCorp",
    content: "This platform has streamlined our procurement process by 60%. The supplier network is incredible.",
    rating: 5,
  },
  {
    name: "Mike Chen",
    role: "Architect, Design Studio",
    content: "The visualization tools and material specifications have transformed how we work with clients.",
    rating: 5,
  },
  {
    name: "Lisa Rodriguez",
    role: "Supplier, Materials Plus",
    content: "We've seen a 40% increase in orders since joining the platform. The analytics are game-changing.",
    rating: 5,
  },
]

export default function PricingPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("constructor")
  const [projectSize, setProjectSize] = useState([50])
  const [orderVolume, setOrderVolume] = useState([100])
  const [teamSize, setTeamSize] = useState([5])
  const [isAnnual, setIsAnnual] = useState(false)

  const calculateEstimatedCost = () => {
    const basePrice =
      selectedRole === "constructor" ? 79 : selectedRole === "architect" ? 99 : selectedRole === "supplier" ? 149 : 59
    const projectMultiplier = projectSize[0] / 50
    const volumeMultiplier = orderVolume[0] / 100
    const teamMultiplier = teamSize[0] / 5

    const monthlyPrice = Math.round((basePrice * (projectMultiplier + volumeMultiplier + teamMultiplier)) / 3)
    return isAnnual ? Math.round(monthlyPrice * 10) : monthlyPrice
  }

  const roleIcons = {
    constructor: Hammer,
    architect: Building,
    supplier: ShoppingCart,
    buyer: Users,
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 mb-6">Flexible Pricing For Every Project</h1>
          <p className="text-xl text-slate-600 mb-4">Transparent. Reliable. Built For Construction.</p>
          <p className="text-lg text-slate-500 mb-8">
            Whether you&apos;re a supplier, contractor, architect, or project owner, choose a plan tailored to your needs.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span>10,000+ Projects Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span>500+ Verified Suppliers</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span>99.9% Uptime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Toggle */}
      <section className="container mx-auto px-4 mb-16">
        <div className="max-w-6xl mx-auto">
          <Tabs value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-12">
              {Object.entries(roleIcons).map(([role, Icon]) => (
                <TabsTrigger key={role} value={role} className="flex items-center gap-2 capitalize">
                  <Icon className="h-4 w-4" />
                  {role}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(pricingPlans).map(([role, plans]) => (
              <TabsContent key={role} value={role}>
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                  {plans.map((plan, index) => (
                    <Card
                      key={index}
                      className={`relative ${plan.popular ? "border-2 border-amber-500 shadow-lg" : ""}`}
                    >
                      {plan.popular && (
                        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-500">
                          Most Popular
                        </Badge>
                      )}
                      <CardHeader>
                        <CardTitle className="text-2xl">{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                        <div className="text-4xl font-bold">
                          {plan.price === "Custom" ? plan.price : `${plan.price}/mo`}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className={`w-full ${plan.popular ? "bg-amber-600 hover:bg-amber-700" : ""}`}
                          variant={plan.popular ? "default" : "outline"}
                        >
                          {plan.cta}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Interactive Cost Calculator */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Calculator className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Calculate Your Custom Price</h2>
              <p className="text-slate-600">Get an instant estimate based on your specific needs</p>
            </div>

            <Card>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <Label className="text-base font-medium mb-4 block">Project Size (sq ft)</Label>
                      <Slider
                        value={projectSize}
                        onValueChange={setProjectSize}
                        max={1000}
                        min={10}
                        step={10}
                        className="mb-2"
                      />
                      <div className="text-sm text-slate-600">{projectSize[0].toLocaleString()} sq ft</div>
                    </div>

                    <div>
                      <Label className="text-base font-medium mb-4 block">Monthly Order Volume</Label>
                      <Slider
                        value={orderVolume}
                        onValueChange={setOrderVolume}
                        max={1000}
                        min={10}
                        step={10}
                        className="mb-2"
                      />
                      <div className="text-sm text-slate-600">{orderVolume[0]} orders/month</div>
                    </div>

                    <div>
                      <Label className="text-base font-medium mb-4 block">Team Size</Label>
                      <Slider value={teamSize} onValueChange={setTeamSize} max={50} min={1} step={1} className="mb-2" />
                      <div className="text-sm text-slate-600">{teamSize[0]} team members</div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Label className="text-base font-medium">Billing:</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant={!isAnnual ? "default" : "outline"}
                          size="sm"
                          onClick={() => setIsAnnual(false)}
                        >
                          Monthly
                        </Button>
                        <Button variant={isAnnual ? "default" : "outline"} size="sm" onClick={() => setIsAnnual(true)}>
                          Annual (Save 20%)
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-4">Your Estimated Cost</h3>
                    <div className="text-4xl font-bold text-amber-600 mb-2">
                      ${calculateEstimatedCost()}
                      {isAnnual ? "/year" : "/month"}
                    </div>
                    {isAnnual && (
                      <div className="text-sm text-green-600 mb-4">
                        Save ${Math.round(calculateEstimatedCost() * 12 * 0.2)} annually
                      </div>
                    )}
                    <div className="space-y-2 text-sm text-slate-600 mb-6">
                      <div>✓ All Professional features included</div>
                      <div>✓ Priority support</div>
                      <div>✓ Advanced analytics</div>
                      <div>✓ Team collaboration tools</div>
                    </div>
                    <Button className="w-full bg-amber-600 hover:bg-amber-700">Get Started Now</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Comparison Matrix */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Compare Features</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Feature</th>
                    <th className="text-center p-4 font-medium">Starter</th>
                    <th className="text-center p-4 font-medium">Professional</th>
                    <th className="text-center p-4 font-medium">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature, index) => (
                    <tr key={index} className="border-b hover:bg-slate-50">
                      <td className="p-4">{feature.name}</td>
                      <td className="text-center p-4">
                        {feature.starter ? (
                          <Check className="h-5 w-5 text-green-600 mx-auto" />
                        ) : (
                          <span className="text-slate-400">–</span>
                        )}
                      </td>
                      <td className="text-center p-4">
                        {feature.professional ? (
                          <Check className="h-5 w-5 text-green-600 mx-auto" />
                        ) : (
                          <span className="text-slate-400">–</span>
                        )}
                      </td>
                      <td className="text-center p-4">
                        {feature.enterprise ? (
                          <Check className="h-5 w-5 text-green-600 mx-auto" />
                        ) : (
                          <span className="text-slate-400">–</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I change plans?</AccordionTrigger>
                <AccordionContent>
                  You can upgrade or downgrade your plan at any time from your account settings. Changes take effect
                  immediately, and we&apos;ll prorate any billing differences.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How does billing work for e-commerce orders?</AccordionTrigger>
                <AccordionContent>
                  We charge a small transaction fee (2.9% + $0.30) for each successful order processed through our
                  platform. This covers payment processing and platform maintenance.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Are there volume discounts for large projects?</AccordionTrigger>
                <AccordionContent>
                  Yes! Enterprise customers receive custom pricing based on their volume and specific needs. Contact our
                  sales team to discuss volume discounts and custom arrangements.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                <AccordionContent>
                  We accept all major credit cards, ACH transfers, and wire transfers for Enterprise customers. All
                  payments are processed securely through our encrypted payment system.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>Is there a free trial available?</AccordionTrigger>
                <AccordionContent>
                  Yes! All Professional plans come with a 14-day free trial. No credit card required to start. You can
                  explore all features and decide if it&apos;s right for your business.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-slate-600 mb-4">&quot;{testimonial.content}&quot;</p>
                    <div>
                      <div className="font-medium">{testimonial.name}</div>
                      <div className="text-sm text-slate-500">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <div className="flex items-center justify-center gap-8 text-sm text-slate-600 mb-8">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  <span>Trusted by 1,000+ Companies</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span>4.9/5 Average Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>50,000+ Active Users</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-amber-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Construction Projects?</h2>
            <p className="text-xl mb-8 text-amber-100">
              Join thousands of construction professionals who trust our platform for their projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-white text-amber-600 hover:bg-slate-100 px-8">
                Get Started Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-amber-600 px-8 bg-transparent"
              >
                Request Demo
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-8 text-amber-100">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>Book a Consultation</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>See Pricing Details</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
