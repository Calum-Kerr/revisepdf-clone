import { MetadataRoute } from 'next';

// Base URL of the website - use environment variable if available
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.revisepdf.com';

// Define priority levels
enum Priority {
  HIGH = 1.0,
  MEDIUM = 0.7,
  LOW = 0.5,
  VERY_LOW = 0.3,
}

// Define allowed change frequency values
type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

// Get current date for lastModified timestamps
const currentDate = new Date();
// Create a date 2 days ago for pages that don't change as often
const staticPageDate = new Date(currentDate);
staticPageDate.setDate(staticPageDate.getDate() - 2);

// Main sitemap generation function
export default function sitemap(): MetadataRoute.Sitemap {
  // Main pages
  const mainRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: 'daily' as ChangeFrequency,
      priority: Priority.HIGH,
    },
    {
      url: `${baseUrl}/plans`,
      lastModified: staticPageDate,
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: Priority.MEDIUM,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: staticPageDate,
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: Priority.MEDIUM,
    },
    {
      url: `${baseUrl}/auth/register`,
      lastModified: staticPageDate,
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: Priority.MEDIUM,
    },
    {
      url: `${baseUrl}/auth/forgot-password`,
      lastModified: staticPageDate,
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: Priority.LOW,
    },
  ];

  // PDF Tools - Optimise
  const optimiseRoutes = [
    {
      url: `${baseUrl}/optimise/compress`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: Priority.HIGH,
    },
    {
      url: `${baseUrl}/optimise/repair`,
      lastModified: staticPageDate,
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: Priority.MEDIUM,
    },
    {
      url: `${baseUrl}/optimise/ocr`,
      lastModified: staticPageDate,
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: Priority.MEDIUM,
    },
  ];

  // PDF Tools - Convert to PDF
  const convertToPdfRoutes = [
    {
      url: `${baseUrl}/convert-to-pdf/image-to-pdf`,
      lastModified: staticPageDate,
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: Priority.MEDIUM,
    },
    {
      url: `${baseUrl}/convert-to-pdf/office-to-pdf`,
      lastModified: staticPageDate,
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: Priority.MEDIUM,
    },
    {
      url: `${baseUrl}/convert-to-pdf/html-to-pdf`,
      lastModified: staticPageDate,
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: Priority.MEDIUM,
    },
    {
      url: `${baseUrl}/convert-to-pdf/zip-to-pdf`,
      lastModified: staticPageDate,
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: Priority.LOW,
    },
  ];

  // PDF Tools - Convert from PDF
  const convertFromPdfRoutes = [
    {
      url: `${baseUrl}/convert-from-pdf/pdf-to-image`,
      lastModified: staticPageDate,
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: Priority.MEDIUM,
    },
    {
      url: `${baseUrl}/convert-from-pdf/pdf-to-panoramic`,
      lastModified: staticPageDate,
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: Priority.LOW,
    },
    {
      url: `${baseUrl}/convert-from-pdf/pdf-to-pdfa`,
      lastModified: staticPageDate,
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: Priority.LOW,
    },
  ];

  // PDF Tools - Edit
  const editRoutes = [
    {
      url: `${baseUrl}/edit/page-numbers`,
      lastModified: staticPageDate,
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: Priority.MEDIUM,
    },
    {
      url: `${baseUrl}/edit/watermark`,
      lastModified: staticPageDate,
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: Priority.MEDIUM,
    },
    {
      url: `${baseUrl}/edit/content`,
      lastModified: staticPageDate,
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: Priority.MEDIUM,
    },
    {
      url: `${baseUrl}/edit/text-editor`,
      lastModified: staticPageDate,
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: Priority.MEDIUM,
    },
    {
      url: `${baseUrl}/edit/signature`,
      lastModified: staticPageDate,
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: Priority.MEDIUM,
    },
  ];

  // PDF Tools - Organise
  const organiseRoutes = [
    {
      url: `${baseUrl}/organise/merge`,
      lastModified: staticPageDate,
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: Priority.MEDIUM,
    },
    {
      url: `${baseUrl}/organise/split`,
      lastModified: staticPageDate,
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: Priority.MEDIUM,
    },
    {
      url: `${baseUrl}/organise/extract`,
      lastModified: staticPageDate,
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: Priority.MEDIUM,
    },
    {
      url: `${baseUrl}/organise/rotate`,
      lastModified: staticPageDate,
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: Priority.MEDIUM,
    },
  ];

  // PDF Tools - Security
  const securityRoutes = [
    {
      url: `${baseUrl}/security/unlock`,
      lastModified: staticPageDate,
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: Priority.MEDIUM,
    },
    {
      url: `${baseUrl}/security/protect`,
      lastModified: staticPageDate,
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: Priority.MEDIUM,
    },
    {
      url: `${baseUrl}/security/redact`,
      lastModified: staticPageDate,
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: Priority.MEDIUM,
    },
    {
      url: `${baseUrl}/security/flatten`,
      lastModified: staticPageDate,
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: Priority.MEDIUM,
    },
  ];

  // Legal & Informational Pages
  const legalRoutes = [
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: staticPageDate,
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: Priority.LOW,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: staticPageDate,
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: Priority.LOW,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: staticPageDate,
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: Priority.LOW,
    },
    {
      url: `${baseUrl}/gdpr-compliance`,
      lastModified: staticPageDate,
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: Priority.LOW,
    },
    {
      url: `${baseUrl}/accessibility-statement`,
      lastModified: staticPageDate,
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: Priority.LOW,
    },
  ];

  // Blog URLs (if blog exists)
  const blogRoutes = [
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate, // Blog index should be fresh
      changeFrequency: 'daily' as ChangeFrequency,
      priority: Priority.HIGH,
    },
    // Example blog posts can be added here
    {
      url: `${baseUrl}/blog/best-pdf-tools-for-students`,
      lastModified: new Date('2025-04-10'),
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: Priority.MEDIUM,
    },
    {
      url: `${baseUrl}/blog/how-to-compress-pdf-without-losing-quality`,
      lastModified: new Date('2025-05-01'),
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: Priority.MEDIUM,
    },
    {
      url: `${baseUrl}/blog/ocr-technology-explained`,
      lastModified: new Date('2025-05-10'),
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: Priority.MEDIUM,
    },
  ];

  // Combine all routes
  return [
    ...mainRoutes,
    ...optimiseRoutes,
    ...convertToPdfRoutes,
    ...convertFromPdfRoutes,
    ...editRoutes,
    ...organiseRoutes,
    ...securityRoutes,
    ...legalRoutes,
    ...blogRoutes,
  ];
}
