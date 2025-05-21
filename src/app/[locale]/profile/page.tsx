"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Download,
  Calendar,
  User,
  Settings,
  History,
  Clock,
  Zap,
  HardDrive,
  BarChart3
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { defaultLocale } from '@/i18n';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    locale: string;
  };
}

// Simple translations object for profile section
const translations = {
  en: {
    title: "{name}'s Profile",
    subtitle: "Your PDF tools usage and account information",
    account_overview: "Account Overview",
    account_type: "Account Type",
    free: "Free",
    upgrade_message: "Upgrade for unlimited access",
    upgrade_button: "Upgrade Now",
    storage_used: "Storage Used",
    storage_limit: "of {limit} GB",
    storage_percent: "{percent}% of your storage used",
    files_processed: "Files Processed",
    files_increase: "{percent}% more than last month",
    member_since: "Member Since",
    days_ago: "{days} days ago",
    account_actions: {
      account_settings: "Account Settings",
      processing_history: "Processing History",
      my_downloads: "My Downloads",
      security_settings: "Security Settings"
    },
    recent_activity: {
      title: "Recent Activity",
      view_all: "View All",
      no_activity: "No recent activity",
      expires: "Expires {date}"
    },
    quick_actions: {
      title: "Quick Actions",
      compress: "Compress PDF",
      edit: "Edit PDF",
      merge: "Merge PDFs",
      convert: "Convert to PDF",
      protect: "Protect PDF",
      ocr: "OCR PDF"
    }
  },
  es: {
    title: "Perfil de {name}",
    subtitle: "Uso de herramientas PDF e información de la cuenta",
    account_overview: "Resumen de la Cuenta",
    account_type: "Tipo de Cuenta",
    free: "Gratuita",
    upgrade_message: "Actualice para acceso ilimitado",
    upgrade_button: "Actualizar Ahora",
    storage_used: "Almacenamiento Usado",
    storage_limit: "de {limit} GB",
    storage_percent: "{percent}% de su almacenamiento usado",
    files_processed: "Archivos Procesados",
    files_increase: "{percent}% más que el mes pasado",
    member_since: "Miembro Desde",
    days_ago: "Hace {days} días",
    account_actions: {
      account_settings: "Ajustes de Cuenta",
      processing_history: "Historial de Procesamiento",
      my_downloads: "Mis Descargas",
      security_settings: "Ajustes de Seguridad"
    },
    recent_activity: {
      title: "Actividad Reciente",
      view_all: "Ver Todo",
      no_activity: "Sin actividad reciente",
      expires: "Expira {date}"
    },
    quick_actions: {
      title: "Acciones Rápidas",
      compress: "Comprimir PDF",
      edit: "Editar PDF",
      merge: "Combinar PDFs",
      convert: "Convertir a PDF",
      protect: "Proteger PDF",
      ocr: "OCR PDF"
    }
  },
  fr: {
    title: "Profil de {name}",
    subtitle: "Utilisation de vos outils PDF et informations de compte",
    account_overview: "Aperçu du Compte",
    account_type: "Type de Compte",
    free: "Gratuit",
    upgrade_message: "Passez à la version premium pour un accès illimité",
    upgrade_button: "Mettre à Niveau",
    storage_used: "Stockage Utilisé",
    storage_limit: "sur {limit} GB",
    storage_percent: "{percent}% de votre stockage utilisé",
    files_processed: "Fichiers Traités",
    files_increase: "{percent}% de plus que le mois dernier",
    member_since: "Membre Depuis",
    days_ago: "Il y a {days} jours",
    account_actions: {
      account_settings: "Paramètres du Compte",
      processing_history: "Historique de Traitement",
      my_downloads: "Mes Téléchargements",
      security_settings: "Paramètres de Sécurité"
    },
    recent_activity: {
      title: "Activité Récente",
      view_all: "Voir Tout",
      no_activity: "Aucune activité récente",
      expires: "Expire le {date}"
    },
    quick_actions: {
      title: "Actions Rapides",
      compress: "Compresser PDF",
      edit: "Éditer PDF",
      merge: "Fusionner PDFs",
      convert: "Convertir en PDF",
      protect: "Protéger PDF",
      ocr: "OCR PDF"
    }
  }
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
        return replacements[key] !== undefined ? replacements[key] : match;
      });
    }

    return result;
  };
}

