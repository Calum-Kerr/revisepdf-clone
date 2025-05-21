import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileDown,
  FileUp,
  FileEdit,
  FolderCog,
  FileOutput,
  Lock
} from "lucide-react";
import { Locale, getMessages } from "@/lib/i18n";

// Tool category interface
interface ToolCategory {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  bgColor: string;
}

interface ToolGridProps {
  locale: Locale;
}

export async function ToolGrid({ locale }: ToolGridProps) {
  // Get translations for the component
  const messages = await getMessages(locale);
  const toolsText = messages.tools || {
    section_title: "All PDF Tools",
    optimise: { title: "Optimise", description: "Compress, repair, and OCR your PDFs" },
    convert_to_pdf: { title: "Convert to PDF", description: "Images, Office docs, HTML to PDF" },
    edit: { title: "Edit", description: "Add page numbers, watermarks, edit content" },
    organise: { title: "Organise", description: "Merge, split, extract, and rotate pages" },
    convert_from_pdf: { title: "Convert from PDF", description: "PDFs to images, panoramic views, PDF/A" },
    security: { title: "Security", description: "Unlock, protect, redact, and flatten PDFs" }
  };

  // Build tool categories with translations
  const toolCategories: ToolCategory[] = [
    {
      title: toolsText.optimise?.title || "Optimise",
      description: toolsText.optimise?.description || "Compress, repair, and OCR your PDFs",
      href: `/${locale}/optimise`,
      icon: <FileDown className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />,
      bgColor: "bg-[#238287]",
    },
    {
      title: toolsText.convert_to_pdf?.title || "Convert to PDF",
      description: toolsText.convert_to_pdf?.description || "Images, Office docs, HTML to PDF",
      href: `/${locale}/convert-to-pdf`,
      icon: <FileUp className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />,
      bgColor: "bg-[#238287]",
    },
    {
      title: toolsText.edit?.title || "Edit",
      description: toolsText.edit?.description || "Add page numbers, watermarks, edit content",
      href: `/${locale}/edit`,
      icon: <FileEdit className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />,
      bgColor: "bg-[#238287]",
    },
    {
      title: toolsText.organise?.title || "Organise",
      description: toolsText.organise?.description || "Merge, split, extract, and rotate pages",
      href: `/${locale}/organise`,
      icon: <FolderCog className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />,
      bgColor: "bg-[#238287]",
    },
    {
      title: toolsText.convert_from_pdf?.title || "Convert from PDF",
      description: toolsText.convert_from_pdf?.description || "PDFs to images, panoramic views, PDF/A",
      href: `/${locale}/convert-from-pdf`,
      icon: <FileOutput className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />,
      bgColor: "bg-[#238287]",
    },
    {
      title: toolsText.security?.title || "Security",
      description: toolsText.security?.description || "Unlock, protect, redact, and flatten PDFs",
      href: `/${locale}/security`,
      icon: <Lock className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />,
      bgColor: "bg-[#238287]",
    },
  ];

  return (
    <div className="container px-4 mb-10 sm:mb-12 md:mb-16">
      <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-center mb-4 sm:mb-6 md:mb-8 text-[#238287]">
        {toolsText.section_title || "All PDF Tools"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {toolCategories.map((category, index) => (
          <Link href={category.href} key={index}>
            <Card className="h-full hover:shadow-md transition-shadow border border-gray-200">
              <CardContent className="flex flex-col items-center p-3 sm:p-4 md:p-6">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 ${category.bgColor} rounded-full flex items-center justify-center mb-2 sm:mb-3 md:mb-4`}>
                  {category.icon}
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-medium text-[#238287] mb-1 sm:mb-2 text-center">
                  {category.title}
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 text-center">
                  {category.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ToolGrid;
