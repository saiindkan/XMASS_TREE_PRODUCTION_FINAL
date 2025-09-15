"use client";
import { useState } from "react";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const donationAmounts = [
  { amount: 25, label: "$25", description: "Help a family get a small tree" },
  { amount: 50, label: "$50", description: "Provide decorations for a family" },
  { amount: 100, label: "$100", description: "Sponsor a premium tree" },
  { amount: 250, label: "$250", description: "Help multiple families" },
  { amount: 500, label: "$500", description: "Support a community" },
];

function DonationForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const amount = selectedAmount || parseInt(customAmount);
    if (!amount || amount < 1) {
      setMessage("Please select or enter a valid donation amount.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      // Create payment intent
      const response = await fetch("/api/create-donation-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents
          donorName,
          donorEmail,
        }),
      });

      const { clientSecret } = await response.json();

      // Confirm payment
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: donorName,
            email: donorEmail,
          },
        },
      });

      if (error) {
        setMessage(`Payment failed: ${error.message}`);
      } else {
        setMessage("Thank you for your generous donation! 🎄");
        // Reset form
        setSelectedAmount(null);
        setCustomAmount("");
        setDonorName("");
        setDonorEmail("");
      }
    } catch (err) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Donation Amount Selection */}
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-4">
            Choose Your Donation Amount
          </label>
          
          {/* Predefined Amounts */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {donationAmounts.map((option) => (
              <button
                key={option.amount}
                type="button"
                onClick={() => {
                  setSelectedAmount(option.amount);
                  setCustomAmount(option.amount.toString());
                }}
                className={`p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                  selectedAmount === option.amount
                    ? "border-red-500 bg-red-50 text-red-700 shadow-lg scale-105"
                    : "border-gray-200 hover:border-red-300 hover:bg-red-50 hover:shadow-md"
                }`}
              >
                <div className="font-bold text-lg">{option.label}</div>
                <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                {selectedAmount === option.amount && (
                  <div className="mt-2 text-xs text-red-600 font-semibold">✓ Selected</div>
                )}
              </button>
            ))}
          </div>
          
          {/* Current Selection Display */}
          {(selectedAmount || customAmount) && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-green-800 font-semibold">Selected Amount:</span>
                  <span className="ml-2 text-xl font-bold text-green-700">
                    ${selectedAmount || customAmount}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAmount(null);
                    setCustomAmount("");
                  }}
                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
          
          {/* Custom Amount */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Amount (automatically filled from selection above):
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">$</span>
              <input
                type="number"
                min="1"
                value={customAmount}
                onChange={(e) => {
                  const value = e.target.value;
                  setCustomAmount(value);
                  // Clear predefined selection if user manually changes the amount
                  if (value && selectedAmount && parseInt(value) !== selectedAmount) {
                    setSelectedAmount(null);
                  }
                }}
                placeholder="Enter custom amount or select from above"
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
              />
              {customAmount && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <span className="text-green-600 text-sm font-semibold">✓</span>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Minimum donation: $1 • Amount updates automatically when you select predefined options above
            </p>
          </div>
        </div>

        {/* Donor Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name (Optional)
            </label>
            <input
              type="text"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address (Optional)
            </label>
            <input
              type="email"
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>

        {/* Payment Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Information
          </label>
          <div className="p-4 border border-gray-300 rounded-lg bg-white">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!stripe || isLoading || (!selectedAmount && !customAmount)}
          className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold py-4 px-6 rounded-lg hover:from-red-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing Donation...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              💝 Donate ${selectedAmount || customAmount || '0'}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </span>
          )}
        </button>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg text-center ${
            message.includes("Thank you") 
              ? "bg-green-50 text-green-800 border border-green-200" 
              : "bg-red-50 text-red-800 border border-red-200"
          }`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50">
      {/* Hero Section with Christmas Background */}
      <section className="relative py-20 overflow-hidden">
        {/* Christmas Background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-fixed"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=2000&q=80)',
            }}
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/80 via-red-800/70 to-pink-800/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30" />
        </div>


        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-semibold mb-6 border border-white/30">
            <span className="text-white mr-2">💝</span>
            Support Our Mission
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 text-white drop-shadow-2xl" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)' }}>
            Help Us Spread Christmas Joy
          </h1>
          
          <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto text-white opacity-95 drop-shadow-lg" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
            Your generous donations help us provide premium Christmas trees and decorations 
            to families who need them most, ensuring everyone can experience the magic of Christmas.
          </p>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Make a Donation</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every contribution helps us bring Christmas joy to families in need. 
              Your donation is secure and processed through Stripe.
            </p>
          </div>

          <Elements stripe={stripePromise}>
            <DonationForm />
          </Elements>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Impact</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how your donations make a real difference in our community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🎄</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Trees for Families</h3>
              <p className="text-gray-600">
                Help us provide beautiful Christmas trees to families who cannot afford them, 
                bringing warmth and joy to their homes during the holiday season.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🎁</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Community Support</h3>
              <p className="text-gray-600">
                Support local communities by helping us donate decorations and holiday supplies 
                to schools, churches, and community centers.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🌟</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Sustainable Growth</h3>
              <p className="text-gray-600">
                Your donations help us expand our operations, source better trees, 
                and improve our services to reach more families in need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Section */}
      <section id="volunteer" className="py-20 bg-gradient-to-r from-red-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Want to Volunteer?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join our team of volunteers and help us distribute trees and decorations to families in need.
          </p>
          <Link
            href="/contact"
            className="px-8 py-4 bg-white text-red-600 font-bold text-lg rounded-full hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-300"
          >
            Contact Us to Volunteer
          </Link>
        </div>
      </section>
    </div>
  );
}
