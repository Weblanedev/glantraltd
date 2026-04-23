/**
 * Unit price: sale / promotional price, else list price (formatted with formatUsd).
 */
export function getUnitPrice(
  salePrice: number | undefined,
  regularPrice: number | undefined
): number {
  const base = salePrice ?? regularPrice ?? 0
  return roundMoney(base)
}

function roundMoney(n: number) {
  return Math.round(n * 100) / 100
}

export function formatUsd(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(n)
}
