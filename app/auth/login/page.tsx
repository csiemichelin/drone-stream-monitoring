"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Radio } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showLogo, setShowLogo] = useState(true)
  const [showCard, setShowCard] = useState(false)
  const [logoVisible, setLogoVisible] = useState(false)

  useEffect(() => {
    const fadeIn = setTimeout(() => setLogoVisible(true), 500)
    const hideLogo = setTimeout(() => setShowLogo(false), 3000)
    const revealCard = setTimeout(() => setShowCard(true), 3400)
    return () => {
      clearTimeout(fadeIn)
      clearTimeout(hideLogo)
      clearTimeout(revealCard)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (data.success) {
        window.location.href = redirect
      } else {
        setError(data.error || "Login failed")
      }
    } catch (err) {
      console.error("[v0] Login error:", err)
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover blur-sm scale-x-130 scale-y-130"
        src="/videos/login_sky.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        onError={(e) => {
          console.error("Video error:", e.currentTarget.error)
        }}
      />
      <div className="absolute inset-0 bg-black/35" aria-hidden="true" />
      <div
        className={`absolute inset-0 flex items-center justify-center z-20 transition-opacity duration-700 ${
          showLogo ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!showLogo}
      >
        <img
          src="/images/login_logo.png"
          alt="Login intro"
          className={`w-150 h-150 object-contain drop-shadow-lg transition-opacity duration-1200 ${
            logoVisible ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
      {showCard && (
        <Card className="w-full max-w-md relative z-30 transition-opacity duration-500">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-10 w-11 items-center justify-center rounded-md bg-sky-600">
                <img
                  src="/images/hazardeye_logo.png"
                  alt="HazardEye Logo"
                  className="h-10 w-9 object-contain"
                />
              </div>
              <span className="text-sky-600 font-bold tracking-wider uppercase">
                Hazardeye
              </span>
            </div>
            <CardTitle className="text-2xl">Sign in</CardTitle>
            <CardDescription>Enter your credentials to access the monitoring platform</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Alert>
                <AlertDescription className="text-sm">
                  <strong>Demo Account:</strong> admin@example.com / admin123
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/auth/register" className="text-primary hover:underline">
                  Register
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
