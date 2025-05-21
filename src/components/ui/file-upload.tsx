"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { CloudUpload, FileText, X } from "lucide-react";

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  accept?: string;
  maxSize?: number; // in MB
  file: File | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileChange,
  accept = ".pdf",
  maxSize = 50, // Default 50MB
  file,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Check file size
      if (selectedFile.size > maxSize * 1024 * 1024) {
        alert(`File size should not exceed ${maxSize}MB`);
        return;
      }

      onFileChange(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];

      // Check file size
      if (droppedFile.size > maxSize * 1024 * 1024) {
        alert(`File size should not exceed ${maxSize}MB`);
        return;
      }

      onFileChange(droppedFile);
    }
  };

  const handleRemoveFile = () => {
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div>
      {!file ? (
        <div
          className={`border-2 border-dashed rounded-lg transition
            ${isDragging ? "border-[#288283] bg-[#f0f9f9]" : "border-gray-300 hover:bg-gray-50"}
            p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center cursor-pointer`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <CloudUpload className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-gray-400 mb-2 sm:mb-3" />
          <p className="text-center text-xs sm:text-sm md:text-base text-gray-600 mb-1 sm:mb-2">
            Drag and drop your file here or click to browse
          </p>
          <p className="text-center text-xs sm:text-xs text-gray-400">
            Maximum file size: {maxSize}MB
          </p>
          <input
            type="file"
            accept={accept}
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="border border-gray-300 rounded-lg p-2 sm:p-3 md:p-4 flex items-center">
          <div className="bg-gray-100 p-1.5 sm:p-2 rounded-md mr-2 sm:mr-3 md:mr-4">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-[#288283]" />
          </div>
          <div className="flex-grow min-w-0">
            <p className="font-medium text-xs sm:text-sm md:text-base truncate">{file.name}</p>
            <p className="text-xs text-gray-500">
              {formatFileSize(file.size)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemoveFile}
            aria-label="Remove file"
            className="ml-1 sm:ml-2 h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
