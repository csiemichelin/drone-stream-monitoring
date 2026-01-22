import type React from "react"
import { redirect } from "next/navigation"
import { TopNav } from "@/components/layout/top-nav"
import { BackgroundVideo } from "@/components/layout/background-video"
import { AlertToastListener } from "@/components/alerts/alert-toast-listener"
import { getCurrentUser } from "@/lib/auth"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <BackgroundVideo />
      <div className="relative z-10 flex flex-col min-h-screen">
        <TopNav userName={user.name} />
        <main>{children}</main>
      </div>
      <AlertToastListener />
    </div>
  )
}
