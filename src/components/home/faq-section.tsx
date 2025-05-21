import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Locale, getMessages } from "@/lib/i18n";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  locale: Locale;
}

export async function FaqSection({ locale }: FaqSectionProps) {
  // Get translations for the component
  const messages = await getMessages(locale);
  const faqText = messages.faq || {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What PDF tools does RevisePDF offer?",
        answer: "RevisePDF offers over 20 free PDF tools including compression, conversion (to and from PDF), editing (content, text, watermarks, page numbers), organisation (merge, split, extract, rotate), and security features (encryption, decryption, redaction, flattening). All tools are free to use and require no software installation.",
      },
      {
        question: "Is RevisePDF completely free to use?",
        answer: "Yes, RevisePDF is currently in beta mode with all features available for free. We plan to implement a subscription model in the future for larger file sizes, but we will always maintain a free tier with generous limits for basic PDF processing needs.",
      },
      {
        question: "How secure is RevisePDF for processing my PDF files?",
        answer: "RevisePDF takes security seriously. All file transfers are encrypted using HTTPS/TLS, and your files are automatically deleted after processing or after a short period (typically 24 hours). We never share your files with third parties, and our processing happens on secure servers with strict access controls.",
      },
      {
        question: "Do I need to create an account to use RevisePDF?",
        answer: "No, you can use most of RevisePDF's tools without creating an account. However, creating a free account gives you benefits like higher file size limits, the ability to save your processing history, and access to premium features when they become available.",
      },
      {
        question: "What is OCR and why would I need it for my PDFs?",
        answer: "OCR (Optical Character Recognition) is a technology that converts scanned documents or images containing text into searchable and editable PDF files. If you have scanned documents, using OCR allows you to search for text within the document, copy text from it, and make the document more accessible for screen readers and other assistive technologies.",
      }
    ]
  };

  const faqItems: FaqItem[] = faqText.items || [];

  return (
    <div className="container px-4 mb-10 sm:mb-12 md:mb-16">
      <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-center mb-4 sm:mb-6 md:mb-8 text-[#238287]">
        {faqText.title || "Frequently Asked Questions"}
      </h2>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="space-y-2 sm:space-y-3 md:space-y-4">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-gray-200 rounded-md overflow-hidden"
            >
              <AccordionTrigger className="px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-50 hover:no-underline text-xs sm:text-sm md:text-base font-medium">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base text-gray-600">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

export default FaqSection;
