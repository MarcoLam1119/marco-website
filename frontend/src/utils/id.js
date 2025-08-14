const hasCrypto = typeof globalThis !== "undefined" && globalThis.crypto && typeof globalThis.crypto === "object";

export function rngFill(typedArray) {
  if (hasCrypto && typeof globalThis.crypto.getRandomValues === "function") {
    return globalThis.crypto.getRandomValues(typedArray);
  }
  for (let i = 0; i < typedArray.length; i++) {
    typedArray[i] = Math.floor(Math.random() * 256);
  }
  return typedArray;
}

export function randomIntInclusive(max) {
  if (hasCrypto && typeof globalThis.crypto.getRandomValues === "function") {
    const r = new Uint32Array(1);
    globalThis.crypto.getRandomValues(r);
    return r[0] % (max + 1);
  }
  return Math.floor(Math.random() * (max + 1));
}

export function uuidv4() {
  if (hasCrypto && typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  rngFill(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}