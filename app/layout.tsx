// app/layout.tsx (Still a Server Component)
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Providers from "./Providers";

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <Providers>
          <main className="min-h-screen flex flex-col items-center w-full">
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
              <Header />
              <div className="flex flex-col max-w-5xl p-5">
                {children}
              </div>
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
