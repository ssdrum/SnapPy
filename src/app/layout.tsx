import type { Metadata } from 'next';
import './globals.css';
import '@mantine/core/styles.css';
import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from '@mantine/core';
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/500.css';
import '@fontsource/nunito/600.css';
import '@fontsource/nunito/700.css';

export const metadata: Metadata = {
  title: 'SnapPy',
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
        <MantineProvider
          theme={{
            fontFamily: 'Nunito, sans-serif',
            headings: { fontFamily: 'Nunito, sans-serif' },
            primaryColor: 'indigo',
            components: {
              Button: {
                defaultProps: {
                  variant: 'filled',
                },
              },
            },
          }}
        >
          <div id='root'>{children}</div>
        </MantineProvider>
      </body>
    </html>
  );
}
