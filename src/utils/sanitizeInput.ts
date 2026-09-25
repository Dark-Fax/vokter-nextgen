export function sanitizeInput(value: string) {
  return value.replace(/[<>]/g, '').trim().slice(0, 80)
}

export function parsePrice(value: string) {
  return Number(value.replace(/[^0-9]/g, ''))
}