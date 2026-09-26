export function sanitizeInput(value: string) {
  return value.replace(/[<>]/g, '').trim().slice(0, 80)
}

export function sanitizeField(value: string) {
  return value.replace(/[<>]/g, '').slice(0, 80)
}
