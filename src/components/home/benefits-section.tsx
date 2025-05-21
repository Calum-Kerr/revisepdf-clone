import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Rocket, Shield, Globe } from "lucide-react";
import { Locale, getMessages } from "@/lib/i18n";

interface Benefit {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface BenefitsSectionProps {
  locale: Locale;
}

export async function BenefitsSection({ locale }: BenefitsSectionProps) {
  // Get translations for the component
  const messages = await getMessages(locale);
  const benefitsText = messages.benefits || {
    title: "Why Choose RevisePDF",
    items: [
      {
        title: "Free & Fast",
        description: "All tools are completely free and optimised for speed."
      },
      {
        title: "Secure & Private",
        description: "Your files are processed securely and deleted after processing."
      },
      {
        title: "Accessible Anywhere",
        description: "Access our tools from any device with an internet connection."
      }
    ]
  };

  // Use translated content if available or fallback to defaults
  const benefits: Benefit[] = (benefitsText.items || []).map((item, index) => {
    const icons = [
      <Rocket key="rocket" className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />,
      <Shield key="shield" className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />,
      <Globe key="globe" className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
    ];

    return {
      title: item.title || "",
      description: item.description || "",
      icon: icons[index % icons.length] // cycle through icons
    };
  });

  return (
    <div className="container px-4 mb-10 sm:mb-12 md:mb-16">
      <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-center mb-4 sm:mb-6 md:mb-8 text-[#238287]">
        {benefitsText.title || "Why Choose RevisePDF"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {benefits.map((benefit, index) => (
          <Card key={index} className="border border-gray-200">
            <CardContent className="flex flex-col items-center p-3 sm:p-4 md:p-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[#238287] text-white rounded-full flex items-center justify-center mb-2 sm:mb-3 md:mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-800 mb-1 sm:mb-2 text-center">
                {benefit.title}
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 text-center">
                {benefit.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default BenefitsSection;
