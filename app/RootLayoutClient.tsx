
// app/RootLayoutClient.tsx

import "./globals.css";
import { Metadata } from "next";
import RootLayoutClient from "./layout";

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
    metadataBase: new URL(defaultUrl),
    title: "Pabulong",
    description: "Worksheet 2.1",
};


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <RootLayoutClient>
            {children}
        </RootLayoutClient>

    );
}
