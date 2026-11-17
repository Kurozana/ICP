const test = require('node:test');
const assert = require('node:assert');
const { generate, verify, secondsLeft, generateFresh } = require('../Utils/totp');

const SECRET = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';

test('RFC 6238 Appendix B SHA1 vectors (6 digits)', () => {
  const vectors = {
    59: '287082',
    1111111109: '081804',
    1111111111: '050471',
    1234567890: '005924',
    2000000000: '279037',
    20000000000: '353130',
  };
  for (const [t, code] of Object.entries(vectors)) {
    assert.strictEqual(generate(SECRET, Number(t) * 1000), code, `T=${t}`);
  }
});

test('empty secret throws', () => {
  assert.throws(() => generate(''), { message: 'TOTP secret is empty' });
  assert.throws(() => generate('   '), { message: 'TOTP secret is empty' });
});

test('invalid char throws without leaking the secret', () => {
  const bad = 'GEZDGNBV1SECRET!';
  assert.throws(() => generate(bad), (e) => {
    assert.strictEqual(e.message, 'TOTP secret is not valid Base32');
    assert.ok(!e.message.includes(bad));
    return true;
  });
});

test('verify accepts +/-1 step and rejects 2 steps away', () => {
  const t = 1111111111000;
  const code = generate(SECRET, t);
  assert.ok(verify(code, SECRET, t));
  assert.ok(verify(code, SECRET, t + 30000));
  assert.ok(verify(code, SECRET, t - 30000));
  assert.ok(!verify(code, SECRET, t + 60000));
  assert.ok(!verify(code, SECRET, t - 60000));
});

test('lowercase, spaced and padded secret works', () => {
  const messy = 'gezd gnbv gy3t qojq gezd gnbv gy3t qojq====';
  assert.strictEqual(generate(messy, 59000), '287082');
});

test('secondsLeft', () => {
  assert.strictEqual(secondsLeft(0), 30);
  assert.strictEqual(secondsLeft(29000), 1);
});

test('generateFresh fails fast on bad secret and returns enough validity', async () => {
  await assert.rejects(generateFresh(''), { message: 'TOTP secret is empty' });
  const { code, validForSeconds } = await generateFresh(SECRET, 1);
  assert.match(code, /^\d{6}$/);
  assert.ok(validForSeconds >= 1 && validForSeconds <= 30);
});
