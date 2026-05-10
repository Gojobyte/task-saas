import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TaskFlow — SaaS Task Management",
  description: "Modern task management for teams",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
