import { Outfit } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { MuiThemeProvider } from '@/context/MuiThemeProvidor';
import { RTCMultiConnectionProvider } from "@/context/RTCMultiConnectionContext";
import { MessageProvider } from '@/context/MessageProvidor';
import { StreamProvider } from '@/context/StreamProvidor';

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
          src="https://cdn.jsdelivr.net/npm/detectrtc@1.4.0/DetectRTC.min.js" 
          strategy="beforeInteractive"
        />
        <Script 
          src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.1.3/howler.js" 
          strategy="beforeInteractive"
        />
          <AppRouterCacheProvider>
            <MuiThemeProvider>
              <ThemeProvider>
                <RTCMultiConnectionProvider>
                  <MessageProvider>
                    <StreamProvider>
                      <SidebarProvider>{children}</SidebarProvider>
                    </StreamProvider>
                  </MessageProvider>
                </RTCMultiConnectionProvider>
              </ThemeProvider>
            </MuiThemeProvider>
          </AppRouterCacheProvider>
      </body>
    </html>
  );
}
