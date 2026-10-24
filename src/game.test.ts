import { test } from "node:test";
import assert from "node:assert/strict";
import { accepts, phrases, normalize } from "./game.ts";
test("every canonical phrase and configured variant is accepted", () => {
  phrases.forEach((p, i) => {
    assert.ok(accepts(i, p.de));
    p.answers.forEach((a) => assert.ok(accepts(i, a)));
  });
});
test("ignores case, whitespace and punctuation", () => {
  assert.ok(accepts(1, "  ENTSCHULDIGUNG, können   Sie mir helfen?! "));
  assert.equal(normalize("GUTEN ABEND!"), "guten abend");
});
test("accepts keyboard umlaut alternatives and rejects unrelated responses", () => {
  assert.ok(accepts(2, "Wo ist die Baeckerei?"));
  assert.ok(accepts(1, "Entschuldigung, koennen Sie mir helfen?"));
  phrases.forEach((_, i) => assert.equal(accepts(i, "pretzel please"), false));
  assert.equal(accepts(0, ""), false);
});
test("progress falls back safely when storage is blocked or corrupted", async () => {
  const { readProgress, initial } = await import("./game.ts");
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem() {
        throw new Error("blocked");
      },
    },
  });
  assert.deepEqual(readProgress(), initial);
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: { getItem: () => "{broken" },
  });
  assert.deepEqual(readProgress(), initial);
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: () =>
        JSON.stringify({ ...initial, screen: "play", route: "hook", step: 99 }),
    },
  });
  assert.deepEqual(readProgress(), initial);
});
