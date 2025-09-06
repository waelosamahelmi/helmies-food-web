import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Smartphone, 
  Globe, 
  BarChart3, 
  Printer, 
  ShoppingCart, 
  Users, 
  Clock, 
  Star,
  CheckCircle,
  Zap,
  Shield,
  Headphones,
  ArrowRight,
  Play,
  Monitor,
  Tablet,
  Wifi,
  CreditCard,
  TrendingUp,
  Settings,
  Bell,
  Database,
  Cloud,
  Lock
} from "lucide-react";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HelmiesLanding() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const screenshotsRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero animations
    const tl = gsap.timeline();
    
    tl.fromTo(".hero-title", 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    )
    .fromTo(".hero-subtitle", 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.5"
    )
    .fromTo(".hero-cta", 
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" }, "-=0.3"
    );

    // Floating animation for hero elements
    gsap.to(".floating", {
      y: -20,
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    });

    // Features scroll animations
    gsap.fromTo(".feature-card", 
      { opacity: 0, y: 100, scale: 0.8 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Screenshots parallax effect
    gsap.fromTo(".screenshot-item", 
      { opacity: 0, x: -100, rotateY: -15 },
      {
        opacity: 1,
        x: 0,
        rotateY: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.3,
        scrollTrigger: {
          trigger: screenshotsRef.current,
          start: "top 70%",
          end: "bottom 30%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Pricing cards animation
    gsap.fromTo(".pricing-card", 
      { opacity: 0, y: 50, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: pricingRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const features = [
    {
      icon: Globe,
      title: "Customer Website",
      description: "Beautiful, responsive website with online ordering, real-time menu updates, and multi-language support",
      color: "from-purple-500 to-blue-500"
    },
    {
      icon: Smartphone,
      title: "Kitchen Android App",
      description: "Powerful Android app for order management, menu control, discounts, analytics, and automatic thermal printing",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Printer,
      title: "Auto IP Printing",
      description: "Automatic thermal receipt printing to network printers. Kitchen orders, customer receipts, and delivery labels",
      color: "from-cyan-500 to-purple-500"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Real-time sales analytics, customer insights, popular items tracking, and revenue optimization",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Settings,
      title: "Menu Management",
      description: "Easy menu editing, pricing updates, availability control, and promotional campaigns management",
      color: "from-pink-500 to-purple-500"
    },
    {
      icon: Bell,
      title: "Real-time Notifications",
      description: "Instant order notifications, status updates, and system alerts across all devices",
      color: "from-blue-500 to-purple-500"
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Lightning Fast Setup",
      description: "Get your restaurant online in under 30 minutes with our automated setup process"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with SSL encryption, secure payments, and GDPR compliance"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Dedicated Finnish support team available around the clock for technical assistance"
    },
    {
      icon: TrendingUp,
      title: "Boost Revenue",
      description: "Increase orders by 40% on average with optimized online ordering and marketing tools"
    },
    {
      icon: Database,
      title: "Cloud Infrastructure",
      description: "Reliable cloud hosting with 99.9% uptime guarantee and automatic backups"
    },
    {
      icon: Wifi,
      title: "Offline Capable",
      description: "Kitchen app works offline and syncs when connection is restored"
    }
  ];

  const screenshots = [
    {
      title: "Customer Website",
      description: "Beautiful, mobile-responsive ordering website",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
      features: ["Online Ordering", "Menu Display", "Real-time Updates"]
    },
    {
      title: "Kitchen Android App",
      description: "Powerful order management for your kitchen staff",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
      features: ["Order Management", "Menu Control", "Analytics Dashboard"]
    },
    {
      title: "Admin Dashboard",
      description: "Complete control over your restaurant operations",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      features: ["Sales Analytics", "Customer Management", "Reporting"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-white font-bold text-xl">Helmies</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
              <a href="#screenshots" className="text-white/80 hover:text-white transition-colors">Screenshots</a>
              <a href="#pricing" className="text-white/80 hover:text-white transition-colors">Pricing</a>
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-blue-900/30 to-slate-900/50"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl floating"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl floating" style={{ animationDelay: "1s" }}></div>
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
          <div className="hero-title">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              The Complete
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> Restaurant System</span>
            </h1>
          </div>
          
          <div className="hero-subtitle">
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-4xl mx-auto leading-relaxed">
              Transform your restaurant with Helmies - the all-in-one solution featuring a stunning customer website, 
              powerful Android kitchen app, and automated printing system. Built specifically for Finnish restaurants.
            </p>
          </div>

          <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 text-lg">
              <Play className="w-6 h-6 mr-2" />
              Watch Demo
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg">
              <ArrowRight className="w-6 h-6 mr-2" />
              Start Free Trial
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <Globe className="w-8 h-8 text-blue-400 mb-3 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Customer Website</h3>
              <p className="text-white/70 text-sm">Beautiful online ordering</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <Smartphone className="w-8 h-8 text-purple-400 mb-3 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Kitchen App</h3>
              <p className="text-white/70 text-sm">Android order management</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <Printer className="w-8 h-8 text-cyan-400 mb-3 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Auto Printing</h3>
              <p className="text-white/70 text-sm">Thermal receipt printing</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Helmies Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Helmies</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Unlike generic solutions, Helmies is built specifically for Finnish restaurants with local payment methods, 
              language support, and business practices in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="benefit-card hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} id="features" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Complete Restaurant <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Ecosystem</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to run a modern restaurant, from customer ordering to kitchen management and analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="feature-card group hover:shadow-2xl transition-all duration-500 border-0 overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${feature.color}`}></div>
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section ref={screenshotsRef} id="screenshots" className="py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              See Helmies in <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Action</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Take a look at the beautiful interfaces that will transform your restaurant operations.
            </p>
          </div>

          <div className="space-y-16">
            {screenshots.map((screenshot, index) => (
              <div key={index} className={`screenshot-item flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>
                <div className="flex-1">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                    <h3 className="text-3xl font-bold text-white mb-4">{screenshot.title}</h3>
                    <p className="text-xl text-white/80 mb-6">{screenshot.description}</p>
                    <div className="space-y-3">
                      {screenshot.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span className="text-white">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                    <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                      <img
                        src={screenshot.image}
                        alt={screenshot.title}
                        className="w-full h-64 object-cover rounded-xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kitchen App Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powerful <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Kitchen App</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our Android kitchen app is the heart of your restaurant operations, designed for speed and efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Real-time Order Management</h3>
                  <p className="text-gray-600">Receive orders instantly with sound notifications. Accept, modify, or decline orders with one tap.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Menu & Pricing Control</h3>
                  <p className="text-gray-600">Update menu items, prices, and availability instantly. Create promotional campaigns and discounts.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Printer className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Automatic Thermal Printing</h3>
                  <p className="text-gray-600">Connect to network thermal printers. Auto-print kitchen orders, customer receipts, and delivery labels.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Advanced Analytics</h3>
                  <p className="text-gray-600">Track sales, popular items, customer behavior, and revenue trends with beautiful charts and reports.</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl blur-2xl opacity-30"></div>
              <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-400 ml-4">Helmies Kitchen App</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">New Order #1234</span>
                        <Badge className="bg-green-500">Delivery</Badge>
                      </div>
                      <p className="text-sm text-gray-300 mt-2">Pizza Margherita x2, Coca Cola x1</p>
                    </div>
                    
                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Order #1233</span>
                        <Badge className="bg-blue-500">Preparing</Badge>
                      </div>
                      <p className="text-sm text-gray-300 mt-2">Kebab Special, Fries</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">€1,247</div>
                        <div className="text-sm text-gray-400">Today's Sales</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">23</div>
                        <div className="text-sm text-gray-400">Orders Today</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-purple-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Helmies vs <span className="text-white/60">Others</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              See why Finnish restaurants choose Helmies over expensive international solutions.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-4 px-6 text-white font-semibold">Feature</th>
                    <th className="text-center py-4 px-6 text-white font-semibold">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">H</span>
                        </div>
                        <span>Helmies</span>
                      </div>
                    </th>
                    <th className="text-center py-4 px-6 text-white/60 font-semibold">Others</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Finnish Language Support", helmies: true, others: false },
                    { feature: "Local Payment Methods", helmies: true, others: false },
                    { feature: "Thermal Printer Integration", helmies: true, others: false },
                    { feature: "Android Kitchen App", helmies: true, others: false },
                    { feature: "Real-time Order Sync", helmies: true, others: true },
                    { feature: "Custom Branding", helmies: true, others: true },
                    { feature: "Setup Time", helmies: "30 minutes", others: "2-4 weeks" },
                    { feature: "Monthly Cost", helmies: "€49", others: "€200+" },
                    { feature: "Finnish Support", helmies: true, others: false },
                  ].map((row, index) => (
                    <tr key={index} className="border-b border-white/10">
                      <td className="py-4 px-6 text-white">{row.feature}</td>
                      <td className="py-4 px-6 text-center">
                        {typeof row.helmies === 'boolean' ? (
                          row.helmies ? (
                            <CheckCircle className="w-6 h-6 text-green-400 mx-auto" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-red-500/20 border border-red-500 mx-auto"></div>
                          )
                        ) : (
                          <span className="text-green-400 font-semibold">{row.helmies}</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {typeof row.others === 'boolean' ? (
                          row.others ? (
                            <CheckCircle className="w-6 h-6 text-green-400 mx-auto" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-red-500/20 border border-red-500 mx-auto"></div>
                          )
                        ) : (
                          <span className="text-red-400 font-semibold">{row.others}</span>
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

      {/* Pricing Section */}
      <section ref={pricingRef} id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simple, <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Transparent</span> Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              No hidden fees, no setup costs, no long-term contracts. Pay only for what you use.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <Card className="pricing-card border-2 border-gray-200 hover:border-purple-300 transition-all duration-300">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Monitor className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Starter</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mt-4">€29<span className="text-lg text-gray-500">/month</span></div>
                <p className="text-gray-600 mt-2">Perfect for small restaurants</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Customer Website</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Basic Analytics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Email Support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Up to 100 orders/month</span>
                </div>
                <Button className="w-full mt-6 bg-gray-600 hover:bg-gray-700">
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Professional Plan */}
            <Card className="pricing-card border-2 border-purple-500 relative overflow-hidden transform scale-105">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
              <div className="absolute top-4 right-4">
                <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">Most Popular</Badge>
              </div>
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Professional</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mt-4">€49<span className="text-lg text-gray-500">/month</span></div>
                <p className="text-gray-600 mt-2">Complete restaurant solution</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Everything in Starter</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Kitchen Android App</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Thermal Printer Integration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Advanced Analytics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Priority Support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Unlimited Orders</span>
                </div>
                <Button className="w-full mt-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="pricing-card border-2 border-gray-200 hover:border-blue-300 transition-all duration-300">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Enterprise</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mt-4">€99<span className="text-lg text-gray-500">/month</span></div>
                <p className="text-gray-600 mt-2">For restaurant chains</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Everything in Professional</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Multi-location Support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Custom Integrations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Dedicated Account Manager</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>24/7 Phone Support</span>
                </div>
                <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-slate-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Restaurant?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join hundreds of Finnish restaurants already using Helmies to increase orders, 
            streamline operations, and delight customers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-12 py-4 text-lg">
              Start 30-Day Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-12 py-4 text-lg">
              Schedule Demo
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">30 Days</div>
              <div className="text-white/70">Free Trial</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">30 Min</div>
              <div className="text-white/70">Setup Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-white/70">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">H</span>
                </div>
                <span className="text-xl font-bold">Helmies</span>
              </div>
              <p className="text-gray-400">
                The complete restaurant management system built for Finnish restaurants.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Demo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Helmies Restaurant Systems. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}