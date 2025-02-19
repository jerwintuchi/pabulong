"use client"; // ✅ Marks this as a client component

import { UserProvider } from "@/contexts/UserContext";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <UserProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                <Toaster position="top-center" reverseOrder={false} />
                {children}
            </ThemeProvider>
        </UserProvider>
    );
}
