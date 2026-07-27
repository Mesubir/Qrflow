import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { db } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "qrflow-super-secret-key-12345";
const SESSION_COOKIE_NAME = "qrflow_session";

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
}

// Hash Password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Verify Password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate JWT for API keys/webhooks or lightweight tokens
export function generateToken(payload: object, expiresIn = "7d"): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn as any });
}

// Verify JWT
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// Create Session in Database & Cookie
export async function createSession(userId: string): Promise<string> {
  const sessionToken = generateToken({ userId, rand: Math.random().toString() }, "30d");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days from now

  // Store in Database
  await db.session.create({
    data: {
      sessionToken,
      userId,
      expiresAt,
    },
  });

  // Set Cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return sessionToken;
}

// Get User from Current Session Cookie
export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!sessionCookie || !sessionCookie.value) {
      return null;
    }

    const token = sessionCookie.value;

    // Fetch session from Database
    const dbSession = await db.session.findUnique({
      where: { sessionToken: token },
      include: {
        user: true,
      },
    });

    if (!dbSession) {
      return null;
    }

    // Check expiry
    if (new Date() > dbSession.expiresAt) {
      // Clean up expired session
      await db.session.delete({ where: { id: dbSession.id } }).catch(() => {});
      return null;
    }

    const { user } = dbSession;
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      subscriptionPlan: user.subscriptionPlan,
      subscriptionStatus: user.subscriptionStatus,
    };
  } catch (error) {
    console.error("Auth Session Error:", error);
    return null;
  }
}

// Destroy Session (Logout)
export async function destroySession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (sessionCookie && sessionCookie.value) {
      const token = sessionCookie.value;
      // Delete session from DB
      await db.session.delete({ where: { sessionToken: token } }).catch(() => {});
    }

    // Clear Cookie
    cookieStore.set(SESSION_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0),
      path: "/",
    });
  } catch (error) {
    console.error("Logout Error:", error);
  }
}
