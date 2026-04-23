export const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as "none" | "lax" | "strict" | boolean,
    maxAge: 24 * 60 * 60 * 1000,
}
