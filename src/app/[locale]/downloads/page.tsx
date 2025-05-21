"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Download,
  FileText,
  Trash2,
  Clock,
  Filter,
  Search,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { defaultLocale } from '@/i18n';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    locale: string;
  };
}

interface FileItem {
  id: string;
  filename: string;
  type: string;
  operation: string;
  operationType: "compress" | "edit" | "merge" | "convert" | "security";
  size: string;
  processedDate: string;
  expiryDate: string;
  selected?: boolean;
}

// Simple translations object for downloads section
const translations = {
  en: {
    title: "My Downloads",
    subtitle: "Processed files are available for download for up to 7 days",
    search_placeholder: "Search files...",
    file_type: "File Type",
    all_types: "All Types",
    operation: "Operation",
    all_operations: "All Operations",
    delete_selected: "Delete ({count})",
    no_files: {
      title: "No files found",
      filters_active: "Try adjusting your filters",
      no_files: "Process some PDFs to see them here"
    },
    file_name: "File Name",
    actions: "Actions",
    download: "Download",
    delete: "Delete",
    delete_confirmation: {
      title: "{count, plural, one {Delete File} other {Delete Files}}",
      message: "Are you sure you want to delete {count} {count, plural, one {file} other {files}}? This action cannot be undone.",
      cancel: "Cancel",
      confirm: "Delete"
    },
    file_size: "{size}",
    expires: "Expires {date}"
  },
  // Basic translations for other languages
  es: {
    title: "Mis Descargas",
    subtitle: "Los archivos procesados están disponibles para descargar hasta por 7 días",
    search_placeholder: "Buscar archivos...",
    file_type: "Tipo de Archivo",
    all_types: "Todos los Tipos",
    operation: "Operación",
    all_operations: "Todas las Operaciones",
    delete_selected: "Eliminar ({count})",
    no_files: {
      title: "No se encontraron archivos",
      filters_active: "Intente ajustar sus filtros",
      no_files: "Procese algunos PDF para verlos aquí"
    },
    file_name: "Nombre del Archivo",
    actions: "Acciones",
    download: "Descargar",
    delete: "Eliminar",
    delete_confirmation: {
      title: "{count, plural, one {Eliminar Archivo} other {Eliminar Archivos}}",
      message: "¿Está seguro de que desea eliminar {count} {count, plural, one {archivo} other {archivos}}? Esta acción no se puede deshacer.",
      cancel: "Cancelar",
      confirm: "Eliminar"
    },
    file_size: "{size}",
    expires: "Expira {date}"
  },
  fr: {
    title: "Mes Téléchargements",
    subtitle: "Les fichiers traités sont disponibles au téléchargement pendant 7 jours",
    search_placeholder: "Rechercher des fichiers...",
    file_type: "Type de Fichier",
    all_types: "Tous les Types",
    operation: "Opération",
    all_operations: "Toutes les Opérations",
    delete_selected: "Supprimer ({count})",
    no_files: {
      title: "Aucun fichier trouvé",
      filters_active: "Essayez d'ajuster vos filtres",
      no_files: "Traitez des PDF pour les voir ici"
    },
    file_name: "Nom du Fichier",
    actions: "Actions",
    download: "Télécharger",
    delete: "Supprimer",
    delete_confirmation: {
      title: "{count, plural, one {Supprimer le Fichier} other {Supprimer les Fichiers}}",
      message: "Êtes-vous sûr de vouloir supprimer {count} {count, plural, one {fichier} other {fichiers}}? Cette action ne peut pas être annulée.",
      cancel: "Annuler",
      confirm: "Supprimer"
    },
    file_size: "{size}",
    expires: "Expire le {date}"
  },
};

