export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidPhone(value: string) {
  const digits = value.replace(/[\s()-]/g, "");
  return /^(\+44|0)[1-9]\d{8,10}$/.test(digits);
}

export function required(value: string) {
  return value.trim().length > 0;
}
