import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Floor Plan to 3D Visualisation | Acre&Key Property Advisory',
  description: 'Turn a residential floor plan into a presentation-ready conceptual 3D visual preserving exact architectural topology.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-[#FAF8F5] text-[#1F2B38] min-h-screen">
        {children}
      </body>
    </html>
  );
}
