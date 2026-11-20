
import { Router, type IRouter } from "express";
import { randomBytes, timingSafeEqual } from "node:crypto";

const router: IRouter = Router();

// Temporary in-memory sessions for the project demo.
// Sessions are cleared whenever the backend restarts.
const sessions = new Set<string>();

router.post("/auth/login", (req, res) => {
  const { username, password } = req.body ?? {};

  const validUsername = process.env.CINEMATCH_USERNAME;
  const validPassword = process.env.CINEMATCH_PASSWORD;

  if (!validUsername || !validPassword) {
    return res.status(500).json({
      success: false,
      message: "Login credentials are not configured on the server.",
    });
  }

  const submittedUsername = String(username ?? "");
  const submittedPassword = String(password ?? "");

  const usernameMatches =
    submittedUsername === validUsername;

  const passwordMatches =
    submittedPassword.length === validPassword.length &&
    timingSafeEqual(
      Buffer.from(submittedPassword),
      Buffer.from(validPassword),
    );

  if (!usernameMatches || !passwordMatches) {
    return res.status(401).json({
      success: false,
      message: "Invalid username or password.",
    });
  }

  const token = randomBytes(32).toString("hex");
  sessions.add(token);

  return res.json({
    success: true,
    message: "Login successful.",
    token,
  });
});

router.post("/auth/logout", (req, res) => {
  const token = req.header("Authorization")?.replace(/^Bearer\s+/i, "");

  if (token) {
    sessions.delete(token);
  }

  return res.json({
    success: true,
    message: "Logged out successfully.",
  });
});

router.get("/auth/verify", (req, res) => {
  const token = req.header("Authorization")?.replace(/^Bearer\s+/i, "");

  if (!token || !sessions.has(token)) {
    return res.status(401).json({
      success: false,
      authenticated: false,
    });
  }

  return res.json({
    success: true,
    authenticated: true,
  });
});

export default router;
