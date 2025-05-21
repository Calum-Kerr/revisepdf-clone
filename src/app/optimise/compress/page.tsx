"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";
import FileUpload from "@/components/ui/file-upload";

export default function CompressPage() {
  const [file, setFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<string>("ebook");

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
  };

  const handleCompressionLevelClick = (level: string) => {
    setCompressionLevel(level);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would call an API to process the PDF
    alert(`Compressing PDF with ${compressionLevel} compression level`);
  };

  return (
    <div>
      <div className="bg-primary py-6 sm:py-8 md:py-10 mb-4 sm:mb-5 text-white text-center">
        <div className="container px-4">
          <h1 className="text-lg sm:text-xl md:text-2xl font-medium mb-1 sm:mb-2 md:mb-3">Compress PDF</h1>
          <p className="text-xs sm:text-sm md:text-base mb-2 sm:mb-3 max-w-[600px] mx-auto">
            Reduce the size of your PDF for easier sharing, while maintaining acceptable quality.
          </p>
        </div>
      </div>

      <div className="container px-4 mb-6 sm:mb-8 md:mb-10">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 md:gap-6">
            {/* Upload Section */}
            <div className="w-full lg:w-1/2">
              <FileUpload
                onFileChange={handleFileChange}
                file={file}
                accept=".pdf"
                maxSize={50}
              />
            </div>

            {/* Options Panel */}
            <div className="w-full lg:w-1/2">
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4 md:p-6">
                <h3 className="text-sm sm:text-base md:text-lg font-medium mb-2 sm:mb-3 md:mb-4">Compression Options</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6">
                  <Card
                    className={`cursor-pointer border ${
                      compressionLevel === "screen"
                        ? "border-[#288283] bg-[#f0f9f9]"
                        : "border-gray-200"
                    }`}
                    onClick={() => handleCompressionLevelClick("screen")}
                  >
                    <CardContent className="p-2 sm:p-3 md:p-4">
                      <p className="font-medium text-xs sm:text-sm md:text-base">Screen</p>
                      <p className="text-xs md:text-sm text-gray-600">Low quality, smallest file size</p>
                      <p className="text-xs text-[#288283] mt-1">70-90% reduction</p>
                    </CardContent>
                  </Card>

                  <Card
                    className={`cursor-pointer border ${
                      compressionLevel === "ebook"
                        ? "border-[#288283] bg-[#f0f9f9]"
                        : "border-gray-200"
                    }`}
                    onClick={() => handleCompressionLevelClick("ebook")}
                  >
                    <CardContent className="p-2 sm:p-3 md:p-4">
                      <p className="font-medium text-xs sm:text-sm md:text-base">eBook</p>
                      <p className="text-xs md:text-sm text-gray-600">Medium quality, good file size</p>
                      <p className="text-xs text-[#288283] mt-1">50-70% reduction</p>
                    </CardContent>
                  </Card>

                  <Card
                    className={`cursor-pointer border ${
                      compressionLevel === "printer"
                        ? "border-[#288283] bg-[#f0f9f9]"
                        : "border-gray-200"
                    }`}
                    onClick={() => handleCompressionLevelClick("printer")}
                  >
                    <CardContent className="p-2 sm:p-3 md:p-4">
                      <p className="font-medium text-xs sm:text-sm md:text-base">Printer</p>
                      <p className="text-xs md:text-sm text-gray-600">High quality, larger file size</p>
                      <p className="text-xs text-[#288283] mt-1">30-50% reduction</p>
                    </CardContent>
                  </Card>

                  <Card
                    className={`cursor-pointer border ${
                      compressionLevel === "prepress"
                        ? "border-[#288283] bg-[#f0f9f9]"
                        : "border-gray-200"
                    }`}
                    onClick={() => handleCompressionLevelClick("prepress")}
                  >
                    <CardContent className="p-2 sm:p-3 md:p-4">
                      <p className="font-medium text-xs sm:text-sm md:text-base">Prepress</p>
                      <p className="text-xs md:text-sm text-gray-600">High quality with color preservation</p>
                      <p className="text-xs text-[#288283] mt-1">20-40% reduction</p>
                    </CardContent>
                  </Card>

                  <Card
                    className={`cursor-pointer border md:col-span-2 ${
                      compressionLevel === "default"
                        ? "border-[#288283] bg-[#f0f9f9]"
                        : "border-gray-200"
                    }`}
                    onClick={() => handleCompressionLevelClick("default")}
                  >
                    <CardContent className="p-2 sm:p-3 md:p-4">
                      <p className="font-medium text-xs sm:text-sm md:text-base">Default</p>
                      <p className="text-xs md:text-sm text-gray-600">Standard compression settings</p>
                      <p className="text-xs text-[#288283] mt-1">40-60% reduction</p>
                    </CardContent>
                  </Card>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#5b6e81] hover:bg-[#4a5a69] text-white text-xs sm:text-sm md:text-base py-1 sm:py-2"
                  disabled={!file}
                >
                  Compress PDF
                </Button>
              </div>
            </div>
          </div>
        </form>

        <div className="mt-6 sm:mt-8 md:mt-10">
          <h3 className="text-base sm:text-lg md:text-xl font-medium mb-2 sm:mb-3 md:mb-4">About PDF Compression</h3>

          <p className="mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base text-gray-700">
            PDF compression reduces the file size of your PDF documents while maintaining acceptable quality.
            This is useful for sharing documents via email, uploading to websites, or saving storage space.
          </p>

          <h4 className="text-sm sm:text-base md:text-lg font-medium mb-1 sm:mb-2">How It Works</h4>
          <p className="mb-1 sm:mb-2 text-xs sm:text-sm md:text-base text-gray-700">
            Our compression tool uses a high-quality PDF processing engine to optimise your PDF files.
            It works by:
          </p>
          <ul className="list-disc pl-4 sm:pl-5 md:pl-6 mb-3 sm:mb-4 text-xs sm:text-sm md:text-base text-gray-700">
            <li>Downsampling images to reduce their resolution</li>
            <li>Applying compression algorithms to images and text</li>
            <li>Removing unnecessary metadata and embedded fonts</li>
            <li>Optimising the internal structure of the PDF</li>
          </ul>

          <h4 className="text-sm sm:text-base md:text-lg font-medium mb-1 sm:mb-2">Choosing the Right Compression Level</h4>
          <p className="mb-1 sm:mb-2 text-xs sm:text-sm md:text-base text-gray-700">
            Different compression levels are suitable for different purposes:
          </p>
          <ul className="list-disc pl-4 sm:pl-5 md:pl-6 mb-3 sm:mb-4 text-xs sm:text-sm md:text-base text-gray-700">
            <li><strong>Screen:</strong> Best for documents that will only be viewed on screen</li>
            <li><strong>eBook:</strong> Good balance between quality and file size, suitable for most purposes</li>
            <li><strong>Printer:</strong> Better quality for documents that will be printed</li>
            <li><strong>Prepress:</strong> High quality with color preservation for professional printing</li>
          </ul>

          <div className="bg-[#e1f5f9] border-l-4 border-[#288283] p-2 sm:p-3 md:p-4 flex items-start">
            <Info className="h-4 w-4 md:h-5 md:w-5 text-[#288283] mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-xs sm:text-sm md:text-base text-gray-700">
              The actual compression ratio depends on the content of your PDF. Documents with many images will see greater reduction than text-only documents.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
