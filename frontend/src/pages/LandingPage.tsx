import { useState } from 'react';
import { Receipt, Sparkles, Zap, Shield, ArrowRight, Globe, BarChart3, FileText, Smartphone, Lock, Star, CheckCircle2, DollarSign, Award, Target, Rocket, Menu, X } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Receipt size={22} className="text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-900 to-teal-700 bg-clip-text text-transparent">
                ExpenseFlow
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-600 hover:text-teal-600 font-medium transition-colors">Features</a>
              <a href="#how-it-works" className="text-slate-600 hover:text-teal-600 font-medium transition-colors">How It Works</a>
              <a href="#testimonials" className="text-slate-600 hover:text-teal-600 font-medium transition-colors">Testimonials</a>
              <a href="#pricing" className="text-slate-600 hover:text-teal-600 font-medium transition-colors">Pricing</a>
              <Button onClick={() => setShowAuthModal(true)} size="md">
                Get Started <ArrowRight size={16} className="ml-1" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 py-4 px-4 space-y-3">
            <a href="#features" className="block text-slate-600 hover:text-teal-600 font-medium py-2">Features</a>
            <a href="#how-it-works" className="block text-slate-600 hover:text-teal-600 font-medium py-2">How It Works</a>
            <a href="#testimonials" className="block text-slate-600 hover:text-teal-600 font-medium py-2">Testimonials</a>
            <a href="#pricing" className="block text-slate-600 hover:text-teal-600 font-medium py-2">Pricing</a>
            <Button onClick={() => setShowAuthModal(true)} className="w-full" size="md">
              Get Started <ArrowRight size={16} className="ml-1" />
            </Button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-indigo-50 to-teal-50 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-4 py-2 rounded-full mb-6 animate-fade-in">
              <Rocket size={18} />
              <span className="text-sm font-semibold">Trusted by 10,000+ teams worldwide</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight animate-slide-in">
              Expense Management
              <span className="block bg-gradient-to-r from-teal-500 to-indigo-600 bg-clip-text text-transparent">
                Reimagined for Modern Teams
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-slate-600 mb-10 leading-relaxed animate-slide-in">
              Transform your expense workflow with AI-powered receipt scanning, real-time currency conversion, 
              and intelligent approval workflows. Save 10+ hours every week.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-slide-in">
              <Button onClick={() => setShowAuthModal(true)} size="lg" className="w-full sm:w-auto">
                Start Free Trial <ArrowRight size={20} className="ml-2" />
              </Button>
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Watch Demo <Sparkles size={20} className="ml-2" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl font-bold bg-gradient-to-r from-teal-500 to-indigo-600 bg-clip-text text-transparent mb-2">
                  10K+
                </div>
                <div className="text-slate-600 font-medium">Active Teams</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl font-bold bg-gradient-to-r from-teal-500 to-indigo-600 bg-clip-text text-transparent mb-2">
                  99.9%
                </div>
                <div className="text-slate-600 font-medium">Uptime</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl font-bold bg-gradient-to-r from-teal-500 to-indigo-600 bg-clip-text text-transparent mb-2">
                  5M+
                </div>
                <div className="text-slate-600 font-medium">Expenses Processed</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl font-bold bg-gradient-to-r from-teal-500 to-indigo-600 bg-clip-text text-transparent mb-2">
                  4.9★
                </div>
                <div className="text-slate-600 font-medium">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full mb-4">
              <Sparkles size={18} />
              <span className="text-sm font-semibold">Features</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Everything You Need to Manage Expenses
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Powerful features designed to streamline your entire expense management process
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="text-teal-600" size={28} />,
                title: 'AI-Powered OCR',
                description: 'Instantly scan and extract data from receipts with 99% accuracy using advanced AI technology.',
                color: 'teal'
              },
              {
                icon: <Globe className="text-indigo-600" size={28} />,
                title: 'Multi-Currency Support',
                description: 'Automatically convert expenses across 150+ currencies with real-time exchange rates.',
                color: 'indigo'
              },
              {
                icon: <Shield className="text-purple-600" size={28} />,
                title: 'Smart Approvals',
                description: 'Create custom approval workflows with automatic routing based on amount, category, or department.',
                color: 'purple'
              },
              {
                icon: <BarChart3 className="text-pink-600" size={28} />,
                title: 'Real-Time Analytics',
                description: 'Track spending patterns, identify trends, and make data-driven decisions with powerful dashboards.',
                color: 'pink'
              },
              {
                icon: <Smartphone className="text-blue-600" size={28} />,
                title: 'Mobile-First Design',
                description: 'Submit expenses on-the-go with our responsive web app that works perfectly on any device.',
                color: 'blue'
              },
              {
                icon: <Lock className="text-red-600" size={28} />,
                title: 'Bank-Level Security',
                description: 'Your data is encrypted end-to-end with enterprise-grade security and compliance.',
                color: 'red'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-${feature.color}-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-teal-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-4 py-2 rounded-full mb-4">
              <Target size={18} />
              <span className="text-sm font-semibold">How It Works</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Simple, Fast, and Efficient
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Get started in minutes and transform your expense management workflow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: <FileText className="text-white" size={32} />,
                title: 'Upload Receipt',
                description: 'Simply snap a photo or upload your receipt. Our AI instantly extracts all relevant data.',
                gradient: 'from-teal-500 to-cyan-500'
              },
              {
                step: '02',
                icon: <CheckCircle2 className="text-white" size={32} />,
                title: 'Review & Submit',
                description: 'Verify the extracted information, add notes if needed, and submit for approval.',
                gradient: 'from-indigo-500 to-purple-500'
              },
              {
                step: '03',
                icon: <Award className="text-white" size={32} />,
                title: 'Get Reimbursed',
                description: 'Track approval status in real-time and get reimbursed faster than ever.',
                gradient: 'from-purple-500 to-pink-500'
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div className="text-7xl font-bold text-slate-100 mb-4">{step.step}</div>
                  <div className={`w-20 h-20 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg transform hover:scale-110 transition-transform duration-300`}>
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="text-teal-500" size={32} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OCR Demo Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-4 py-2 rounded-full mb-4">
              <Zap size={18} />
              <span className="text-sm font-semibold">AI-Powered OCR</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Scan Receipts in Seconds
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our advanced OCR technology powered by Tesseract.js extracts data from receipts with 99%+ accuracy
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Visual Demo */}
            <div className="relative">
              <div className="bg-gradient-to-br from-teal-50 to-indigo-50 rounded-3xl p-8 border-2 border-teal-200">
                {/* Simulated Receipt */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6 transform hover:scale-105 transition-all duration-300">
                  <div className="text-center mb-6 pb-4 border-b border-slate-200">
                    <h3 className="text-2xl font-bold text-slate-900">Coffee Shop ☕</h3>
                    <p className="text-sm text-slate-600">123 Main Street, Downtown</p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-slate-700">
                      <span>Cappuccino (Large)</span>
                      <span>$5.50</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Croissant</span>
                      <span>$3.75</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Tax (8%)</span>
                      <span>$0.74</span>
                    </div>
                  </div>
                  
                  <div className="border-t-2 border-slate-900 pt-3 mb-4">
                    <div className="flex justify-between text-xl font-bold text-slate-900">
                      <span>TOTAL</span>
                      <span>$9.99</span>
                    </div>
                  </div>
                  
                  <div className="text-center text-sm text-slate-500">
                    <p>Date: 10/04/2025 14:32</p>
                    <p>Transaction #: 78901234</p>
                  </div>
                </div>

                {/* Scanning Animation Indicator */}
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-teal-500 text-white px-6 py-3 rounded-full shadow-lg animate-pulse">
                  <div className="flex items-center gap-2">
                    <Zap size={20} />
                    <span className="font-semibold">Scanning...</span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="text-center mb-4">
                  <ArrowRight className="inline-block text-teal-500 transform rotate-90" size={48} />
                </div>

                {/* Extracted Data */}
                <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-teal-500">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="text-teal-500" size={24} />
                    <h4 className="font-bold text-slate-900 text-lg">Data Extracted!</h4>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center bg-teal-50 rounded-lg p-3">
                      <span className="text-slate-600 font-medium">Vendor:</span>
                      <span className="font-bold text-slate-900">Coffee Shop</span>
                    </div>
                    <div className="flex justify-between items-center bg-teal-50 rounded-lg p-3">
                      <span className="text-slate-600 font-medium">Amount:</span>
                      <span className="font-bold text-slate-900">$9.99</span>
                    </div>
                    <div className="flex justify-between items-center bg-teal-50 rounded-lg p-3">
                      <span className="text-slate-600 font-medium">Date:</span>
                      <span className="font-bold text-slate-900">Oct 4, 2025</span>
                    </div>
                    <div className="flex justify-between items-center bg-teal-50 rounded-lg p-3">
                      <span className="text-slate-600 font-medium">Category:</span>
                      <span className="font-bold text-slate-900">Food & Beverage</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Features & Benefits */}
            <div>
              <div className="space-y-8">
                {[
                  {
                    icon: <Zap className="text-teal-600" size={32} />,
                    title: 'Lightning Fast Extraction',
                    description: 'Extract receipt data in under 3 seconds with our optimized Tesseract.js OCR engine',
                    stats: '99%+ accuracy'
                  },
                  {
                    icon: <Globe className="text-indigo-600" size={32} />,
                    title: 'Multi-Language Support',
                    description: 'Process receipts in 100+ languages including English, Spanish, French, German, Chinese, and more',
                    stats: '100+ languages'
                  },
                  {
                    icon: <FileText className="text-purple-600" size={32} />,
                    title: 'Smart Data Recognition',
                    description: 'Automatically identifies vendors, amounts, dates, categories, tax amounts, and transaction details',
                    stats: 'All formats'
                  },
                  {
                    icon: <Shield className="text-pink-600" size={32} />,
                    title: 'Privacy First',
                    description: 'OCR processing happens securely on our servers. Images are automatically deleted after extraction',
                    stats: 'Zero retention'
                  }
                ].map((feature, index) => (
                  <div key={index} className="flex gap-6 group">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:border-teal-300 transition-all duration-300">
                        {feature.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                        <span className="text-xs font-bold text-teal-600 bg-teal-100 px-3 py-1 rounded-full">
                          {feature.stats}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* API Integration Info */}
              <div className="mt-12 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">API Integration Available</h4>
                    <p className="text-sm text-slate-300">Integrate OCR into your workflow</p>
                  </div>
                </div>
                <div className="bg-slate-950 rounded-xl p-4 font-mono text-sm overflow-x-auto">
                  <div className="text-slate-400">// POST /api/ocr/extract</div>
                  <div className="text-teal-400">const formData = new FormData();</div>
                  <div className="text-teal-400">formData.append('receipt', file);</div>
                  <div className="text-white">fetch('/api/ocr/extract', {'{'}</div>
                  <div className="text-white ml-4">method: 'POST',</div>
                  <div className="text-white ml-4">body: formData</div>
                  <div className="text-white">{'}'}).then(res =&gt; res.json());</div>
                </div>
              </div>
            </div>
          </div>

          {/* Supported Formats */}
          <div className="mt-16 text-center">
            <p className="text-slate-600 mb-6 font-medium">Supported Receipt Formats:</p>
            <div className="flex flex-wrap justify-center gap-4">
              {['📄 PDF', '📸 JPG/JPEG', '🖼️ PNG', '📎 HEIC', '📋 Multi-page', '🌐 International'].map((format, i) => (
                <div key={i} className="bg-white border-2 border-slate-200 rounded-xl px-6 py-3 font-semibold text-slate-700 hover:border-teal-400 hover:shadow-lg transition-all duration-300">
                  {format}
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Button onClick={() => setShowAuthModal(true)} size="lg" className="shadow-2xl">
              Try OCR Scanner Now <ArrowRight size={20} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-teal-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full mb-4">
              <Star size={18} />
              <span className="text-sm font-semibold">Testimonials</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Loved by Teams Worldwide
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              See what our customers have to say about ExpenseFlow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Finance Manager',
                company: 'TechCorp Inc.',
                avatar: '👩‍💼',
                rating: 5,
                text: 'ExpenseFlow has transformed how our team manages expenses. The OCR feature alone saves us hours every week!'
              },
              {
                name: 'Michael Chen',
                role: 'CEO',
                company: 'StartupXYZ',
                avatar: '👨‍💼',
                rating: 5,
                text: 'The multi-currency support is a game-changer for our global team. Highly recommend!'
              },
              {
                name: 'Emily Rodriguez',
                role: 'Operations Director',
                company: 'Global Enterprises',
                avatar: '👩‍💻',
                rating: 5,
                text: 'Best expense management tool we\'ve used. The approval workflows are incredibly flexible and easy to configure.'
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-yellow-400" size={20} />
                  ))}
                </div>
                <p className="text-slate-700 text-lg mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-indigo-600 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-600">{testimonial.role}</div>
                    <div className="text-sm text-slate-500">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full mb-4">
              <Target size={18} />
              <span className="text-sm font-semibold">Use Cases</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Built for Every Team
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Whether you're a startup or enterprise, ExpenseFlow adapts to your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Remote Teams',
                description: 'Manage expenses across distributed teams with ease. Track spending by location, currency, and team member.',
                icon: '🌍',
                benefits: ['Multi-currency support', 'Time zone aware', 'Mobile-first design']
              },
              {
                title: 'Sales Teams',
                description: 'Keep your sales reps moving. Quick expense submission on-the-go with automatic mileage tracking.',
                icon: '💼',
                benefits: ['Receipt scanning', 'Mileage tracking', 'Fast reimbursement']
              },
              {
                title: 'Finance Departments',
                description: 'Get complete visibility and control. Real-time reporting, custom approval flows, and audit trails.',
                icon: '📊',
                benefits: ['Advanced analytics', 'Audit trails', 'Custom workflows']
              },
              {
                title: 'Consultants',
                description: 'Bill clients accurately with detailed expense reports and project-based tracking.',
                icon: '🎯',
                benefits: ['Project tracking', 'Client billing', 'Detailed reports']
              }
            ].map((useCase, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
                <div className="text-5xl mb-4">{useCase.icon}</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{useCase.title}</h3>
                <p className="text-slate-600 mb-6">{useCase.description}</p>
                <ul className="space-y-2">
                  {useCase.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-700">
                      <CheckCircle2 className="text-teal-500" size={16} />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Partners Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-teal-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full mb-4">
              <Zap size={18} />
              <span className="text-sm font-semibold">Integrations</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Integrates with Your Favorite Tools
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Connect ExpenseFlow with the tools you already use every day
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: 'Slack', logo: '💬' },
              { name: 'QuickBooks', logo: '📚' },
              { name: 'Xero', logo: '📊' },
              { name: 'SAP', logo: '🏢' },
              { name: 'Salesforce', logo: '☁️' },
              { name: 'Microsoft 365', logo: '📧' },
              { name: 'Google Workspace', logo: '🔍' },
              { name: 'Zapier', logo: '⚡' },
              { name: 'NetSuite', logo: '🌐' },
              { name: 'Oracle', logo: '🗄️' },
              { name: 'Workday', logo: '💼' },
              { name: 'Concur', logo: '✈️' }
            ].map((integration, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="text-4xl">{integration.logo}</div>
                <div className="text-sm font-semibold text-slate-700 text-center">{integration.name}</div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button onClick={() => setShowAuthModal(true)} size="lg">
              View All Integrations <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Stats & Achievements Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-4 py-2 rounded-full mb-4">
              <Award size={18} />
              <span className="text-sm font-semibold">Recognition</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Award-Winning Platform
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Recognized by industry leaders and trusted by companies worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '🏆',
                title: 'Best Expense Tool 2024',
                source: 'TechAwards',
                description: 'Winner in Finance Category'
              },
              {
                icon: '⭐',
                title: 'Top Rated on G2',
                source: '4.9/5 from 2,500+ reviews',
                description: 'Leader in Expense Management'
              },
              {
                icon: '🚀',
                title: 'Fast Growing Startup',
                source: 'Forbes Cloud 100',
                description: 'Ranked #45 in 2024'
              },
              {
                icon: '💎',
                title: 'SOC 2 Type II Certified',
                source: 'Security & Compliance',
                description: 'Enterprise-grade security'
              }
            ].map((achievement, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300"
              >
                <div className="text-5xl mb-4">{achievement.icon}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{achievement.title}</h3>
                <div className="text-sm text-teal-600 font-semibold mb-2">{achievement.source}</div>
                <p className="text-sm text-slate-600">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-indigo-50 to-teal-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full mb-4">
              <FileText size={18} />
              <span className="text-sm font-semibold">FAQ</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-slate-600">
              Everything you need to know about ExpenseFlow
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: 'How accurate is the OCR scanning?',
                answer: 'Our AI-powered OCR technology powered by Tesseract.js achieves 99%+ accuracy across multiple receipt formats, languages, and currencies. The system automatically extracts vendor names, amounts, dates, tax information, and categorizes expenses. If any data needs correction, you can easily edit it before submission.'
              },
              {
                question: 'What image formats does the OCR support?',
                answer: 'Our OCR system supports all common image formats including JPG, JPEG, PNG, PDF, and HEIC. You can upload single or multi-page receipts. For best results, ensure the receipt is well-lit, in focus, and the text is clearly visible.'
              },
              {
                question: 'Does OCR work with handwritten receipts?',
                answer: 'While our OCR is optimized for printed text, it can handle some handwritten receipts with clear, legible writing. However, for best accuracy, we recommend using printed receipts. You can always manually edit any extracted data.'
              },
              {
                question: 'Can I use ExpenseFlow on mobile devices?',
                answer: 'Yes! ExpenseFlow is fully responsive and works seamlessly on all devices. You can submit expenses, approve requests, and view reports from your phone or tablet. Simply snap a photo of your receipt and our OCR will process it instantly.'
              },
              {
                question: 'How long does OCR processing take?',
                answer: 'OCR processing is lightning fast! Most receipts are scanned and data is extracted in under 3 seconds. The system automatically identifies key information and populates your expense form, saving you valuable time.'
              },
              {
                question: 'How long does the approval process take?',
                answer: 'Approval times vary based on your workflow configuration, but most expenses are approved within 24-48 hours. You can set up automatic approvals for expenses under a certain amount.'
              },
              {
                question: 'Is my data secure?',
                answer: 'Absolutely. We use bank-level 256-bit encryption, are SOC 2 Type II certified, and comply with GDPR, CCPA, and other data protection regulations. Your data is stored securely in encrypted databases.'
              },
              {
                question: 'Can I export expense data?',
                answer: 'Yes! You can export data in multiple formats (CSV, Excel, PDF) and integrate directly with accounting software like QuickBooks, Xero, SAP, and more.'
              },
              {
                question: 'What currencies are supported?',
                answer: 'ExpenseFlow supports 150+ currencies with real-time exchange rates updated every hour. Multi-currency expenses are automatically converted to your base currency.'
              },
              {
                question: 'Is there a mobile app?',
                answer: 'While we currently offer a fully responsive web app that works perfectly on mobile browsers, native iOS and Android apps are coming soon in Q2 2025.'
              },
              {
                question: 'Can I cancel my subscription anytime?',
                answer: 'Yes, you can cancel your subscription at any time with no penalties. Your data will remain accessible for 90 days after cancellation for export purposes.'
              }
            ].map((faq, index) => (
              <details 
                key={index}
                className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group"
              >
                <summary className="font-semibold text-slate-900 cursor-pointer flex items-center justify-between">
                  <span>{faq.question}</span>
                  <ArrowRight className="text-teal-500 group-open:rotate-90 transition-transform" size={20} />
                </summary>
                <p className="text-slate-600 mt-4 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-slate-600 mb-4">Still have questions?</p>
            <Button onClick={() => setShowAuthModal(true)} variant="secondary" size="lg">
              Contact Support <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-4 py-2 rounded-full mb-4">
              <DollarSign size={18} />
              <span className="text-sm font-semibold">Pricing</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Choose the perfect plan for your team. All plans include a 14-day free trial.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Starter',
                price: '$9',
                period: 'per user/month',
                description: 'Perfect for small teams',
                features: [
                  'Up to 10 users',
                  'OCR receipt scanning',
                  'Basic reporting',
                  'Email support',
                  '1GB storage'
                ],
                cta: 'Start Free Trial',
                popular: false
              },
              {
                name: 'Professional',
                price: '$19',
                period: 'per user/month',
                description: 'For growing businesses',
                features: [
                  'Up to 50 users',
                  'Advanced OCR & AI',
                  'Custom workflows',
                  'Priority support',
                  '10GB storage',
                  'API access'
                ],
                cta: 'Start Free Trial',
                popular: true
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: 'contact us',
                description: 'For large organizations',
                features: [
                  'Unlimited users',
                  'Advanced security',
                  'Dedicated support',
                  'Custom integrations',
                  'Unlimited storage',
                  'SLA guarantee'
                ],
                cta: 'Contact Sales',
                popular: false
              }
            ].map((plan, index) => (
              <div 
                key={index}
                className={`relative bg-white rounded-2xl p-8 ${
                  plan.popular 
                    ? 'border-2 border-teal-500 shadow-2xl scale-105' 
                    : 'border border-slate-200 shadow-lg'
                } hover:shadow-2xl transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-teal-500 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <div className="text-5xl font-bold text-slate-900 mb-2">{plan.price}</div>
                  <div className="text-slate-600">{plan.period}</div>
                  <p className="text-slate-500 mt-2">{plan.description}</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="text-teal-500 flex-shrink-0" size={20} />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={() => setShowAuthModal(true)}
                  variant={plan.popular ? 'primary' : 'secondary'}
                  className="w-full"
                  size="lg"
                >
                  {plan.cta} <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-teal-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-12 shadow-2xl border border-slate-200">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-4 py-2 rounded-full mb-6">
                <Sparkles size={18} />
                <span className="text-sm font-semibold">Stay Updated</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Get the Latest Expense Management Tips
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Subscribe to our newsletter for expert tips, product updates, and exclusive offers
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:outline-none text-slate-900"
                />
                <Button size="lg" className="sm:w-auto">
                  Subscribe <ArrowRight size={18} className="ml-2" />
                </Button>
              </div>
              <p className="text-sm text-slate-500 mt-4">
                Join 25,000+ subscribers. Unsubscribe anytime. We respect your privacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Compliance Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full mb-4">
              <Shield size={18} />
              <span className="text-sm font-semibold">Security & Compliance</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Enterprise-Grade Security You Can Trust
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Your data security and privacy are our top priorities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Lock className="text-indigo-600" size={32} />,
                title: 'Data Encryption',
                description: 'End-to-end 256-bit encryption for all data in transit and at rest'
              },
              {
                icon: <Shield className="text-teal-600" size={32} />,
                title: 'SOC 2 Certified',
                description: 'Independently audited and certified for security and availability'
              },
              {
                icon: <CheckCircle2 className="text-purple-600" size={32} />,
                title: 'GDPR Compliant',
                description: 'Full compliance with global data protection regulations'
              },
              {
                icon: <Globe className="text-blue-600" size={32} />,
                title: 'Data Residency',
                description: 'Choose where your data is stored with multi-region support'
              },
              {
                icon: <FileText className="text-pink-600" size={32} />,
                title: 'Audit Trails',
                description: 'Complete activity logs for compliance and security monitoring'
              },
              {
                icon: <Star className="text-yellow-600" size={32} />,
                title: '99.9% Uptime SLA',
                description: 'Enterprise-grade infrastructure with guaranteed availability'
              }
            ].map((item, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-8 text-center">
            <p className="text-lg text-slate-700 mb-4">
              <strong>Trusted by finance teams at leading companies</strong>
            </p>
            <div className="flex flex-wrap justify-center gap-8 items-center opacity-60">
              {['🏢 Fortune 500', '🏛️ Government', '🏥 Healthcare', '🎓 Education', '💰 Financial Services'].map((industry, i) => (
                <div key={i} className="text-2xl font-semibold text-slate-600">{industry}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-teal-500 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Expense Management?
          </h2>
          <p className="text-xl text-teal-100 mb-10">
            Join 10,000+ teams already saving time and money with ExpenseFlow
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => setShowAuthModal(true)} size="lg" variant="secondary" className="bg-white text-teal-600 hover:bg-slate-100">
              Start Free Trial <ArrowRight size={20} className="ml-2" />
            </Button>
            <Button size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white/10">
              Schedule Demo <Sparkles size={20} className="ml-2" />
            </Button>
          </div>
          <p className="text-teal-100 mt-6">No credit card required • 14-day free trial • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Receipt size={22} className="text-white" />
                </div>
                <span className="text-2xl font-bold">ExpenseFlow</span>
              </div>
              <p className="text-slate-400">
                Modern expense management for modern teams.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-slate-400">© 2025 ExpenseFlow. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Twitter</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal - Placeholder */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full relative">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900"
            >
              <X size={24} />
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Coming Soon!</h3>
              <p className="text-slate-600 mb-6">
                Authentication modal will be integrated here. For now, please use the main login page.
              </p>
              <Button onClick={() => window.location.href = '/login'} className="w-full" size="lg">
                Go to Login <ArrowRight size={18} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
