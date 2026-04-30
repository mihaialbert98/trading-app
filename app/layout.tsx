import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StockScope — Analiză Profesională de Acțiuni',
  description:
    'Analiză tehnică și fundamentală a acțiunilor cu grafice în timp real, RSI, MACD, Benzi Bollinger, semnale de cumpărare/vânzare și știri.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="h-full overflow-hidden antialiased">{children}</body>
    </html>
  );
}
