import { ThemeSwitcher } from "@/components/theme-switcher";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { GiLips } from "react-icons/gi";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center w-full">
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
              {/* Navigation Bar */}
              <nav className="w-full border-b flex flex-row items-center h-16 px-8">
                <GiLips size={36} />
                {/* Left - App Title */}
                <div className="font-semibold text-4xl">
                  <a href={defaultUrl}>Pabulong</a>
                </div>

                {/* Push ThemeSwitcher to the right */}
                <div className="ml-auto">
                  <ThemeSwitcher />
                </div>
              </nav>

              {/* Main Content */}
              <div className="flex flex-col gap-20 max-w-5xl p-5">
                {children}
              </div>
            </div>
          </main>
        </ThemeProvider>
      </body >
    </html >
  );
}
