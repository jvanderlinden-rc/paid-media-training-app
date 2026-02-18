import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Paid Media Training",
  description: "Internal training for paid media teams"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header>
          <div className="nav">
            <div className="brand">Orbit Media Lab</div>
            <div className="badge">Paid Media Training</div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