// Simple translation function with fallback to English
function useSimpleTranslations(section: string, locale: string) {
  return function getTranslation(key: string, replacements?: Record<string, any>) {
    let keys = key.split('.');
    let result: any = translations[locale as keyof typeof translations] || translations[defaultLocale];

    // Navigate through the keys
    for (const k of keys) {
      result = result?.[k];
      if (!result) {
        // Fallback to English if translation not found
        result = translations[defaultLocale];
        for (const k of keys) {
          result = result?.[k];
          if (!result) break;
        }
        break;
      }
    }

    if (typeof result !== 'string') {
      return key; // Return the key if not found
    }

    // Handle replacements
    if (replacements) {
      return result.replace(/{([^}]+)}/g, (match, key) => {
        // Handle plural forms with a simple implementation
        if (key.includes('plural')) {
          const [countVar, ...pluralForms] = key.split(',').map(s => s.trim());
          const count = replacements[countVar.split(' ')[0]];
          const pluralForm = count === 1 ? 'one' : 'other';

          // Find the right plural form from the replacements
          for (const form of pluralForms) {
            if (form.startsWith(pluralForm)) {
              return form.split(' ').slice(1).join(' ').replace(/[{}]/g, '');
            }
          }
          return match;
        }

        return replacements[key] !== undefined ? replacements[key] : match;
      });
    }

    return result;
  };
}

