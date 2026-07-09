import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cameron Wansing | AI Builder Portfolio",
  description:
    "A clean portfolio for Cameron Wansing, an AI builder, community problem solver, and hands-on business learner."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
