"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DownloadCloud, FileText, Trash2, History, Info } from "lucide-react";

// Mock history data
const mockHistory = [
  {
    id: "1",
    fileName: "report-2024.pdf",
    operation: "compress",
    operationName: "Compress PDF",
    originalSize: "4.2 MB",
    newSize: "1.8 MB",
    date: "May 18, 2025",
    time: "14:35",
  },
  {
    id: "2",
    fileName: "presentation.pdf",
    operation: "edit",
    operationName: "Add Watermark",
    originalSize: "2.5 MB",
    newSize: "2.6 MB",
    date: "May 17, 2025",
    time: "09:12",
  },
  {
    id: "3",
    fileName: "contract.pdf",
    operation: "security",
    operationName: "Protect PDF",
    originalSize: "1.3 MB",
    newSize: "1.3 MB",
    date: "May 15, 2025",
    time: "19:45",
  },
  {
    id: "4",
    fileName: "invoice-april.pdf",
    operation: "organise",
    operationName: "Merge PDFs",
    originalSize: "0.8 MB",
    newSize: "1.5 MB",
    date: "May 12, 2025",
    time: "11:20",
  },
];

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Check if user is authenticated
  if (status === "loading") {
    return (
      <div className="container py-10 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth/login");
    return null;
  }

  // Operation colors for visual indicators
  const getOperationColor = (operation: string) => {
    switch (operation) {
      case "compress":
        return "bg-blue-100 text-blue-700";
      case "edit":
        return "bg-green-100 text-green-700";
      case "security":
        return "bg-purple-100 text-purple-700";
      case "organise":
        return "bg-orange-100 text-orange-700";
      case "convert":
        return "bg-teal-100 text-teal-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-2">Processing History</h1>
      <p className="text-gray-600 mb-8">Track all your PDF operations in one place</p>

      {mockHistory.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <History className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Processing History</h3>
            <p className="text-gray-500 mb-6">
              You haven't processed any PDF files yet. Start using our tools to see your history here.
            </p>
            <Button
              asChild
              className="bg-[#288283] hover:bg-[#1e6c6d]"
            >
              <Link href="/">Explore PDF Tools</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="bg-[#f0f9f9] border border-[#d0e8e8] rounded-md p-4 mb-6 flex items-start">
            <Info className="h-5 w-5 text-[#288283] mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-gray-700 text-sm">
              Your processing history is stored for 30 days. Files are automatically deleted 24 hours after processing for privacy reasons.
            </p>
          </div>

          <div className="space-y-4">
            {mockHistory.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4">
                    <div className="md:col-span-2 flex items-center">
                      <div className="mr-3">
                        <FileText className="h-10 w-10 text-[#288283]" />
                      </div>
                      <div>
                        <h3 className="font-medium truncate">{item.fileName}</h3>
                        <div className="flex items-center mt-1">
                          <span className={`text-xs py-1 px-2 rounded-full ${getOperationColor(item.operation)}`}>
                            {item.operationName}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-1 flex flex-col justify-center">
                      <p className="text-xs text-gray-500">Original Size</p>
                      <p className="font-medium">{item.originalSize}</p>
                    </div>

                    <div className="md:col-span-1 flex flex-col justify-center">
                      <p className="text-xs text-gray-500">New Size</p>
                      <p className="font-medium">{item.newSize}</p>
                    </div>

                    <div className="md:col-span-1 flex flex-col justify-center">
                      <p className="text-xs text-gray-500">Processed On</p>
                      <p className="font-medium">{item.date} <span className="text-gray-500">{item.time}</span></p>
                    </div>

                    <div className="md:col-span-1 flex items-center justify-end space-x-2">
                      <Button variant="outline" size="sm" className="h-9 px-2.5">
                        <DownloadCloud className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Download</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
