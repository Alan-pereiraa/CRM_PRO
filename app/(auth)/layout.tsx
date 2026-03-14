import { Header } from "@/components/organisms/Header"

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {children}
    </div>
  )
}
