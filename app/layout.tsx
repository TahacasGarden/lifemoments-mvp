import "./global.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LifeMoments",
  description: "Capture wisdom. Share your legacy.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark"> {/* keep 'dark' for your dark palette */}
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
