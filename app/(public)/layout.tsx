import { AuthTemplate } from "@/components/templates/AuthTemplate"

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AuthTemplate>{children}</AuthTemplate>
}
