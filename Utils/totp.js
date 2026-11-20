const crypto = require('crypto');

// RFC 6238 TOTP: HMAC-SHA1, 6 digits, 30 s step. No dependencies, no logging.
const STEP_MS = 30000;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

// RFC 4648 Base32 -> Buffer. Errors never include the secret.
function base32Decode(secret) {
  const clean = String(secret || '').replace(/[\s=]/g, '').toUpperCase();
  if (!clean) throw new Error('TOTP secret is empty');
  let bits = '';
  for (const ch of clean) {
    const v = ALPHABET.indexOf(ch);
    if (v < 0) throw new Error('TOTP secret is not valid Base32');
    bits += v.toString(2).padStart(5, '0');
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(parseInt(bits.slice(i, i + 8), 2));
  return Buffer.from(bytes);
}

// HOTP (RFC 4226) for a given counter, dynamic truncation to 6 digits.
function hotp(key, counter) {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(counter));
  const h = crypto.createHmac('sha1', key).update(buf).digest();
  const o = h[h.length - 1] & 0x0f;
  const n = h.readUInt32BE(o) & 0x7fffffff;
  return String(n % 1000000).padStart(6, '0');
}

function generate(secret, time = Date.now()) {
  return hotp(base32Decode(secret), Math.floor(time / STEP_MS));
}

// Accepts the current step and +/-1 step (clock drift).
function verify(code, secret, time = Date.now()) {
  const key = base32Decode(secret);
  const step = Math.floor(time / STEP_MS);
  const given = String(code).trim();
  return [-1, 0, 1].some((d) => {
    const expected = hotp(key, step + d);
    return given.length === expected.length &&
      crypto.timingSafeEqual(Buffer.from(given), Buffer.from(expected));
  });
}

function secondsLeft(time = Date.now()) {
  return Math.ceil((STEP_MS - (time % STEP_MS)) / 1000);
}

// Returns a code with at least minSeconds of validity left, waiting for the next window if needed.
async function generateFresh(secret, minSeconds = 5) {
  base32Decode(secret); // fail fast before waiting
  if (secondsLeft() < minSeconds) {
    const wait = STEP_MS - (Date.now() % STEP_MS) + 200;
    await new Promise((r) => setTimeout(r, wait));
  }
  return { code: generate(secret), validForSeconds: secondsLeft() };
}

module.exports = { generate, verify, secondsLeft, generateFresh };
