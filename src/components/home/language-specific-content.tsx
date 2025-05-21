'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Globe,
  MapPin,
  FileText,
  Users,
  CheckCircle,
  BookOpen,
  FileCheck,
  MessageCircle,
  Building,
  Landmark,
  ScrollText,
  ListChecks
} from 'lucide-react';
import { Link } from '@/i18n/config';

interface LanguageSpecificContentProps {
  locale: string;
}

export default function LanguageSpecificContent({ locale }: LanguageSpecificContentProps) {
  const t = useTranslations('home_localized');

  // Show this section only for non-English locales
  if (locale === 'en') {
    return null;
  }

  // Get region-specific information based on locale
  const getRegionInfo = () => {
    switch (locale) {
      case 'fr':
        return {
          region: 'France',
          icon: <Globe className="h-12 w-12 text-blue-600" />,
          color: 'bg-blue-50 border-blue-200',
          iconColor: 'text-blue-600',
          textColor: 'text-blue-800',
          buttonColor: 'bg-blue-600 hover:bg-blue-700',
          bottomBgColor: 'bg-blue-100',
          features: [
            { icon: <FileCheck className="h-5 w-5 text-blue-600" />, text: 'Conformité RGPD' },
            { icon: <BookOpen className="h-5 w-5 text-blue-600" />, text: 'Documentation en français' },
            { icon: <MessageCircle className="h-5 w-5 text-blue-600" />, text: 'Support en français' }
          ]
        };
      case 'es':
        return {
          region: 'España',
          icon: <Globe className="h-12 w-12 text-red-600" />,
          color: 'bg-red-50 border-red-200',
          iconColor: 'text-red-600',
          textColor: 'text-red-800',
          buttonColor: 'bg-red-600 hover:bg-red-700',
          bottomBgColor: 'bg-red-100',
          features: [
            { icon: <FileCheck className="h-5 w-5 text-red-600" />, text: 'Conformidad con normativas europeas' },
            { icon: <BookOpen className="h-5 w-5 text-red-600" />, text: 'Documentación en español' },
            { icon: <MessageCircle className="h-5 w-5 text-red-600" />, text: 'Soporte en español' }
          ]
        };
      case 'es-MX':
        return {
          region: 'México',
          icon: <MapPin className="h-12 w-12 text-green-600" />,
          color: 'bg-green-50 border-green-200',
          iconColor: 'text-green-600',
          textColor: 'text-green-800',
          buttonColor: 'bg-green-600 hover:bg-green-700',
          bottomBgColor: 'bg-green-100',
          features: [
            { icon: <Building className="h-5 w-5 text-green-600" />, text: 'Facturación compatible con SAT' },
            { icon: <BookOpen className="h-5 w-5 text-green-600" />, text: 'Documentación en español mexicano' },
            { icon: <MessageCircle className="h-5 w-5 text-green-600" />, text: 'Soporte en español mexicano' }
          ]
        };
      case 'de':
        return {
          region: 'Deutschland',
          icon: <FileText className="h-12 w-12 text-yellow-600" />,
          color: 'bg-yellow-50 border-yellow-200',
          iconColor: 'text-yellow-600',
          textColor: 'text-yellow-800',
          buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
          bottomBgColor: 'bg-yellow-100',
          features: [
            { icon: <Landmark className="h-5 w-5 text-yellow-600" />, text: 'Datenschutz-Grundverordnung (DSGVO)' },
            { icon: <BookOpen className="h-5 w-5 text-yellow-600" />, text: 'Dokumentation auf Deutsch' },
            { icon: <ScrollText className="h-5 w-5 text-yellow-600" />, text: 'Deutsche Rechnungsstellung' }
          ]
        };
      case 'pt-BR':
        return {
          region: 'Brasil',
          icon: <Globe className="h-12 w-12 text-green-600" />,
          color: 'bg-green-50 border-green-200',
          iconColor: 'text-green-600',
          textColor: 'text-green-800',
          buttonColor: 'bg-green-600 hover:bg-green-700',
          bottomBgColor: 'bg-green-100',
          features: [
            { icon: <Building className="h-5 w-5 text-green-600" />, text: 'Compatível com requisitos de NF-e' },
            { icon: <BookOpen className="h-5 w-5 text-green-600" />, text: 'Documentação em português brasileiro' },
            { icon: <MessageCircle className="h-5 w-5 text-green-600" />, text: 'Suporte em português brasileiro' }
          ]
        };
      case 'hi':
        return {
          region: 'भारत',
          icon: <Globe className="h-12 w-12 text-orange-600" />,
          color: 'bg-orange-50 border-orange-200',
          iconColor: 'text-orange-600',
          textColor: 'text-orange-800',
          buttonColor: 'bg-orange-600 hover:bg-orange-700',
          bottomBgColor: 'bg-orange-100',
          features: [
            { icon: <Building className="h-5 w-5 text-orange-600" />, text: 'भारतीय GST अनुपालन' },
            { icon: <BookOpen className="h-5 w-5 text-orange-600" />, text: 'हिंदी में दस्तावेज़ीकरण' },
            { icon: <MessageCircle className="h-5 w-5 text-orange-600" />, text: 'हिंदी में सहायता' }
          ]
        };
      case 'ru':
        return {
          region: 'Россия',
          icon: <Globe className="h-12 w-12 text-blue-600" />,
          color: 'bg-blue-50 border-blue-200',
          iconColor: 'text-blue-600',
          textColor: 'text-blue-800',
          buttonColor: 'bg-blue-600 hover:bg-blue-700',
          bottomBgColor: 'bg-blue-100',
          features: [
            { icon: <ScrollText className="h-5 w-5 text-blue-600" />, text: 'Совместимость с российскими форматами' },
            { icon: <BookOpen className="h-5 w-5 text-blue-600" />, text: 'Документация на русском языке' },
            { icon: <MessageCircle className="h-5 w-5 text-blue-600" />, text: 'Поддержка на русском языке' }
          ]
        };
      case 'ko':
        return {
          region: '한국',
          icon: <Globe className="h-12 w-12 text-blue-600" />,
          color: 'bg-blue-50 border-blue-200',
          iconColor: 'text-blue-600',
          textColor: 'text-blue-800',
          buttonColor: 'bg-blue-600 hover:bg-blue-700',
          bottomBgColor: 'bg-blue-100',
          features: [
            { icon: <ListChecks className="h-5 w-5 text-blue-600" />, text: '한국어 문서 형식 지원' },
            { icon: <BookOpen className="h-5 w-5 text-blue-600" />, text: '한국어 문서화' },
            { icon: <MessageCircle className="h-5 w-5 text-blue-600" />, text: '한국어 지원' }
          ]
        };
      case 'vi':
        return {
          region: 'Việt Nam',
          icon: <Globe className="h-12 w-12 text-red-600" />,
          color: 'bg-red-50 border-red-200',
          iconColor: 'text-red-600',
          textColor: 'text-red-800',
          buttonColor: 'bg-red-600 hover:bg-red-700',
          bottomBgColor: 'bg-red-100',
          features: [
            { icon: <ScrollText className="h-5 w-5 text-red-600" />, text: 'Hỗ trợ định dạng tài liệu Việt Nam' },
            { icon: <BookOpen className="h-5 w-5 text-red-600" />, text: 'Tài liệu tiếng Việt' },
            { icon: <MessageCircle className="h-5 w-5 text-red-600" />, text: 'Hỗ trợ tiếng Việt' }
          ]
        };
      case 'en-CA':
        return {
          region: 'Canada',
          icon: <MapPin className="h-12 w-12 text-red-600" />,
          color: 'bg-red-50 border-red-200',
          iconColor: 'text-red-600',
          textColor: 'text-red-800',
          buttonColor: 'bg-red-600 hover:bg-red-700',
          bottomBgColor: 'bg-red-100',
          features: [
            { icon: <CheckCircle className="h-5 w-5 text-red-600" />, text: 'Canadian privacy compliant' },
            { icon: <Globe className="h-5 w-5 text-red-600" />, text: 'Bilingual support (English & French)' },
            { icon: <Building className="h-5 w-5 text-red-600" />, text: 'Canadian tax document formats' }
          ]
        };
      default:
        return {
          region: '',
          icon: <Globe className="h-12 w-12 text-gray-600" />,
          color: 'bg-gray-50 border-gray-200',
          iconColor: 'text-gray-600',
          textColor: 'text-gray-800',
          buttonColor: 'bg-gray-600 hover:bg-gray-700',
          bottomBgColor: 'bg-gray-100',
          features: []
        };
    }
  };

  const regionInfo = getRegionInfo();

  return (
    <section className="py-12 bg-gray-50">
      <div className="container px-4 mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          {t('title', { region: regionInfo.region })}
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <Card className={`${regionInfo.color} border`}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className={`rounded-full p-3 ${regionInfo.color}`}>
                  {regionInfo.icon}
                </div>
                <div>
                  <h3 className={`text-lg font-semibold mb-2 ${regionInfo.textColor}`}>
                    {t('local_support.title')}
                  </h3>
                  <p className="text-gray-700 mb-4">
                    {t('local_support.description', { region: regionInfo.region })}
                  </p>
                  <ul className="space-y-2">
                    {regionInfo.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        {feature.icon}
                        <span className="text-sm">{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`${regionInfo.color} border`}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className={`rounded-full p-3 ${regionInfo.color}`}>
                  <Users className={`h-12 w-12 ${regionInfo.iconColor}`} />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold mb-2 ${regionInfo.textColor}`}>
                    {t('users.title', { region: regionInfo.region })}
                  </h3>
                  <p className="text-gray-700 mb-4">
                    {t('users.description', { region: regionInfo.region })}
                  </p>
                  <Button className={`mt-2 ${regionInfo.buttonColor} text-white`} asChild>
                    <Link href={`/${locale}/optimise/compress`}>
                      Try RevisePDF for {regionInfo.region}
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className={`text-center p-6 rounded-lg ${regionInfo.bottomBgColor}`}>
          <p className="text-lg max-w-3xl mx-auto">
            {t('bottom_text', { region: regionInfo.region })}
          </p>
        </div>
      </div>
    </section>
  );
}
