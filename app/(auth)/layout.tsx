import { Header } from "@/components/organisms/Header"

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen">
      <Header />
      {children}
    </div>
  )
}
