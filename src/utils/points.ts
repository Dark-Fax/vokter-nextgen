export const pointValue = 100
export const pointsPerThousand = 1000

export function pointsEarnedFor(total: number) {
  return Math.floor(total / pointsPerThousand)
}

export function maxRedeemablePoints(points: number, subtotal: number) {
  return Math.max(0, Math.min(points, Math.floor(subtotal / pointValue)))
}
