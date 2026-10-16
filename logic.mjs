export const BASE_RATE = 1;
export const DAILY_INCREMENT = 1;
export const MAX_RATE = 100;

export function localCalendarDay(date = new Date()) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new TypeError('Data inválida');
  }
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
}

export function currentRate(startDay, currentDay = localCalendarDay()) {
  if (!Number.isSafeInteger(startDay) || !Number.isSafeInteger(currentDay)) return BASE_RATE;
  const elapsed = Math.max(0, currentDay - startDay);
  return Math.min(MAX_RATE, BASE_RATE + elapsed * DAILY_INCREMENT);
}

export function stableBucket(value) {
  if (typeof value !== 'string') throw new TypeError('Valor inválido');
  // FNV-1a, não criptográfico: escolha estável por imagem.
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % 100;
}

export function shouldReplace(imageId, seed, percent) {
  if (typeof imageId !== 'string' || typeof seed !== 'string') return false;
  if (!Number.isFinite(percent)) return false;
  const safe = Math.max(0, Math.min(100, percent));
  return stableBucket(`${seed}:${imageId}`) < safe;
}

export function sanitizedSettings(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return null;
  if (value.accepted !== true || !Number.isSafeInteger(value.startDay)) return null;
  if (typeof value.seed !== 'string' || !/^[a-zA-Z0-9_-]{6,80}$/.test(value.seed)) return null;
  return { accepted: true, startDay: value.startDay, seed: value.seed };
}
