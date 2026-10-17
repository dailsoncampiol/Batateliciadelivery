import React from 'react';

export const metadata = {
  title: 'Batatelícia Batataria | Delivery',
  description: 'As melhores batatas recheadas da região!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
