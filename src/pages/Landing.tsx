import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Star, BarChart3, ArrowRight, Menu, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { LeadInfoCard } from '../components/landing/LeadInfoCard';
import { PLANS } from '../utils/constants';

export const Landing: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-xl sm:text-2xl font-bold text-gray-900">
                CLEAR<span className="font-normal text-gray-500">LEADS</span>
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/benefits" className="text-gray-700 hover:text-gray-900 font-medium">
                Benefits
              </Link>
              <Link to="/features" className="text-gray-700 hover:text-gray-900 font-medium">
                Features
              </Link>
              <Link to="/use-cases" className="text-gray-700 hover:text-gray-900 font-medium">
                Use Cases
              </Link>
              <Link to="/pricing" className="text-gray-700 hover:text-gray-900 font-medium">
                Pricing
              </Link>
              <div className="mt-1">
                <img 
                  src="/Untitled_design_-_2025-02-19T120300.582.png" 
                  alt="Zapier" 
                  className="h-10"
                />
              </div>
            </nav>
            
            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="text-gray-700 hover:text-gray-900 font-medium">
                Log in
              </Link>
              <Link to="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
                  Sign up
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-4">
                <Link to="/benefits" className="text-gray-700 hover:text-gray-900 font-medium px-2 py-1">
                  Benefits
                </Link>
                <Link to="/features" className="text-gray-700 hover:text-gray-900 font-medium px-2 py-1">
                  Features
                </Link>
                <Link to="/use-cases" className="text-gray-700 hover:text-gray-900 font-medium px-2 py-1">
                  Use Cases
                </Link>
                <Link to="/pricing" className="text-gray-700 hover:text-gray-900 font-medium px-2 py-1">
                  Pricing
                </Link>
                <div className="border-t border-gray-200 pt-4 flex flex-col space-y-2">
                  <Link to="/login" className="text-gray-700 hover:text-gray-900 font-medium px-2 py-1">
                    Log in
                  </Link>
                  <Link to="/register" className="px-2">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium">
                      Sign up
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-4 sm:space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Simple, fast, secure lead validation service
                </h1>
                
                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                  Validate emails and phone numbers in one simple step. 
                  Intelligent lead qualification and valuation so you invest 
                  your time and budget where it truly counts.
                </p>
              </div>

              {/* Features List */}
              <div className="flex flex-wrap gap-4 sm:gap-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <span className="text-gray-700 font-medium text-sm sm:text-base">Smart Validation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700 font-medium text-sm sm:text-base">Lead Qualification</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <span className="text-gray-700 font-medium text-sm sm:text-base">Value Assessment</span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="space-y-4">
                <Link to="/register">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg inline-flex items-center">
                    Get started for free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                
                <p className="text-gray-500 text-sm">
                  50 free validations per month
                </p>
              </div>
            </div>

            {/* Right Content - Lead Info Card */}
            <div className="flex justify-center lg:justify-end mt-8 lg:mt-0">
              <LeadInfoCard />
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-60 h-60 sm:w-80 sm:h-80 bg-blue-100 rounded-full opacity-20"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-40 h-40 sm:w-60 sm:h-60 bg-purple-100 rounded-full opacity-20"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Why Choose ClearLeads?
            </h2>
            <p className="text-lg text-gray-600">
              Powerful features to help you maintain clean, high-quality lead data
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Real-time Validation</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Get instant results for email and phone number validation with detailed status reports
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Batch Processing</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Upload CSV files and validate thousands of leads in minutes with our bulk processing
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Track validation success rates, costs, and trends with comprehensive analytics
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600">
              Choose the plan that fits your validation needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-lg shadow-md p-6 sm:p-8 relative ${
                  plan.popular ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <p className="text-gray-600 mb-6">
                    {plan.credits} validations included
                  </p>
                </div>

                <ul className="space-y-3 mb-6 sm:mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm sm:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/register" className="block">
                  <Button
                    className="w-full"
                    variant={plan.popular ? 'primary' : 'outline'}
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Trusted by Marketing Teams
            </h2>
            <p className="text-lg text-gray-600">
              See what our customers are saying about ClearLeads
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Marketing Director',
                company: 'TechCorp',
                content: 'ClearLeads helped us improve our email deliverability by 40%. The interface is intuitive and the results are incredibly accurate.',
                rating: 5
              },
              {
                name: 'Mike Chen',
                role: 'Sales Manager',
                company: 'GrowthCo',
                content: 'The batch processing feature saves us hours every week. We can now validate thousands of leads in minutes.',
                rating: 5
              },
              {
                name: 'Emily Davis',
                role: 'Lead Generation Specialist',
                company: 'MarketPro',
                content: 'The analytics dashboard gives us valuable insights into our lead quality. Highly recommended for any marketing team.',
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 text-sm sm:text-base">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="sm:col-span-2 md:col-span-1">
              <div className="flex items-center mb-4">
                <span className="text-lg sm:text-xl font-bold">
                  CLEAR<span className="font-normal text-gray-400">LEADS</span>
                </span>
              </div>
              <p className="text-gray-400 text-sm sm:text-base">
                The most reliable lead validation platform for modern marketing teams.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white text-sm sm:text-base">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm sm:text-base">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm sm:text-base">API</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm sm:text-base">Documentation</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white text-sm sm:text-base">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm sm:text-base">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm sm:text-base">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm sm:text-base">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white text-sm sm:text-base">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm sm:text-base">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm sm:text-base">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm sm:text-base">Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400">
            <p className="text-sm sm:text-base">&copy; 2024 ClearLeads. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};