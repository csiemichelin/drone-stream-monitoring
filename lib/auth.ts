import { cookies } from "next/headers"
import type { User } from "./types"
import { dataStore } from "./store"

const SESSION_COOKIE_NAME = "drone-session"
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

type SessionCookie = {
  userId: string
  name: string
  email: string
  role: User["role"]
  createdAt: string
  expiresAt: string
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const raw = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!raw) return null

  try {
    const session: SessionCookie = JSON.parse(raw)
    if (new Date(session.expiresAt) < new Date()) {
      return null
    }

    return {
      id: session.userId,
      name: session.name,
      email: session.email,
      role: session.role,
      passwordHash: "",
      createdAt: new Date(session.createdAt),
    }
  } catch {
    return null
  }
}

export async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  console.log("[v0] Login attempt for email:", email)

  const user = dataStore.getUserByEmail(email)

  if (!user) {
    console.log("[v0] User not found:", email)
    return { success: false, error: "Invalid email or password" }
  }

  console.log("[v0] User found:", { id: user.id, email: user.email, passwordHash: user.passwordHash })
  console.log("[v0] Comparing passwords:", {
    provided: password,
    stored: user.passwordHash,
    match: user.passwordHash === password,
  })

  // Demo: simple password check (in production use bcrypt)
  if (user.passwordHash !== password) {
    console.log("[v0] Password mismatch")
    return { success: false, error: "Invalid email or password" }
  }

  console.log("[v0] Password matched, creating session")

  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)
  const cookieStore = await cookies()
  const sessionCookie: SessionCookie = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
  }

  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(sessionCookie), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  })

  console.log("[v0] Cookie set, login successful")
  return { success: true }
}

export async function register(
  name: string,
  email: string,
  password: string,
): Promise<{ success: boolean; error?: string }> {
  // Check if user already exists
  if (dataStore.getUserByEmail(email)) {
    return { success: false, error: "Email already registered" }
  }

  // Create user (demo: password stored as-is, in production use bcrypt)
  const user: User = {
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    email,
    passwordHash: password,
    role: "admin", // demo: all users are admin
    createdAt: new Date(),
  }

  dataStore.createUser(user)

  // Auto-login after registration
  return login(email, password)
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}
