import type {Metadata} from 'next';
import { MedievalSharp } from 'next/font/google'; // Import MedievalSharp
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster
import { cn } from '@/lib/utils';

// Configure MedievalSharp font
const medievalsharp = MedievalSharp({
  subsets: ['latin'],
  weight: ['400'], // MedievalSharp only supports 400 weight
  variable: '--font-medievalsharp', // Define CSS variable
});

export const metadata: Metadata = {
  title: 'Crimson Fate', // Update title
  description: 'A dark fantasy RPG inspired by Darkest Dungeon.', // Update description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Apply dark theme globally via className on html tag
    <html lang="en" className="dark">
      <body className={cn(
        `${medievalsharp.variable} font-sans antialiased`, // Apply font variable, keep sans as fallback
        "bg-background text-foreground" // Ensure bg/text colors are applied
      )}>
        {children}
        <Toaster /> {/* Render Toaster for notifications */}
      </body>
    </html>
  );
}
