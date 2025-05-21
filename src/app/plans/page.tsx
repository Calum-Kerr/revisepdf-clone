"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, AlertCircle } from "lucide-react";

interface PricingPlan {
  name: string;
  description: string;
  price: {
    monthly: string;
    yearly: string;
  };
  features: string[];
  highlighted?: boolean;
  buttonText: string;
  buttonLink: string;
}

export default function PlansPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const { data: session, status } = useSession();
  const router = useRouter();

  const handlePlanSelect = (plan: string) => {
    if (status === "unauthenticated") {
      router.push("/auth/register");
    } else {
      // In a real app, this would redirect to checkout
      alert(`You selected the ${plan} plan`);
    }
  };

  const plans: PricingPlan[] = [
    {
      name: "Free",
      description: "Basic tools for occasional use",
      price: {
        monthly: "$0",
        yearly: "$0",
      },
      features: [
        "Up to 5 PDF operations per day",
        "Max file size: 10MB",
        "Basic PDF tools",
        "Files stored for 24 hours",
        "Watermarked PDFs",
      ],
      buttonText: "Current Plan",
      buttonLink: "/profile",
    },
    {
      name: "Pro",
      description: "For individuals with regular PDF needs",
      price: {
        monthly: "$9.99",
        yearly: "$7.99",
      },
      features: [
        "Unlimited PDF operations",
        "Max file size: 100MB",
        "All PDF tools included",
        "Files stored for 7 days",
        "No watermarks",
        "Priority processing",
      ],
      highlighted: true,
      buttonText: "Get Pro",
      buttonLink: "/checkout/pro",
    },
    {
      name: "Business",
      description: "For teams and businesses",
      price: {
        monthly: "$19.99",
        yearly: "$16.99",
      },
      features: [
        "Unlimited PDF operations",
        "Max file size: 500MB",
        "All PDF tools included",
        "Files stored for 30 days",
        "No watermarks",
        "Priority processing",
        "API access",
        "Team management",
        "Bulk processing",
      ],
      buttonText: "Get Business",
      buttonLink: "/checkout/business",
    }
  ];

  return (
    <div className="container py-6 md:py-10 px-4">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">Choose Your Plan</h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
          Get the right plan for your PDF needs. All plans include access to our core PDF tools.
          Upgrade anytime as your needs grow.
        </p>
      </div>

      {/* Billing toggle */}
      <div className="flex justify-center mb-8 md:mb-12">
        <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
          <button
            onClick={() => setBillingPeriod("monthly")}
            className={`px-4 py-2 text-sm rounded-full transition-all ${
              billingPeriod === "monthly"
                ? "bg-white shadow-sm text-gray-800"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod("yearly")}
            className={`px-4 py-2 text-sm rounded-full transition-all relative ${
              billingPeriod === "yearly"
                ? "bg-white shadow-sm text-gray-800"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Yearly
            <span className="absolute -top-2 -right-2 bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded-full">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className={`border ${plan.highlighted ? 'border-[#288283] shadow-md' : 'border-gray-200'}`}
          >
            {plan.highlighted && (
              <div className="bg-[#288283] text-white text-xs text-center py-1 px-2 rounded-t-md font-medium">
                MOST POPULAR
              </div>
            )}
            <CardHeader className={`${plan.highlighted ? 'pt-4' : 'pt-6'}`}>
              <CardTitle>
                <div className="flex items-baseline">
                  <span className="text-xl md:text-2xl font-bold">{plan.name}</span>
                  <span className="ml-2 text-xs text-gray-500">Plan</span>
                </div>
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-3xl md:text-4xl font-bold">
                    {billingPeriod === "monthly" ? plan.price.monthly : plan.price.yearly}
                  </span>
                  <span className="text-gray-500 text-sm ml-2">
                    {billingPeriod === "yearly" ? "/year" : "/month"}
                  </span>
                </div>
                {billingPeriod === "yearly" && plan.name !== "Free" && (
                  <p className="text-green-600 text-xs mt-1">Save 20% with annual billing</p>
                )}
              </div>

              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex text-sm">
                    <div className="mr-2 mt-1 flex-shrink-0">
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handlePlanSelect(plan.name)}
                className={`w-full ${
                  plan.highlighted
                    ? "bg-[#288283] hover:bg-[#1e6c6d]"
                    : plan.name === "Free"
                    ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    : "bg-white text-[#288283] border-[#288283] hover:bg-[#f0f9f9]"
                }`}
                variant={plan.highlighted ? "default" : plan.name === "Free" ? "secondary" : "outline"}
              >
                {plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-6">Frequently Asked Questions</h2>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4 md:p-5">
            <h3 className="font-medium text-base md:text-lg mb-2">Can I change plans later?</h3>
            <p className="text-sm md:text-base text-gray-600">
              Yes, you can upgrade, downgrade, or cancel your plan at any time.
              When upgrading, you'll be charged the prorated amount for the remainder of your billing period.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 md:p-5">
            <h3 className="font-medium text-base md:text-lg mb-2">How does the Free plan work?</h3>
            <p className="text-sm md:text-base text-gray-600">
              The Free plan allows you to use our basic PDF tools with some limitations.
              You can perform up to 5 operations per day, and files are limited to 10MB.
              Processed PDFs will include a small watermark.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 md:p-5">
            <h3 className="font-medium text-base md:text-lg mb-2">What payment methods do you accept?</h3>
            <p className="text-sm md:text-base text-gray-600">
              We accept all major credit cards (Visa, Mastercard, American Express), as well as
              PayPal. For Business plans, we also offer invoice-based payment options.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 md:p-5">
            <h3 className="font-medium text-base md:text-lg mb-2">Is my data secure?</h3>
            <p className="text-sm md:text-base text-gray-600">
              Yes, we take security seriously. All file transfers are encrypted using TLS, and
              your files are automatically deleted after the storage period for your plan
              (24 hours for Free, 7 days for Pro, and 30 days for Business).
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-12 bg-[#f0f9f9] rounded-lg p-6 md:p-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-[#288283] rounded-full text-white mb-4">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold mb-3">Need a custom solution?</h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-6 text-sm md:text-base">
          If you have unique requirements or need higher volume processing,
          we offer custom enterprise solutions tailored to your needs.
        </p>
        <Button
          asChild
          className="bg-[#288283] hover:bg-[#1e6c6d]"
        >
          <Link href="/contact">Contact Sales</Link>
        </Button>
      </div>
    </div>
  );
}
