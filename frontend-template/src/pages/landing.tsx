import { Button } from "@/components/ui/button"
import { ArrowRight, Check, Zap, Shield, BarChart3, Users, Star, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
    {
        icon: Zap,
        title: "Lightning Fast",
        description: "Deploy in seconds, not hours. Our infrastructure scales instantly.",
    },
    {
        icon: Shield,
        title: "Bank-Grade Security",
        description: "End-to-end encryption with SOC2 compliance built in.",
    },
    {
        icon: BarChart3,
        title: "Deep Analytics",
        description: "Real-time insights that actually move the needle.",
    },
    {
        icon: Users,
        title: "Team Collaboration",
        description: "Built for teams of 2 or 2,000. Everyone stays in sync.",
    },
]

const testimonials = [
    {
        quote: "Switched from legacy tools and saved 40 hours a week. Not exaggerating.",
        author: "Sarah Chen",
        role: "CTO, Runway",
        avatar: "SC",
    },
    {
        quote: "The only platform that actually delivers on its promises.",
        author: "Marcus Webb",
        role: "Founder, Stackwise",
        avatar: "MW",
    },
    {
        quote: "Our team productivity doubled in the first month.",
        author: "Elena Ruiz",
        role: "VP Engineering, Lattice",
        avatar: "ER",
    },
]

const pricingTiers = [
    {
        name: "Starter",
        price: "0",
        description: "Perfect for side projects",
        features: ["5 team members", "10GB storage", "Basic analytics", "Email support"],
        cta: "Start Free",
        highlighted: false,
    },
    {
        name: "Pro",
        price: "49",
        description: "For growing teams",
        features: ["Unlimited members", "100GB storage", "Advanced analytics", "Priority support", "Custom integrations", "API access"],
        cta: "Start Trial",
        highlighted: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "For serious scale",
        features: ["Everything in Pro", "Unlimited storage", "Dedicated support", "SLA guarantee", "Custom contracts", "On-premise option"],
        cta: "Contact Sales",
        highlighted: false,
    },
]

const stats = [
    { value: "50K+", label: "Active Teams" },
    { value: "99.9%", label: "Uptime" },
    { value: "2.5M", label: "Tasks Completed" },
    { value: "<100ms", label: "Response Time" },
]

