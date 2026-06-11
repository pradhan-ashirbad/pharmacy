import { Router } from "express";
import { HttpError, mockToken, shortId } from "../lib/utils.js";

// Mock authentication. No real security — every endpoint hands back a fake
// JWT-looking token ("mock-jwt-<uuid>") so the frontend can exercise its
// auth flows end to end.
const router = Router();

function makeUser({ name, email, phone }) {
  return {
    id: `usr-${shortId()}`,
    name: name?.trim() || email.split("@")[0],
    email: email.trim().toLowerCase(),
    phone: phone ?? "",
  };
}

// POST /api/auth/register { name, email, phone, password }
router.post("/register", (req, res) => {
  const { name, email, phone, password } = req.body ?? {};
  if (!name || !email || !password) {
    throw new HttpError(400, "name, email and password are required");
  }
  res.status(201).json({ user: makeUser({ name, email, phone }), token: mockToken() });
});

// POST /api/auth/login { email, password } — anything non-empty passes,
// except password "wrong" which returns 401 so the UI can demo error states.
router.post("/login", (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    throw new HttpError(400, "email and password are required");
  }
  if (password === "wrong") {
    throw new HttpError(401, "Invalid email or password");
  }
  res.json({ user: makeUser({ email }), token: mockToken() });
});

// POST /api/auth/google — returns the demo Google account.
router.post("/google", (req, res) => {
  res.json({
    user: {
      id: "usr-google-demo",
      name: "Ashirbad Pradhan",
      email: "ashirbadpradhan014@gmail.com",
      phone: "98765 43210",
    },
    token: mockToken(),
  });
});

// POST /api/auth/forgot-password { email }
router.post("/forgot-password", (req, res) => {
  const { email } = req.body ?? {};
  if (!email) throw new HttpError(400, "email is required");
  res.json({
    message: `If an account exists for ${email}, an OTP has been sent.`,
    otpHint: "Use 123456",
  });
});

// POST /api/auth/verify-otp { otp }
router.post("/verify-otp", (req, res) => {
  const { otp } = req.body ?? {};
  if (otp !== "123456") {
    return res
      .status(400)
      .json({ verified: false, message: "Incorrect OTP. Hint: use 123456." });
  }
  res.json({ verified: true, token: mockToken() });
});

export default router;
