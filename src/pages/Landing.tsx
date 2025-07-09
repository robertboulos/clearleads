import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Star, BarChart3, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { LeadInfoCard } from '../components/landing/LeadInfoCard';
import { PLANS } from '../utils/constants';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-gray-900">
                  CLEAR<span className="font-normal text-gray-500">LEADS</span>
                </span>
              </div>
              
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
                <img 
                  src="/Zapier_logo.svg.png" 
                  alt="Zapier" 
                  className="h-6"
                />
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-700 hover:text-gray-900 font-medium">
                Log in
              </Link>
              <Link to="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Simple, fast, secure lead validation service
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  Validate emails and phone numbers in one simple step. 
                  Intelligent lead qualification and valuation so you invest 
                  your time and budget where it truly counts.
                </p>
              </div>

              {/* Features List */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700 font-medium">Smart Validation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 font-medium">Lead Qualification</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-red-600" />
                  <span className="text-gray-700 font-medium">Value Assessment</span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="space-y-4">
                <Link to="/register">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg inline-flex items-center">
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
            <div className="flex justify-center lg:justify-end">
              <LeadInfoCard />
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-100 rounded-full opacity-20"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-60 h-60 bg-purple-100 rounded-full opacity-20"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose ClearLeads?
            </h2>
            <p className="text-lg text-gray-600">
              Powerful features to help you maintain clean, high-quality lead data
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Validation</h3>
              <p className="text-gray-600">
                Get instant results for email and phone number validation with detailed status reports
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Batch Processing</h3>
              <p className="text-gray-600">
                Upload CSV files and validate thousands of leads in minutes with our bulk processing
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-gray-600">
                Track validation success rates, costs, and trends with comprehensive analytics
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600">
              Choose the plan that fits your validation needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-lg shadow-md p-8 relative ${
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <p className="text-gray-600 mb-6">
                    {plan.credits} validations included
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">{feature}</span>
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Marketing Teams
            </h2>
            <p className="text-lg text-gray-600">
              See what our customers are saying about ClearLeads
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
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
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
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
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <span className="text-xl font-bold">
                  CLEAR<span className="font-normal text-gray-400">LEADS</span>
                </span>
              </div>
              <p className="text-gray-400">
                The most reliable lead validation platform for modern marketing teams.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">API</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ClearLeads. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};