function Landing() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
            {/* Grain overlay */}
            <div
                className="fixed inset-0 pointer-events-none z-50 opacity-[0.015]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-[#0a0a0a]/80 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#c8ff00] rotate-45" />
                        <span className="font-clash font-bold text-xl tracking-tight">BaoLT</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                        <a href="#testimonials" className="hover:text-white transition-colors">Customers</a>
                        <a href="#" className="hover:text-white transition-colors">Docs</a>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/5">
                            Sign In
                        </Button>
                        <Button className="bg-[#c8ff00] text-black hover:bg-[#d4ff33] font-semibold">
                            Get Started
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 px-6">
                {/* Background elements */}
                <div className="absolute top-20 right-0 w-150 h-150 bg-[#c8ff00]/10 rounded-full blur-[150px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-100 h-100 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto relative">
                    {/* Announcement banner */}
                    <div className="flex justify-center mb-8 animate-fade-in">
                        <a
                            href="#"
                            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-white/70 hover:border-[#c8ff00]/50 hover:bg-[#c8ff00]/5 transition-all"
                        >
                            <span className="px-2 py-0.5 rounded-full bg-[#c8ff00] text-black text-xs font-semibold">NEW</span>
                            Introducing AI-powered workflows
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </a>
                    </div>

                    {/* Main headline */}
                    <div className="text-center max-w-5xl mx-auto">
                        <h1
                            className="font-clash font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.9] mb-6 animate-fade-in-up"
                            style={{ animationDelay: '100ms' }}
                        >
                            Build products
                            <br />
                            <span className="text-[#c8ff00]">10x faster</span>
                        </h1>

                        <p
                            className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up"
                            style={{ animationDelay: '200ms' }}
                        >
                            The modern platform for teams who ship. Streamline workflows,
                            automate the boring stuff, and focus on what matters.
                        </p>

                        <div
                            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
                            style={{ animationDelay: '300ms' }}
                        >
                            <Button
                                size="lg"
                                className="bg-[#c8ff00] text-black hover:bg-[#d4ff33] font-semibold h-14 px-8 text-base group"
                            >
                                Start Building Free
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white/20 text-white hover:bg-white/5 h-14 px-8 text-base"
                            >
                                Watch Demo
                            </Button>
                        </div>

                        {/* Social proof */}
                        <div
                            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-white/40 animate-fade-in-up"
                            style={{ animationDelay: '400ms' }}
                        >
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    {['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'].map((color, i) => (
                                        <div
                                            key={i}
                                            className="w-8 h-8 rounded-full border-2 border-[#0a0a0a]"
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                                <span>50,000+ teams</span>
                            </div>
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-[#c8ff00] text-[#c8ff00]" />
                                ))}
                                <span className="ml-1">4.9/5 rating</span>
                            </div>
                        </div>
                    </div>

                    {/* Hero visual */}
                    <div
                        className="mt-20 relative animate-fade-in-up"
                        style={{ animationDelay: '500ms' }}
                    >
                        <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-transparent to-transparent z-10 pointer-events-none" />
                        <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/50">
                            {/* Browser chrome */}
                            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-white/20" />
                                    <div className="w-3 h-3 rounded-full bg-white/20" />
                                    <div className="w-3 h-3 rounded-full bg-white/20" />
                                </div>
                                <div className="flex-1 flex justify-center">
                                    <div className="px-4 py-1 rounded-md bg-white/5 text-xs text-white/40">
                                        app.baolt.io/dashboard
                                    </div>
                                </div>
                            </div>
                            {/* Mock dashboard */}
                            <div className="p-6 min-h-100 bg-linear-to-br from-[#111] to-[#0a0a0a]">
                                <div className="grid grid-cols-4 gap-4 mb-6">
                                    {stats.map((stat, i) => (
                                        <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5">
                                            <div className="text-2xl font-bold text-[#c8ff00]">{stat.value}</div>
                                            <div className="text-sm text-white/40">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-2 h-48 rounded-xl bg-white/5 border border-white/5 p-4">
                                        <div className="text-sm text-white/40 mb-4">Performance</div>
                                        <div className="flex items-end gap-2 h-28">
                                            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                                                <div
                                                    key={i}
                                                    className="flex-1 rounded-t bg-linear-to-t from-[#c8ff00]/50 to-[#c8ff00]"
                                                    style={{ height: `${h}%` }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="h-48 rounded-xl bg-white/5 border border-white/5 p-4">
                                        <div className="text-sm text-white/40 mb-4">Activity</div>
                                        <div className="space-y-2">
                                            {[...Array(5)].map((_, i) => (
                                                <div key={i} className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-[#c8ff00]" />
                                                    <div className="flex-1 h-2 rounded bg-white/10" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Logos Section */}
            <section className="py-16 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-sm text-white/30 mb-8 uppercase tracking-widest">
                        Trusted by industry leaders
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-40">
                        {['Stripe', 'Vercel', 'Linear', 'Notion', 'Figma', 'Framer'].map((brand) => (
                            <span key={brand} className="font-clash font-semibold text-xl tracking-tight">
                                {brand}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-block px-3 py-1 rounded-full bg-[#c8ff00]/10 text-[#c8ff00] text-sm font-medium mb-4">
                            Features
                        </span>
                        <h2 className="font-clash font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight mb-4">
                            Everything you need
                        </h2>
                        <p className="text-lg text-white/50 max-w-2xl mx-auto">
                            Powerful features that scale with your team. No compromises.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                className="group relative p-8 rounded-2xl border border-white/5 bg-white/2 hover:bg-white/4 hover:border-[#c8ff00]/20 transition-all duration-300"
                            >
                                <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-[#c8ff00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-xl bg-[#c8ff00]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <feature.icon className="w-6 h-6 text-[#c8ff00]" />
                                    </div>
                                    <h3 className="font-clash font-semibold text-xl mb-2">{feature.title}</h3>
                                    <p className="text-white/50">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bento Grid Feature Highlight */}
            <section className="py-24 px-6 bg-linear-to-b from-transparent via-white/2 to-transparent">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Large feature card */}
                        <div className="md:col-span-2 md:row-span-2 relative p-8 rounded-2xl border border-white/10 bg-linear-to-br from-[#c8ff00]/10 to-transparent overflow-hidden group">
                            <div className="absolute top-0 right-0 w-75 h-75 bg-[#c8ff00]/20 rounded-full blur-[100px] group-hover:scale-150 transition-transform duration-700" />
                            <div className="relative z-10">
                                <h3 className="font-clash font-bold text-3xl mb-4">AI-Powered Automation</h3>
                                <p className="text-lg text-white/60 mb-8 max-w-md">
                                    Let AI handle the repetitive work while you focus on building what matters.
                                </p>
                                <div className="p-6 rounded-xl bg-black/40 backdrop-blur border border-white/10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-lg bg-[#c8ff00] flex items-center justify-center">
                                            <Zap className="w-4 h-4 text-black" />
                                        </div>
                                        <span className="text-sm font-medium">Workflow running...</span>
                                    </div>
                                    <div className="space-y-2">
                                        {['Analyzing data', 'Generating report', 'Sending notifications'].map((step, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-white/40">
                                                <Check className="w-4 h-4 text-[#c8ff00]" />
                                                {step}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Smaller cards */}
                        <div className="p-6 rounded-2xl border border-white/10 bg-white/2">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                                <Shield className="w-5 h-5 text-purple-400" />
                            </div>
                            <h4 className="font-clash font-semibold text-lg mb-2">Enterprise Security</h4>
                            <p className="text-sm text-white/40">SOC2 Type II certified with end-to-end encryption.</p>
                        </div>

                        <div className="p-6 rounded-2xl border border-white/10 bg-white/2">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                                <BarChart3 className="w-5 h-5 text-blue-400" />
                            </div>
                            <h4 className="font-clash font-semibold text-lg mb-2">Real-time Analytics</h4>
                            <p className="text-sm text-white/40">Track every metric that matters to your business.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-block px-3 py-1 rounded-full bg-[#c8ff00]/10 text-[#c8ff00] text-sm font-medium mb-4">
                            Testimonials
                        </span>
                        <h2 className="font-clash font-bold text-4xl sm:text-5xl tracking-tight">
                            Loved by teams everywhere
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, i) => (
                            <div
                                key={i}
                                className="p-6 rounded-2xl border border-white/5 bg-white/2 hover:border-white/10 transition-colors"
                            >
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, j) => (
                                        <Star key={j} className="w-4 h-4 fill-[#c8ff00] text-[#c8ff00]" />
                                    ))}
                                </div>
                                <p className="text-lg mb-6 text-white/80">"{testimonial.quote}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#c8ff00] to-[#96ff00] flex items-center justify-center text-black font-semibold text-sm">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <div className="font-medium">{testimonial.author}</div>
                                        <div className="text-sm text-white/40">{testimonial.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-block px-3 py-1 rounded-full bg-[#c8ff00]/10 text-[#c8ff00] text-sm font-medium mb-4">
                            Pricing
                        </span>
                        <h2 className="font-clash font-bold text-4xl sm:text-5xl tracking-tight mb-4">
                            Simple, transparent pricing
                        </h2>
                        <p className="text-lg text-white/50">
                            Start free, upgrade when you're ready.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {pricingTiers.map((tier, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "relative p-8 rounded-2xl border transition-all",
                                    tier.highlighted
                                        ? "border-[#c8ff00]/50 bg-[#c8ff00]/5 scale-105"
                                        : "border-white/10 bg-white/2 hover:border-white/20"
                                )}
                            >
                                {tier.highlighted && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#c8ff00] text-black text-xs font-semibold">
                                        Most Popular
                                    </div>
                                )}
                                <div className="mb-6">
                                    <h3 className="font-clash font-semibold text-xl mb-1">{tier.name}</h3>
                                    <p className="text-sm text-white/40">{tier.description}</p>
                                </div>
                                <div className="mb-6">
                                    <span className="font-clash font-bold text-5xl">
                                        {tier.price === "Custom" ? "" : "$"}{tier.price}
                                    </span>
                                    {tier.price !== "Custom" && (
                                        <span className="text-white/40">/month</span>
                                    )}
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {tier.features.map((feature, j) => (
                                        <li key={j} className="flex items-center gap-2 text-sm text-white/60">
                                            <Check className="w-4 h-4 text-[#c8ff00]" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    className={cn(
                                        "w-full",
                                        tier.highlighted
                                            ? "bg-[#c8ff00] text-black hover:bg-[#d4ff33]"
                                            : "bg-white/10 text-white hover:bg-white/20"
                                    )}
                                >
                                    {tier.cta}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto relative">
                    <div className="absolute inset-0 bg-linear-to-r from-[#c8ff00]/20 via-purple-500/20 to-[#c8ff00]/20 rounded-3xl blur-3xl" />
                    <div className="relative p-12 rounded-3xl border border-white/10 bg-[#111] text-center">
                        <h2 className="font-clash font-bold text-4xl sm:text-5xl tracking-tight mb-4">
                            Ready to ship faster?
                        </h2>
                        <p className="text-lg text-white/50 mb-8 max-w-xl mx-auto">
                            Join 50,000+ teams already building with BaoLT.
                            Start free, no credit card required.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button
                                size="lg"
                                className="bg-[#c8ff00] text-black hover:bg-[#d4ff33] font-semibold h-14 px-8 text-base group"
                            >
                                Get Started Free
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button
                                size="lg"
                                variant="ghost"
                                className="text-white/70 hover:text-white h-14 px-8 text-base"
                            >
                                Talk to Sales
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-5 gap-12 mb-12">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-[#c8ff00] rotate-45" />
                                <span className="font-clash font-bold text-xl tracking-tight">BaoLT</span>
                            </div>
                            <p className="text-sm text-white/40 max-w-xs">
                                The modern platform for teams who ship. Build products faster than ever.
                            </p>
                        </div>
                        {[
                            { title: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
                            { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
                            { title: 'Resources', links: ['Documentation', 'API Reference', 'Status', 'Support'] },
                        ].map((section, i) => (
                            <div key={i}>
                                <h4 className="font-semibold mb-4">{section.title}</h4>
                                <ul className="space-y-2">
                                    {section.links.map((link, j) => (
                                        <li key={j}>
                                            <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-white/5 gap-4">
                        <p className="text-sm text-white/30">
                            © 2025 BaoLT. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6 text-sm text-white/30">
                            <a href="#" className="hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms</a>
                            <a href="#" className="hover:text-white transition-colors">Cookies</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Landing
