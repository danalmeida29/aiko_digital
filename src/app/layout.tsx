import React from 'react';
import './globals.css';
import { SelectedIdProvider } from './context/SelectedIdContext';

export const metadata = {
  title: 'Aiko Digital',
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <SelectedIdProvider>{children}</SelectedIdProvider>
      </body>
    </html>
  );
}
