"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileText, Trash2, Clock, Filter, Search } from "lucide-react";
import { useMockSession } from "@/providers/auth-provider";

interface PageProps {
  params: {
    locale: string;
  };
}

// Mock data for processing history
const mockHistory = [
  {
    id: "1",
    filename: "report-2025.pdf",
    operation: "Compress",
    date: "2025-04-18T14:30:00Z",
    size: "2.4 MB",
    resultSize: "1.1 MB",
  },
  {
    id: "2",
    filename: "contract-final.pdf",
    operation: "Convert to PDF",
    date: "2025-04-17T09:15:00Z",
    size: "1.8 MB",
    resultSize: "1.8 MB",
  },
  {
    id: "3",
    filename: "presentation.pdf",
    operation: "Add Watermark",
    date: "2025-04-15T16:45:00Z",
    size: "5.2 MB",
    resultSize: "5.3 MB",
  },
  {
    id: "4",
    filename: "invoice-march.pdf",
    operation: "Merge",
    date: "2025-04-10T11:20:00Z",
    size: "0.8 MB",
    resultSize: "0.8 MB",
  },
  {
    id: "5",
    filename: "document-scan.pdf",
    operation: "OCR",
    date: "2025-04-05T13:10:00Z",
    size: "3.1 MB",
    resultSize: "3.2 MB",
  },
];

export default function HistoryPage({ params }: PageProps) {
  const { locale } = params;
  const router = useRouter();
  
  // Get authentication status
  const mockSession = useMockSession();
  const { data: session, status } = useSession();
  
  // Determine which session to use based on environment
  const isDemoMode = process.env.NEXTAUTH_DEMO_MODE === "true";
  const activeSession = isDemoMode ? mockSession : { data: session, status };
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHistory, setFilteredHistory] = useState(mockHistory);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (activeSession.status === "unauthenticated") {
      router.push(`/${locale}/auth/login`);
    }
  }, [activeSession.status, router, locale]);
  
  // Filter history based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredHistory(mockHistory);
    } else {
      const filtered = mockHistory.filter(
        (item) =>
          item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.operation.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredHistory(filtered);
    }
  }, [searchTerm]);
  
  // Show loading state while checking authentication
  if (activeSession.status === "loading") {
    return (
      <div className="container py-10">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#238287]"></div>
        </div>
        <p className="text-center mt-4">Loading history...</p>
      </div>
    );
  }
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  
  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Processing History</h1>
          <p className="text-gray-600">
            View and manage your PDF processing history
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-auto flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by filename or operation"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Button variant="outline" className="w-full sm:w-auto flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Filename</TableHead>
                    <TableHead>Operation</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Original Size</TableHead>
                    <TableHead>Result Size</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.length > 0 ? (
                    filteredHistory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium flex items-center gap-2">
                          <FileText className="h-4 w-4 text-[#238287]" />
                          {item.filename}
                        </TableCell>
                        <TableCell>{item.operation}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            {formatDate(item.date)}
                          </div>
                        </TableCell>
                        <TableCell>{item.size}</TableCell>
                        <TableCell>{item.resultSize}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              title="Download"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <FileText className="h-12 w-12 mb-2 text-gray-300" />
                          <p className="text-lg font-medium">No results found</p>
                          <p className="text-sm">
                            {searchTerm
                              ? "Try a different search term"
                              : "Your processing history will appear here"}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
