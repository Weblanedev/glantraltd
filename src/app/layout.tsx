import type { Metadata } from 'next';
import './globals.scss';
import { Providers } from '@/redux/provider';

export const metadata: Metadata = {
  title: 'Glantra Store - High-end tech, Low-end pricing',
  description: 'Glantra Store is your one-stop-shop for your global computing needs.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
