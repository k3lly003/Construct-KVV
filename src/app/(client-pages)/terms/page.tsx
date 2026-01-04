"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Menu, X, Shield, DollarSign, Briefcase, AlertCircle, CheckCircle, Clock } from "lucide-react"

interface TableOfContentsItem {
    id: string
    title: string
    icon: React.ReactNode
}

const tableOfContents: TableOfContentsItem[] = [
    { id: "overview", title: "Overview", icon: <Briefcase className="w-4 h-4" /> },
    { id: "user-roles", title: "User Roles & Responsibilities", icon: <Shield className="w-4 h-4" /> },
    { id: "safety-liability", title: "Safety & Liability", icon: <AlertCircle className="w-4 h-4" /> },
    { id: "payment-escrow", title: "Payment & Escrow", icon: <DollarSign className="w-4 h-4" /> },
    { id: "verification", title: "Verification & Compliance", icon: <CheckCircle className="w-4 h-4" /> },
    { id: "dispute-resolution", title: "Dispute Resolution", icon: <Briefcase className="w-4 h-4" /> },
    { id: "limitation-liability", title: "Limitation of Liability", icon: <AlertCircle className="w-4 h-4" /> },
    { id: "termination", title: "Termination", icon: <X className="w-4 h-4" /> },
]

export default function TermsAndConditions() {
    const [activeSection, setActiveSection] = useState("overview")
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [lastUpdated] = useState("December 29, 2025")

    useEffect(() => {
        const handleScroll = () => {
            const sections = tableOfContents.map((item) => item.id)
            for (const id of sections) {
                const element = document.getElementById(id)
                if (element) {
                    const rect = element.getBoundingClientRect()
                    if (rect.top <= 100) {
                        setActiveSection(id)
                    }
                }
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: "smooth" })
            setSidebarOpen(false)
        }
    }

    return (
        <main className="min-h-screen bg-background text-foreground flex justify-center">
            <div className="max-w-7xl w-full">
                <div className="flex gap-0">
                    {/* Mobile Floating Menu */}
                    {sidebarOpen && (
                        <div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="fixed bottom-6 right-6 md:hidden z-50 bg-primary text-primary-foreground p-4 rounded-full shadow-lg"
                    >
                        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    {/* Sidebar Navigation */}
                    <aside
                        className={`fixed md:sticky top-0 md:top-20 left-0 h-screen md:h-[calc(100vh-80px)] w-64 md:w-80 bg-card border-r border-border overflow-y-auto transition-transform duration-300 z-40 md:z-10 ${
                            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                        }`}
                    >
                        <nav className="p-6">
                            <h2 className="text-lg font-bold mb-6 text-foreground">Table of Contents</h2>
                            <ul className="space-y-2">
                                {tableOfContents.map((item) => (
                                    <li key={item.id}>
                                        <button
                                            onClick={() => scrollToSection(item.id)}
                                            className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 font-medium ${
                                                activeSection === item.id
                                                    ? "bg-primary text-primary-foreground"
                                                    : "text-foreground hover:bg-muted"
                                            }`}
                                        >
                                            {item.icon}
                                            <span>{item.title}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                        <header className="mb-12">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Terms and Conditions</h1>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                                <Clock className="w-4 h-4" />
                                <span>Last Updated: {lastUpdated}</span>
                            </div>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Welcome to Construction Hub, the premier marketplace for buying and selling construction tools and
                                services. These Terms and Conditions ("Agreement") govern your access to and use of our platform. By
                                accessing or using Construction Hub, you agree to be bound by these terms.
                            </p>
                        </header>

                        {/* Overview Section */}
                        <section id="overview" className="mb-12 scroll-mt-20">
                            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                                <Briefcase className="w-8 h-8 text-primary" />
                                Overview
                            </h2>
                            <p className="text-base leading-relaxed text-foreground mb-4">
                                Construction Hub operates as a neutral third-party marketplace platform. We connect buyers and sellers of
                                construction tools and equipment, and facilitate the booking of construction services including
                                contracting, plumbing, and electrical work. We do not own, manufacture, or distribute the tools listed on
                                our platform, nor do we employ the service providers.
                            </p>
                            <div className="bg-muted p-6 rounded-lg border border-border">
                                <p className="text-sm leading-relaxed">
                                    <strong>Key Point:</strong> Construction Hub acts as a facilitator only. All transactions, products, and
                                    services are provided directly between buyers and sellers/service providers. We are not liable for the
                                    quality, safety, or legality of any tools or services offered on our platform.
                                </p>
                            </div>
                        </section>

                        {/* User Roles Section */}
                        <section id="user-roles" className="mb-12 scroll-mt-20">
                            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                                <Shield className="w-8 h-8 text-primary" />
                                User Roles & Responsibilities
                            </h2>

                            <div className="space-y-8">
                                <div className="border-l-4 border-primary pl-6">
                                    <h3 className="text-xl font-bold mb-3">Tool Sellers</h3>
                                    <ul className="space-y-2 text-base leading-relaxed">
                                        <li className="flex gap-3">
                                            <span className="text-primary font-bold">•</span>
                                            <span>
                      Must provide accurate, complete descriptions of tools, including condition (new/used), defects,
                      and specifications
                    </span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-primary font-bold">•</span>
                                            <span>Responsible for ensuring tools comply with all local, state, and federal regulations</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-primary font-bold">•</span>
                                            <span>Must include clear photographs and honest descriptions of tool condition</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-primary font-bold">•</span>
                                            <span>Agree to deliver items as described within the specified timeframe</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-primary font-bold">•</span>
                                            <span>Must respond to buyer inquiries within 24 hours during business days</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="border-l-4 border-primary pl-6">
                                    <h3 className="text-xl font-bold mb-3">Service Providers</h3>
                                    <ul className="space-y-2 text-base leading-relaxed">
                                        <li className="flex gap-3">
                                            <span className="text-primary font-bold">•</span>
                                            <span>
                      Must maintain valid licenses and insurance for their respective trades (electrical, plumbing,
                      contracting)
                    </span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-primary font-bold">•</span>
                                            <span>Must provide proof of licensing upon verification request</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-primary font-bold">•</span>
                                            <span>Responsible for compliance with all building codes and safety regulations</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-primary font-bold">•</span>
                                            <span>Must provide detailed quotes and scope of work before beginning any service</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-primary font-bold">•</span>
                                            <span>Agreement to complete work within agreed timeframe and maintain worksite safety</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="border-l-4 border-primary pl-6">
                                    <h3 className="text-xl font-bold mb-3">Buyers</h3>
                                    <ul className="space-y-2 text-base leading-relaxed">
                                        <li className="flex gap-3">
                                            <span className="text-primary font-bold">•</span>
                                            <span>
                      Responsible for inspecting tools upon receipt and reporting issues within 5 business days
                    </span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-primary font-bold">•</span>
                                            <span>Must clearly communicate project requirements to service providers</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-primary font-bold">•</span>
                                            <span>Obligated to complete payment upon service delivery or tool receipt as agreed</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-primary font-bold">•</span>
                                            <span>Responsible for ensuring access and site preparation for service providers</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Safety & Liability Section */}
                        <section id="safety-liability" className="mb-12 scroll-mt-20">
                            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                                <AlertCircle className="w-8 h-8 text-primary" />
                                Safety & Liability
                            </h2>

                            <div className="space-y-6 text-base leading-relaxed">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Tool Safety</h3>
                                    <p>
                                        Tool sellers warrant that all tools are safe for their intended use when used in accordance with
                                        manufacturer instructions. Sellers are responsible for disclosing any known defects, recalls, or
                                        safety hazards. Construction Hub is not responsible for injuries or damages resulting from tool
                                        defects, misuse, or failure to follow safety guidelines.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold mb-2">Service Provider Liability</h3>
                                    <p>
                                        Service providers maintain complete liability for their work and must carry appropriate liability
                                        insurance. They are responsible for adhering to all applicable building codes, OSHA regulations, and
                                        industry standards. Construction Hub assumes no liability for work-related injuries, property damage,
                                        or code violations.
                                    </p>
                                </div>

                                <div className="bg-destructive/10 border border-destructive/20 p-6 rounded-lg">
                                    <p className="text-sm leading-relaxed">
                                        <strong>Disclaimer:</strong> Construction Hub does not inspect, verify, or warrant the condition,
                                        safety, or legality of any tools or services. Users assume all risk associated with the purchase and
                                        use of tools and the hiring of service providers. We strongly recommend inspections, background
                                        checks, and verification of credentials before proceeding with transactions.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Payment & Escrow Section */}
                        <section id="payment-escrow" className="mb-12 scroll-mt-20">
                            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                                <DollarSign className="w-8 h-8 text-primary" />
                                Payment & Escrow
                            </h2>

                            <div className="space-y-6 text-base leading-relaxed">
                                <p>
                                    All payments on Construction Hub are processed through our secure escrow system. This protects both
                                    buyers and sellers by holding payment until the transaction is completed to both parties' satisfaction.
                                </p>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold">Payment Process</h3>
                                    <ol className="space-y-3 list-decimal list-inside">
                                        <li>Buyer submits payment through Construction Hub, which is held in escrow</li>
                                        <li>Seller ships the tool or provides the service as agreed</li>
                                        <li>Buyer receives tool or service completion is confirmed</li>
                                        <li>Buyer releases payment from escrow (or disputes within 5 days)</li>
                                        <li>Payment is transferred to seller within 3-5 business days</li>
                                    </ol>
                                </div>

                                <div className="bg-muted p-6 rounded-lg border border-border">
                                    <p className="text-sm">
                                        <strong>Service Deposits:</strong> For service work, Construction Hub may collect a deposit (typically
                                        25-50% of project cost) held in escrow until work completion. The remaining balance is released upon
                                        buyer satisfaction.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold mb-2">Refund Policy</h3>
                                    <p>
                                        Refunds are processed when disputes are resolved in the buyer's favor or when the seller agrees to a
                                        refund. Refunds are returned to the original payment method within 5-7 business days. Construction Hub
                                        may retain a small transaction fee (up to 2%) on refunded amounts.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Verification Section */}
                        <section id="verification" className="mb-12 scroll-mt-20">
                            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                                <CheckCircle className="w-8 h-8 text-primary" />
                                Verification & Compliance
                            </h2>

                            <div className="space-y-6 text-base leading-relaxed">
                                <p>
                                    Construction Hub requires verification for all users, with enhanced verification requirements for
                                    service providers.
                                </p>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold">Service Provider Verification</h3>
                                    <p>All service providers must provide proof of:</p>
                                    <ul className="space-y-2 ml-6">
                                        <li className="flex gap-3">
                                            <span className="text-primary font-bold">✓</span>
                                            <span>Valid trade license (electrical, plumbing, or contracting)</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-primary font-bold">✓</span>
                                            <span>Current liability insurance coverage (minimum $1M for most trades)</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-primary font-bold">✓</span>
                                            <span>Clean background check (no felonies related to fraud or violence)</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-primary font-bold">✓</span>
                                            <span>Valid business registration (if operating as business)</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold">Seller Verification</h3>
                                    <p>All tool sellers must provide:</p>
                                    <ul className="space-y-2 ml-6">
                                        <li className="flex gap-3">
                                            <span className="text-primary font-bold">✓</span>
                                            <span>Valid identification</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-primary font-bold">✓</span>
                                            <span>Address verification</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-primary font-bold">✓</span>
                                            <span>Valid payment method for disbursements</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-muted p-6 rounded-lg border border-border">
                                    <p className="text-sm">
                                        <strong>Compliance Note:</strong> Service providers are fully responsible for obtaining all required
                                        permits and licenses for their jurisdiction. Construction Hub does not guarantee the legality of any
                                        services offered.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Dispute Resolution Section */}
                        <section id="dispute-resolution" className="mb-12 scroll-mt-20">
                            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                                <Briefcase className="w-8 h-8 text-primary" />
                                Dispute Resolution
                            </h2>

                            <div className="space-y-6 text-base leading-relaxed">
                                <p>
                                    Construction Hub provides a structured dispute resolution process to resolve conflicts between users
                                    fairly and efficiently.
                                </p>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold">Dispute Process</h3>
                                    <ol className="space-y-3 ml-6">
                                        <li className="flex gap-3">
                                            <span className="font-bold min-w-fit">1. Direct Negotiation:</span>
                                            <span>
                      Users are encouraged to resolve disputes directly within 3 days of issue. Construction Hub
                      provides a messaging system for communication.
                    </span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="font-bold min-w-fit">2. File a Claim:</span>
                                            <span>
                      If unresolved, the disputing party may file a formal claim with detailed documentation within 5
                      days of the transaction.
                    </span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="font-bold min-w-fit">3. Mediation:</span>
                                            <span>
                      Construction Hub's mediation team reviews the claim and facilitates resolution within 10 business
                      days.
                    </span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="font-bold min-w-fit">4. Arbitration:</span>
                                            <span>
                      If mediation fails, disputes are resolved through binding arbitration. Both parties agree to
                      accept the arbitrator's decision.
                    </span>
                                        </li>
                                    </ol>
                                </div>

                                <div className="bg-muted p-6 rounded-lg border border-border">
                                    <p className="text-sm mb-3">
                                        <strong>Arbitration Clause:</strong> By using Construction Hub, you and the platform agree that any
                                        dispute arising out of or relating to these Terms shall be settled by binding arbitration.
                                    </p>
                                    <p className="text-sm">
                                        You agree to submit disputes to an independent arbitrator rather than pursuing litigation in court.
                                        Arbitration proceedings will be conducted in accordance with JAMS rules.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Limitation of Liability Section */}
                        <section id="limitation-liability" className="mb-12 scroll-mt-20">
                            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                                <AlertCircle className="w-8 h-8 text-primary" />
                                Limitation of Liability
                            </h2>

                            <div className="space-y-6 text-base leading-relaxed">
                                <div className="bg-destructive/10 border border-destructive/20 p-6 rounded-lg">
                                    <p className="text-sm leading-relaxed">
                                        <strong>Disclaimer of Warranties:</strong> Construction Hub provides the platform "AS IS" without any
                                        warranties. We do not warrant that the service will be uninterrupted, error-free, or that any defects
                                        will be corrected. We expressly disclaim all implied warranties including merchantability, fitness for
                                        a particular purpose, and non-infringement.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold mb-3">Liability Cap</h3>
                                    <p>
                                        Construction Hub's total liability to you for any claims arising out of or relating to these Terms
                                        shall not exceed the transaction amount in dispute, or $500, whichever is greater. This limitation
                                        applies to all claims, whether based on warranty, contract, tort, or any other legal theory.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold mb-3">Excluded Damages</h3>
                                    <p className="mb-3">
                                        Construction Hub shall not be liable for any indirect, incidental, special, consequential, or punitive
                                        damages, including:
                                    </p>
                                    <ul className="space-y-2 ml-6">
                                        <li className="flex gap-3">
                                            <span className="text-primary font-bold">•</span>
                                            <span>Loss of profit or revenue</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-primary font-bold">•</span>
                                            <span>Loss of data or business interruption</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-primary font-bold">•</span>
                                            <span>Emotional distress or reputational harm</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-primary font-bold">•</span>
                                            <span>Third-party claims or legal fees</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Termination Section */}
                        <section id="termination" className="mb-12 scroll-mt-20">
                            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                                <X className="w-8 h-8 text-primary" />
                                Termination
                            </h2>

                            <div className="space-y-6 text-base leading-relaxed">
                                <div>
                                    <h3 className="text-xl font-bold mb-3">Termination by You</h3>
                                    <p>
                                        You may terminate your account at any time by logging into your account settings and selecting "Delete
                                        Account." You remain responsible for all pending transactions and disputes.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold mb-3">Termination by Construction Hub</h3>
                                    <p className="mb-3">Construction Hub may terminate or suspend your account if you:</p>
                                    <ul className="space-y-2 ml-6">
                                        <li className="flex gap-3">
                                            <span className="text-primary font-bold">•</span>
                                            <span>Violate any provision of these Terms</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-primary font-bold">•</span>
                                            <span>Fail verification requirements</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-primary font-bold">•</span>
                                            <span>Engage in fraudulent or illegal activity</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-primary font-bold">•</span>
                                            <span>Receive multiple disputes or complaints</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-muted p-6 rounded-lg border border-border">
                                    <p className="text-sm">
                                        <strong>Effect of Termination:</strong> Upon termination, you lose access to your account and any
                                        pending transactions are resolved per our dispute process. Outstanding payments are processed, and any
                                        items in escrow are refunded according to the Dispute Resolution clause.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Footer */}
                        <div className="mt-16 pt-8 border-t border-border">
                            <p className="text-sm text-muted-foreground text-center mb-6">
                                These Terms and Conditions were last updated on {lastUpdated}. Construction Hub reserves the right to
                                modify these terms at any time. Changes are effective immediately upon posting.
                            </p>
                            <div className="text-center text-sm text-muted-foreground">
                                <p>
                                    For questions or concerns, contact us at <strong>legal@constructionhub.com</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
