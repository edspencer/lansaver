export const publicRoutes = ["/"];

export const authRoutes = [
  "/auth",
  "/auth/login",
  "/auth/logout",
  "/auth/register",
  "/auth/callback",
  "/auth/providers",
  "/auth/providers/:provider/callback",
  "/auth/signin",
  "/auth/signout",
  "/auth/session",
  "/auth/csrf",
  "/auth/error",
  "/auth/verify-request",
  "/auth/email",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/change-password",
  "/auth/verify-email",
];

export const apiAuthPrefix = "/api/auth";
