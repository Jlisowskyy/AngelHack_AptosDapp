import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "TicketsChain",
    description: "Create, sell and trade tickets using blockchain safe and stable technologies.",
    icons: [
        {url: "/icon16.png", sizes: '16x16', type: "image/png"},
        {url: "/icon32.png", sizes: '32x32', type: "image/png"},
        {url: "/icon64.png", sizes: '64x64', type: "image/png"},
        {url: "/icon256.png", sizes: '256x256', type: "image/png"},
    ]
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <Navbar/>
        <main>{children}</main>
        <Footer/>
        </body>
        </html>
    );
}