export default function DownloadsPage({ params }: PageProps) {
  const locale = params.locale;
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedOperation, setSelectedOperation] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Get translations using simple function instead of next-intl
  const t = useSimpleTranslations('downloads', locale);

  // Mock files data
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: "file-1",
      filename: "annual-report-2024.pdf",
      type: "PDF",
      operation: "Compressed",
      operationType: "compress",
      size: "2.4 MB",
      processedDate: "May 19, 2025",
      expiryDate: "May 26, 2025",
    },
    {
      id: "file-2",
      filename: "contract-final.pdf",
      type: "PDF",
      operation: "Protected",
      operationType: "security",
      size: "3.1 MB",
      processedDate: "May 18, 2025",
      expiryDate: "May 25, 2025",
    },
    {
      id: "file-3",
      filename: "presentation-slides.pdf",
      type: "PDF",
      operation: "Merged",
      operationType: "merge",
      size: "5.7 MB",
      processedDate: "May 17, 2025",
      expiryDate: "May 24, 2025",
    },
    {
      id: "file-4",
      filename: "invoice-april.pdf",
      type: "PDF",
      operation: "Watermarked",
      operationType: "edit",
      size: "0.8 MB",
      processedDate: "May 16, 2025",
      expiryDate: "May 23, 2025",
    },
    {
      id: "file-5",
      filename: "product-images.pdf",
      type: "PDF",
      operation: "Converted from JPG",
      operationType: "convert",
      size: "4.5 MB",
      processedDate: "May 15, 2025",
      expiryDate: "May 22, 2025",
    },
  ]);

  // Check if user is authenticated
  if (status === "loading") {
    return (
      <div className="container py-10 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push(`/${locale}/auth/login`);
    return null;
  }

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.filename
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = selectedType ? file.type === selectedType : true;
    const matchesOperation = selectedOperation
      ? file.operationType === selectedOperation
      : true;
    return matchesSearch && matchesType && matchesOperation;
  });

  const handleSelectFile = (id: string) => {
    setSelectedFiles((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map((file) => file.id));
    }
    setSelectAll(!selectAll);
  };

  const handleDeleteSelected = () => {
    setFiles((prevFiles) =>
      prevFiles.filter((file) => !selectedFiles.includes(file.id))
    );
    setSelectedFiles([]);
    setSelectAll(false);
    setConfirmDelete(false);
  };

  const getOperationColor = (operationType: string) => {
    switch (operationType) {
      case "compress":
        return "bg-blue-100 text-blue-700";
      case "edit":
        return "bg-green-100 text-green-700";
      case "merge":
        return "bg-orange-100 text-orange-700";
      case "convert":
        return "bg-purple-100 text-purple-700";
      case "security":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="container py-6 md:py-10 px-4">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">{t("title")}</h1>
        <p className="text-gray-500 text-sm md:text-base">
          {t("subtitle")}
        </p>
      </div>

      {/* Actions and Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Input
            placeholder={t("search_placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-sm"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex gap-1 text-xs md:text-sm"
              >
                <Filter className="h-3.5 w-3.5" />
                <span>{t("file_type")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuCheckboxItem
                checked={selectedType === null}
                onCheckedChange={() => setSelectedType(null)}
              >
                {t("all_types")}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedType === "PDF"}
                onCheckedChange={() => setSelectedType("PDF")}
              >
                PDF
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedType === "Image"}
                onCheckedChange={() => setSelectedType("Image")}
              >
                Image
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex gap-1 text-xs md:text-sm"
              >
                <Filter className="h-3.5 w-3.5" />
                <span>{t("operation")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuCheckboxItem
                checked={selectedOperation === null}
                onCheckedChange={() => setSelectedOperation(null)}
              >
                {t("all_operations")}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedOperation === "compress"}
                onCheckedChange={() => setSelectedOperation("compress")}
              >
                Compress
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedOperation === "edit"}
                onCheckedChange={() => setSelectedOperation("edit")}
              >
                Edit
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedOperation === "merge"}
                onCheckedChange={() => setSelectedOperation("merge")}
              >
                Merge
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedOperation === "convert"}
                onCheckedChange={() => setSelectedOperation("convert")}
              >
                Convert
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedOperation === "security"}
                onCheckedChange={() => setSelectedOperation("security")}
              >
                Security
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {selectedFiles.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50 text-xs md:text-sm"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              {t("delete_selected", { count: selectedFiles.length })}
            </Button>
          )}
        </div>
      </div>

      {/* File List */}
      {filteredFiles.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-700 mb-1">{t("no_files.title")}</h3>
          <p className="text-gray-500 text-sm">
            {searchQuery || selectedType || selectedOperation
              ? t("no_files.filters_active")
              : t("no_files.no_files")}
          </p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 p-3 md:p-4 grid grid-cols-10 gap-3 text-xs md:text-sm font-medium text-gray-500 border-b">
            <div className="col-span-1">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-gray-300 text-[#288283] focus:ring-[#288283]"
                />
              </div>
            </div>
            <div className="col-span-4 sm:col-span-5">{t("file_name")}</div>
            <div className="col-span-3 sm:col-span-2">{t("operation")}</div>
            <div className="col-span-2 text-right">{t("actions")}</div>
          </div>

          {/* File Rows */}
          <div className="divide-y">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="p-3 md:p-4 grid grid-cols-10 gap-3 items-center text-sm hover:bg-gray-50"
              >
                <div className="col-span-1">
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.id)}
                    onChange={() => handleSelectFile(file.id)}
                    className="h-4 w-4 rounded border-gray-300 text-[#288283] focus:ring-[#288283]"
                  />
                </div>
                <div className="col-span-4 sm:col-span-5">
                  <div className="flex items-center">
                    <div className="h-9 w-9 rounded-md bg-gray-100 flex items-center justify-center mr-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{file.filename}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-0.5">
                        <span className="mr-2">{t("file_size", { size: file.size })}</span>
                        <span>•</span>
                        <span className="ml-2 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {t("expires", { date: file.expiryDate })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-3 sm:col-span-2">
                  <span
                    className={`text-xs py-1 px-2 rounded-full inline-block ${getOperationColor(
                      file.operationType
                    )}`}
                  >
                    {file.operation}
                  </span>
                </div>
                <div className="col-span-2 flex justify-end space-x-2">
                  <Button
                    size="sm"
                    className="h-8 w-8 p-0 bg-[#288283] hover:bg-[#1e6c6d]"
                    title={t("download")}
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
                    title={t("delete")}
                    onClick={() => {
                      setSelectedFiles([file.id]);
                      setConfirmDelete(true);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {t("delete_confirmation.title", { count: selectedFiles.length })}
            </DialogTitle>
            <DialogDescription>
              {t("delete_confirmation.message", { count: selectedFiles.length })}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmDelete(false)}
            >
              {t("delete_confirmation.cancel")}
            </Button>
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 flex items-center"
              onClick={handleDeleteSelected}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              {t("delete_confirmation.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
