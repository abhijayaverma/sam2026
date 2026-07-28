import "./globals.css";

export const metadata = {
  title: "Workshop Certificate Portal",
  description: "Generate e-certificates for workshop attendees",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