// Mock activity data
const recentActivities = [
  {
    id: 1,
    fileName: "report-2024.pdf",
    action: "Compressed",
    date: "2 hours ago",
  },
  {
    id: 2,
    fileName: "contract-final.pdf",
    action: "Added watermark",
    date: "Yesterday",
  },
  {
    id: 3,
    fileName: "presentation.pdf",
    action: "Merged with 2 files",
    date: "May 18, 2025",
  },
  {
    id: 4,
    fileName: "invoice-april.pdf",
    action: "Protected",
    date: "May 16, 2025",
  },
];

export default function ProfilePage({ params }: PageProps) {
  const locale = params.locale;
  const { data: session, status } = useSession();
  const router = useRouter();

  // Get translations using simple function instead of next-intl
  const t = useSimpleTranslations('profile', locale);

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

  const userName = session?.user?.name || "User";

  return (
    <div className="container py-6 md:py-10 px-4">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">
          {t("title", { name: userName })}
        </h1>
        <p className="text-gray-500 text-sm md:text-base">
          {t("subtitle")}
        </p>
      </div>

      {/* Account Overview */}
      <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="bg-gradient-to-br from-[#288283] to-[#1e6c6d] text-white">
          <CardContent className="p-4 md:p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-sm md:text-base">{t("account_type")}</h3>
              <Zap className="h-4 w-4 md:h-5 md:w-5" />
            </div>
            <div className="text-2xl md:text-3xl font-bold mb-2">{t("free")}</div>
            <p className="text-xs md:text-sm opacity-80 mb-4">{t("upgrade_message")}</p>
            <Button
              className="mt-auto bg-white text-[#288283] hover:bg-gray-100 text-xs md:text-sm"
              asChild
            >
              <Link href={`/${locale}/plans`}>{t("upgrade_button")}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-sm md:text-base text-gray-700">{t("storage_used")}</h3>
              <HardDrive className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
            </div>
            <div className="flex justify-between items-end mb-2">
              <div className="text-xl md:text-2xl font-semibold">3.2 GB</div>
              <div className="text-xs text-gray-500">{t("storage_limit", { limit: 5 })}</div>
            </div>
            <Progress value={64} className="h-2 mb-2" />
            <p className="text-xs text-gray-500">{t("storage_percent", { percent: 64 })}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-sm md:text-base text-gray-700">{t("files_processed")}</h3>
              <FileText className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
            </div>
            <div className="text-xl md:text-2xl font-semibold mb-1">42</div>
            <div className="flex items-center text-xs text-green-600">
              <BarChart3 className="h-3 w-3 mr-1" />
              <span>{t("files_increase", { percent: 12 })}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-sm md:text-base text-gray-700">{t("member_since")}</h3>
              <Calendar className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
            </div>
            <div className="text-xl md:text-2xl font-semibold mb-1">May 2025</div>
            <p className="text-xs text-gray-500">{t("days_ago", { days: 14 })}</p>
          </CardContent>
        </Card>
      </div>

      {/* Account Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <Button
          variant="outline"
          className="h-auto py-3 px-2 md:px-4 flex flex-col items-center justify-center text-xs md:text-sm gap-1 md:gap-2"
          asChild
        >
          <Link href={`/${locale}/account`}>
            <Settings className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
            <span>{t("account_actions.account_settings")}</span>
          </Link>
        </Button>

        <Button
          variant="outline"
          className="h-auto py-3 px-2 md:px-4 flex flex-col items-center justify-center text-xs md:text-sm gap-1 md:gap-2"
          asChild
        >
          <Link href={`/${locale}/history`}>
            <History className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
            <span>{t("account_actions.processing_history")}</span>
          </Link>
        </Button>

        <Button
          variant="outline"
          className="h-auto py-3 px-2 md:px-4 flex flex-col items-center justify-center text-xs md:text-sm gap-1 md:gap-2"
          asChild
        >
          <Link href={`/${locale}/downloads`}>
            <Download className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
            <span>{t("account_actions.my_downloads")}</span>
          </Link>
        </Button>

        <Button
          variant="outline"
          className="h-auto py-3 px-2 md:px-4 flex flex-col items-center justify-center text-xs md:text-sm gap-1 md:gap-2"
          asChild
        >
          <Link href={`/${locale}/account?tab=security`}>
            <User className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
            <span>{t("account_actions.security_settings")}</span>
          </Link>
        </Button>
      </div>

      {/* Recent Activity */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-semibold">{t("recent_activity.title")}</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-[#288283] hover:text-[#1e6c6d] hover:bg-[#f0f9f9] text-xs md:text-sm"
            asChild
          >
            <Link href={`/${locale}/history`}>{t("recent_activity.view_all")}</Link>
          </Button>
        </div>

        <div className="border rounded-lg divide-y">
          {recentActivities.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">{t("recent_activity.no_activity")}</p>
            </div>
          ) : (
            recentActivities.map((activity) => (
              <div key={activity.id} className="p-3 md:p-4 flex items-center hover:bg-gray-50">
                <div className="bg-[#f0f9f9] p-2 rounded-md mr-3 md:mr-4">
                  <FileText className="h-4 w-4 md:h-5 md:w-5 text-[#288283]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm md:text-base truncate">{activity.fileName}</p>
                  <p className="text-xs text-gray-500">{activity.action}</p>
                </div>
                <div className="flex items-center text-xs text-gray-500 ml-3 shrink-0">
                  <Clock className="h-3 w-3 mr-1" />
                  {activity.date}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-lg md:text-xl font-semibold mb-4">{t("quick_actions.title")}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <Button
            className="h-auto py-6 flex flex-col items-center justify-center text-xs md:text-sm gap-2 bg-[#288283] hover:bg-[#1e6c6d]"
            asChild
          >
            <Link href={`/${locale}/optimise/compress`}>
              <FileText className="h-5 w-5 md:h-6 md:w-6" />
              <span>{t("quick_actions.compress")}</span>
            </Link>
          </Button>

          <Button
            className="h-auto py-6 flex flex-col items-center justify-center text-xs md:text-sm gap-2 bg-[#288283] hover:bg-[#1e6c6d]"
            asChild
          >
            <Link href={`/${locale}/edit/content`}>
              <FileText className="h-5 w-5 md:h-6 md:w-6" />
              <span>{t("quick_actions.edit")}</span>
            </Link>
          </Button>

          <Button
            className="h-auto py-6 flex flex-col items-center justify-center text-xs md:text-sm gap-2 bg-[#288283] hover:bg-[#1e6c6d]"
            asChild
          >
            <Link href={`/${locale}/organise/merge`}>
              <FileText className="h-5 w-5 md:h-6 md:w-6" />
              <span>{t("quick_actions.merge")}</span>
            </Link>
          </Button>

          <Button
            className="h-auto py-6 flex flex-col items-center justify-center text-xs md:text-sm gap-2 bg-[#288283] hover:bg-[#1e6c6d]"
            asChild
          >
            <Link href={`/${locale}/convert-to-pdf/image-to-pdf`}>
              <FileText className="h-5 w-5 md:h-6 md:w-6" />
              <span>{t("quick_actions.convert")}</span>
            </Link>
          </Button>

          <Button
            className="h-auto py-6 flex flex-col items-center justify-center text-xs md:text-sm gap-2 bg-[#288283] hover:bg-[#1e6c6d]"
            asChild
          >
            <Link href={`/${locale}/security/protect`}>
              <FileText className="h-5 w-5 md:h-6 md:w-6" />
              <span>{t("quick_actions.protect")}</span>
            </Link>
          </Button>

          <Button
            className="h-auto py-6 flex flex-col items-center justify-center text-xs md:text-sm gap-2 bg-[#288283] hover:bg-[#1e6c6d]"
            asChild
          >
            <Link href={`/${locale}/optimise/ocr`}>
              <FileText className="h-5 w-5 md:h-6 md:w-6" />
              <span>{t("quick_actions.ocr")}</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
