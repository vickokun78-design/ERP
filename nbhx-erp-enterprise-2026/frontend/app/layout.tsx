/**
 * ==========================================
 * NBHX ERP Enterprise 2026 - Root Layout
 * ==========================================
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NBHX ERP Enterprise 2026',
  description: 'Sistema ERP de Clase Mundial para Manufactura',
  keywords: ['ERP', 'Manufactura', 'NBHX', 'Producción', 'Calidad'],
  authors: [{ name: 'NBHX Group' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
