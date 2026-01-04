"use client"

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Check, Star, Users, Building, Hammer, ShoppingCart, Calculator, Phone, Mail } from "lucide-react"
import { useTranslations } from "@/app/hooks/useTranslations"

type UserRole = "constructor" | "architect" | "supplier"

interface PricingPlan {
  name: string
  price: string
  description: string
  features: string[]
  popular?: boolean
  cta: string
}

export default function PricingPage() {
  const { t } = useTranslations()
  const [selectedRole, setSelectedRole] = useState<UserRole>("constructor")
  const [projectSize, setProjectSize] = useState([50])
  const [orderVolume, setOrderVolume] = useState([100])
  const [teamSize, setTeamSize] = useState([5])
  const [isAnnual, setIsAnnual] = useState(false)

  // Helper function to safely get array from translations
  const getFeaturesArray = (key: string): string[] => {
    try {
      const items = t(key, { returnObjects: true })
      if (Array.isArray(items)) {
        return items as string[]
      }
      return []
    } catch (error) {
      console.error(`Error loading features for ${key}:`, error)
      return []
    }
  }

  // Build pricing plans from translations
  const pricingPlans: Record<UserRole, PricingPlan[]> = useMemo(() => ({
    constructor: [
      {
        name: t("pricing.plans.constructor.starter.name"),
        price: t("pricing.plans.constructor.starter.price"),
        description: t("pricing.plans.constructor.starter.description"),
        features: getFeaturesArray("pricing.plans.constructor.starter.features"),
        cta: t("pricing.plans.constructor.starter.cta"),
      },
      {
        name: t("pricing.plans.constructor.professional.name"),
        price: t("pricing.plans.constructor.professional.price"),
        description: t("pricing.plans.constructor.professional.description"),
        features: getFeaturesArray("pricing.plans.constructor.professional.features"),
        popular: true,
        cta: t("pricing.plans.constructor.professional.cta"),
      },
      {
        name: t("pricing.plans.constructor.enterprise.name"),
        price: t("pricing.plans.constructor.enterprise.price"),
        description: t("pricing.plans.constructor.enterprise.description"),
        features: getFeaturesArray("pricing.plans.constructor.enterprise.features"),
        cta: t("pricing.plans.constructor.enterprise.cta"),
      },
    ],
    architect: [
      {
        name: t("pricing.plans.architect.starter.name"),
        price: t("pricing.plans.architect.starter.price"),
        description: t("pricing.plans.architect.starter.description"),
        features: getFeaturesArray("pricing.plans.architect.starter.features"),
        cta: t("pricing.plans.architect.starter.cta"),
      },
      {
        name: t("pricing.plans.architect.professional.name"),
        price: t("pricing.plans.architect.professional.price"),
        description: t("pricing.plans.architect.professional.description"),
        features: getFeaturesArray("pricing.plans.architect.professional.features"),
        popular: true,
        cta: t("pricing.plans.architect.professional.cta"),
      },
      {
        name: t("pricing.plans.architect.enterprise.name"),
        price: t("pricing.plans.architect.enterprise.price"),
        description: t("pricing.plans.architect.enterprise.description"),
        features: getFeaturesArray("pricing.plans.architect.enterprise.features"),
        cta: t("pricing.plans.architect.enterprise.cta"),
      },
    ],
    supplier: [
      {
        name: t("pricing.plans.supplier.starter.name"),
        price: t("pricing.plans.supplier.starter.price"),
        description: t("pricing.plans.supplier.starter.description"),
        features: getFeaturesArray("pricing.plans.supplier.starter.features"),
        cta: t("pricing.plans.supplier.starter.cta"),
      },
      {
        name: t("pricing.plans.supplier.professional.name"),
        price: t("pricing.plans.supplier.professional.price"),
        description: t("pricing.plans.supplier.professional.description"),
        features: getFeaturesArray("pricing.plans.supplier.professional.features"),
        popular: true,
        cta: t("pricing.plans.supplier.professional.cta"),
      },
      {
        name: t("pricing.plans.supplier.enterprise.name"),
        price: t("pricing.plans.supplier.enterprise.price"),
        description: t("pricing.plans.supplier.enterprise.description"),
        features: getFeaturesArray("pricing.plans.supplier.enterprise.features"),
        cta: t("pricing.plans.supplier.enterprise.cta"),
      },
    ],
  }), [t])

  // Build features from translations
  const features = useMemo(() => [
    { name: t("pricing.features.list.fileUploads"), starter: true, professional: true, enterprise: true },
    { name: t("pricing.features.list.supplierRatings"), starter: false, professional: true, enterprise: true },
    { name: t("pricing.features.list.bulkOrderDeals"), starter: false, professional: true, enterprise: true },
    { name: t("pricing.features.list.dedicatedSupport"), starter: false, professional: false, enterprise: true },
    { name: t("pricing.features.list.analyticsReports"), starter: false, professional: true, enterprise: true },
    { name: t("pricing.features.list.apiAccess"), starter: false, professional: false, enterprise: true },
    { name: t("pricing.features.list.customIntegrations"), starter: false, professional: false, enterprise: true },
    { name: t("pricing.features.list.whiteLabelOptions"), starter: false, professional: false, enterprise: true },
  ], [t])

  // Build testimonials from translations
  const testimonials = useMemo(() => {
    try {
      const items = t("pricing.testimonials.items", { returnObjects: true })
      // Ensure it's always an array
      if (Array.isArray(items)) {
        return items as Array<{
          name: string
          role: string
          content: string
        }>
      }
      // If it's a string (key not found), return empty array
      if (typeof items === 'string') {
        return []
      }
      // Fallback to empty array
      return []
    } catch (error) {
      console.error('Error loading testimonials:', error)
      return []
    }
  }, [t])

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
  }

  // Add rating to testimonials (always set to 5)
  const testimonialsWithRating = testimonials.map(testimonial => ({ 
    ...testimonial, 
    rating: 5 
  }))

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-title font-bold tracking-tight text-slate-900 mb-6">{t("pricing.hero.title")}</h1>
          <p className="text-mid text-slate-600 mb-4">{t("pricing.hero.subtitle")}</p>
          <p className="text-mid text-slate-500 mb-8">
            {t("pricing.hero.description")}
          </p>
          <div className="flex items-center justify-center gap-8 text-small text-slate-600">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span>{t("pricing.hero.stats.projectsCompleted")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span>{t("pricing.hero.stats.verifiedSuppliers")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span>{t("pricing.hero.stats.uptime")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Toggle */}
      <section className="container mx-auto px-4 mb-16">
        <div className="max-w-6xl mx-auto">
          <Tabs value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-12">
              {Object.entries(roleIcons).map(([role, Icon]) => (
                <TabsTrigger key={role} value={role} className="flex items-center gap-2 capitalize">
                  <Icon className="h-4 w-4" />
                  {t(`pricing.roles.${role}`)}
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
                          {t("pricing.plans.mostPopular")}
                        </Badge>
                      )}
                      <CardHeader>
                        <CardTitle className="text-mid">{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                        <div className="text-title font-bold">
                          {plan.price === t("pricing.plans.custom") ? plan.price : `${plan.price}${t("pricing.plans.perMonth")}`}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                              <span className="text-small">{feature}</span>
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
      {/* <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Calculator className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h2 className="text-title font-bold mb-4">Calculate Your Custom Price</h2>
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
                      <div className="text-small text-slate-600">{projectSize[0].toLocaleString()} sq ft</div>
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
                      <div className="text-small text-slate-600">{orderVolume[0]} orders/month</div>
                    </div>

                    <div>
                      <Label className="text-base font-medium mb-4 block">Team Size</Label>
                      <Slider value={teamSize} onValueChange={setTeamSize} max={50} min={1} step={1} className="mb-2" />
                      <div className="text-small text-slate-600">{teamSize[0]} team members</div>
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
                    <h3 className="text-mid font-bold mb-4">Your Estimated Cost</h3>
                    <div className="text-title font-bold text-amber-600 mb-2">
                      ${calculateEstimatedCost()}
                      {isAnnual ? "/year" : "/month"}
                    </div>
                    {isAnnual && (
                      <div className="text-small text-green-600 mb-4">
                        Save ${Math.round(calculateEstimatedCost() * 12 * 0.2)} annually
                      </div>
                    )}
                    <div className="space-y-2 text-small text-slate-600 mb-6">
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
      </section> */}

      {/* Feature Comparison Matrix */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-title font-bold text-center mb-12">{t("pricing.features.title")}</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">{t("pricing.features.table.feature")}</th>
                    <th className="text-center p-4 font-medium">{t("pricing.features.table.starter")}</th>
                    <th className="text-center p-4 font-medium">{t("pricing.features.table.professional")}</th>
                    <th className="text-center p-4 font-medium">{t("pricing.features.table.enterprise")}</th>
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
            <h2 className="text-title font-bold text-center mb-12">{t("pricing.faq.title")}</h2>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1">
                <AccordionTrigger>{t("pricing.faq.items.changePlans.question")}</AccordionTrigger>
                <AccordionContent>
                  {t("pricing.faq.items.changePlans.answer")}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>{t("pricing.faq.items.billing.question")}</AccordionTrigger>
                <AccordionContent>
                  {t("pricing.faq.items.billing.answer")}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>{t("pricing.faq.items.volumeDiscounts.question")}</AccordionTrigger>
                <AccordionContent>
                  {t("pricing.faq.items.volumeDiscounts.answer")}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>{t("pricing.faq.items.paymentMethods.question")}</AccordionTrigger>
                <AccordionContent>
                  {t("pricing.faq.items.paymentMethods.answer")}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>{t("pricing.faq.items.freeTrial.question")}</AccordionTrigger>
                <AccordionContent>
                  {t("pricing.faq.items.freeTrial.answer")}
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
            <h2 className="text-title font-bold text-center mb-12">{t("pricing.testimonials.title")}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonialsWithRating.map((testimonial, index) => (
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
                      <div className="text-small text-slate-500">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <div className="flex items-center justify-center gap-8 text-small text-slate-600 mb-8">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  <span>{t("pricing.testimonials.stats.trustedCompanies")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span>{t("pricing.testimonials.stats.averageRating")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>{t("pricing.testimonials.stats.activeUsers")}</span>
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
            <h2 className="text-title font-bold mb-6">{t("pricing.cta.title")}</h2>
            <p className="text-mid mb-8 text-amber-100">
              {t("pricing.cta.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-white text-amber-600 hover:bg-slate-100 px-8">
                {t("pricing.cta.getStarted")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-amber-600 px-8 bg-transparent"
              >
                {t("pricing.cta.requestDemo")}
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-8 text-amber-100">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{t("pricing.cta.bookConsultation")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{t("pricing.cta.seePricingDetails")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
