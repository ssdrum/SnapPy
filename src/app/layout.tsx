import type { Metadata } from 'next';
import './globals.css';
import '@mantine/core/styles.css';
import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from '@mantine/core';

export const metadata: Metadata = {
  title: 'Snap-py',
  description: 'My App is a...',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <div id='root'>{children}</div>
        </MantineProvider>
      </body>
    </html>
  );
}
