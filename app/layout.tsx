import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "LocalBook - Бронирование салонов красоты",
  description: "Платформа для онлайн бронирования услуг салонов красоты и барбершопов в Узбекистане",
  generator: "LocalBook",
  applicationName: "LocalBook",
  authors: [{ name: "LocalBook Team" }],
  keywords: ["салон красоты", "барбершоп", "бронирование", "Узбекистан", "Ташкент", "маникюр", "педикюр", "стрижка"],
  creator: "LocalBook",
  publisher: "LocalBook",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://localbook.uz"),
  alternates: {
    canonical: "/",
    languages: {
      "ru-UZ": "/ru",
      "uz-UZ": "/uz",
    },
  },
  openGraph: {
    type: "website",
    locale: "ru_UZ",
    url: "/",
    title: "LocalBook - Бронирование салонов красоты",
    description: "Платформа для онлайн бронирования услуг салонов красоты и барбершопов в Узбекистане",
    siteName: "LocalBook",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LocalBook - Бронирование салонов красоты",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LocalBook - Бронирование салонов красоты",
    description: "Платформа для онлайн бронирования услуг салонов красоты и барбершопов в Узбекистане",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/icons/safari-pinned-tab.svg",
        color: "#059669",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LocalBook",
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <head>
        <meta name="theme-color" content="#059669" />
        <meta name="msapplication-TileColor" content="#059669" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
