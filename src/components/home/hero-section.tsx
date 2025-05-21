import React from "react";
import { Locale, getMessages } from "@/lib/i18n";

interface HeroSectionProps {
  locale: Locale;
}

export async function HeroSection({ locale }: HeroSectionProps) {
  // Get translations for the component
  const messages = await getMessages(locale);
  const heroText = messages.hero || {
    title: "The Ultimate PDF Toolkit for Every Need",
    subtitle: "Optimise, Convert, Edit, Organise, and More - All your PDF needs in one place."
  };

  return (
    <div className="bg-primary py-8 sm:py-10 md:py-14 lg:py-16 mb-6 sm:mb-8 md:mb-10 text-white text-center">
      <div className="container px-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium mb-2 sm:mb-3 md:mb-4 leading-tight">
          {heroText.title}
        </h1>
        <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2 sm:px-4">
          {heroText.subtitle}
        </p>
      </div>
    </div>
  );
}

export default HeroSection;
