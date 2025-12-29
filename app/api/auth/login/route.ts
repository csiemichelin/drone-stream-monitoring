import { type NextRequest, NextResponse } from "next/server"
import { login } from "@/lib/auth"
import { dataStore } from "@/lib/store"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 })
    }

    const result = await login(email, password)

    if (!result.success) {
      return NextResponse.json(result, { status: 401 })
    }

    const user = dataStore.getUserByEmail(email)

    return NextResponse.json({
      success: true,
      user: user
        ? { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt }
        : null,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
