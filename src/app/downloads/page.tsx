export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { defaultLocale } from '@/lib/i18n';

export default function DownloadsRedirectPage() {
  redirect(`/${defaultLocale}/downloads`);
}
