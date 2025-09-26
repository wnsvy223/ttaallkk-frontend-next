import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Script from 'next/script';
import { RTCMultiConnectionProvider } from "@/context/RTCMultiConnectionContext";

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <Script 
          src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.slim.js" 
          strategy="beforeInteractive"
        />
        <Script 
          src="https://webrtchacks.github.io/adapter/adapter-latest.js" 
          strategy="beforeInteractive"
        />
        <Script 
          src="https://cdn.webrtc-experiment.com/FileBufferReader.js" 
          strategy="beforeInteractive"
        />
        <Script 
          src="https://cdn.webrtc-experiment.com/hark.js" 
          strategy="beforeInteractive"
        />
        <Script 
          src="https://cdn.webrtc-experiment.com/hark.js" 
          strategy="beforeInteractive"
        />
        <RTCMultiConnectionProvider>
          <ThemeProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </ThemeProvider>
        </RTCMultiConnectionProvider>
      </body>
    </html>
  );
}
