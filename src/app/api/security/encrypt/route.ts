import { NextResponse } from "next/server";
import { seal, open } from "@/modules/security/crypto";

// crypto requires the Node.js runtime (not edge).
export const runtime = "nodejs";

/**
 * POST /api/security/encrypt  { secret: string }
 * Returns the sealed (encrypted) representation that would be persisted, plus a
 * round-trip check proving it decrypts back. The plaintext is never stored.
 */
export async function POST(req: Request) {
  try {
    const { secret } = await req.json();
    if (typeof secret !== "string" || secret.length === 0) {
      return NextResponse.json({ error: "secret required" }, { status: 400 });
    }
    if (secret.length > 256) {
      return NextResponse.json({ error: "secret too long" }, { status: 400 });
    }
    const sealed = seal(secret);
    const roundTripOk = open(sealed) === secret;
    return NextResponse.json({ sealed, roundTripOk });
  } catch {
    return NextResponse.json({ error: "encryption failed" }, { status: 500 });
  }
}
