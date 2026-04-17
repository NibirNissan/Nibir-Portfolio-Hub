/**
 * WebAuthn utilities for the portfolio admin easter-egg.
 *
 * Flow:
 *  1. After a successful Firebase email/password login the admin is prompted
 *     to register a platform authenticator (fingerprint, Face ID, device PIN).
 *     The credential ID is stored in localStorage (the private key never leaves
 *     the device's secure enclave).
 *
 *  2. On subsequent long-press triggers, verifyBiometric() presents the
 *     OS-native biometric/PIN dialog. A successful ceremony is sufficient
 *     proof that this is the registered device owner, so we navigate straight
 *     to the admin dashboard (relying on the persisted Firebase session).
 *
 * Security note: No assertion is verified server-side (no backend), so this
 * is a convenience/UX layer, not a cryptographic access-control boundary.
 * The real security boundary is Firebase Auth + Firestore rules.
 */

const RP_NAME = "Nibir Nissan Portfolio";
const CRED_KEY = "nn_webauthn_cred_id";
const REGISTERED_KEY = "nn_webauthn_registered";

// ── Encoding helpers ──────────────────────────────────────────────────────────

function bufToBase64url(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64urlToBuf(b64: string): ArrayBuffer {
  const std = b64.replace(/-/g, "+").replace(/_/g, "/");
  const padded = std + "=".repeat((4 - (std.length % 4)) % 4);
  const bin = atob(padded);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0)).buffer;
}

// ── Public API ────────────────────────────────────────────────────────────────

/** True if the browser exposes the WebAuthn API at all. */
export function isWebAuthnSupported(): boolean {
  return typeof window !== "undefined" && "PublicKeyCredential" in window;
}

/** True if a platform authenticator that can do user-verification is available. */
export async function isPlatformAuthenticatorAvailable(): Promise<boolean> {
  if (!isWebAuthnSupported()) return false;
  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}

/** True if the admin has previously registered a biometric credential. */
export function hasBiometricRegistered(): boolean {
  try {
    return localStorage.getItem(REGISTERED_KEY) === "true";
  } catch {
    return false;
  }
}

/**
 * Register a new platform authenticator credential after a successful
 * Firebase login. Stores the credential ID in localStorage.
 *
 * @returns true on success, false if the user cancels or the device doesn't
 *          support platform authenticators.
 */
export async function registerBiometric(
  userId: string,
  email: string
): Promise<boolean> {
  if (!isWebAuthnSupported()) return false;
  if (!(await isPlatformAuthenticatorAvailable())) return false;

  try {
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    // userId must be ≤ 64 bytes; encode to UTF-8 and slice for safety.
    const userHandle = new TextEncoder().encode(userId).slice(0, 64);

    const credential = (await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: {
          name: RP_NAME,
          // rpId must match the effective domain — localhost in dev,
          // nibirnissan.com in production.
          id: window.location.hostname,
        },
        user: {
          id: userHandle,
          name: email,
          displayName: "Admin",
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" },   // ES256  (preferred)
          { alg: -257, type: "public-key" },  // RS256  (fallback)
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
          residentKey: "preferred",
        },
        timeout: 60_000,
        attestation: "none",
      },
    })) as PublicKeyCredential | null;

    if (!credential) return false;

    localStorage.setItem(CRED_KEY, bufToBase64url(credential.rawId));
    localStorage.setItem(REGISTERED_KEY, "true");
    return true;
  } catch (err) {
    console.error("[webauthn] Registration error:", err);
    return false;
  }
}

/**
 * Present the OS biometric/PIN dialog using the previously registered
 * credential. Returns true only if the user successfully authenticates.
 */
export async function verifyBiometric(): Promise<boolean> {
  if (!isWebAuthnSupported()) return false;

  const rawCredId = localStorage.getItem(CRED_KEY);

  try {
    const challenge = crypto.getRandomValues(new Uint8Array(32));

    const assertion = (await navigator.credentials.get({
      publicKey: {
        challenge,
        allowCredentials: rawCredId
          ? [
              {
                id: base64urlToBuf(rawCredId),
                type: "public-key",
                transports: ["internal"],
              },
            ]
          : [],
        userVerification: "required",
        timeout: 60_000,
      },
    })) as PublicKeyCredential | null;

    return assertion !== null;
  } catch (err) {
    // NotAllowedError = user cancelled or timed out. Log but don't throw.
    console.log("[webauthn] Verification cancelled/failed:", err);
    return false;
  }
}

/** Remove the stored credential (e.g. if the admin wants to re-register). */
export function clearBiometric(): void {
  try {
    localStorage.removeItem(CRED_KEY);
    localStorage.removeItem(REGISTERED_KEY);
  } catch { /* ignore */ }
}
