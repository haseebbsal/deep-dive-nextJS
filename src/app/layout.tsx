import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";

const kanit = Kanit({
  weight: '200',
  style: 'normal',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: "Deep Dive Analytics",
  description: "Record User Sessions And Gain Insight On User Interaction",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-hidden">
      <body className={kanit.className}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
