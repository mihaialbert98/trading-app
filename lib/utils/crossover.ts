/**
 * Returns true if the value crossed above the threshold between prev and curr.
 * Requires: prev < threshold AND curr > threshold (strictly).
 */
export function crossesAbove(
  prev: number | null,
  curr: number | null,
  threshold: number,
): boolean {
  if (prev === null || curr === null) return false;
  return prev < threshold && curr > threshold;
}

/**
 * Returns true if the value crossed below the threshold between prev and curr.
 * Requires: prev > threshold AND curr < threshold (strictly).
 */
export function crossesBelow(
  prev: number | null,
  curr: number | null,
  threshold: number,
): boolean {
  if (prev === null || curr === null) return false;
  return prev > threshold && curr < threshold;
}

/**
 * Returns true if line A crossed above line B between candles N-1 and N.
 * Requires: prevA < prevB AND currA > currB (strictly).
 */
export function crossesAboveValue(
  prev: number | null,
  curr: number | null,
  prevOther: number | null,
  currOther: number | null,
): boolean {
  if (prev === null || curr === null || prevOther === null || currOther === null) return false;
  return prev < prevOther && curr > currOther;
}

/**
 * Returns true if line A crossed below line B between candles N-1 and N.
 * Requires: prevA > prevB AND currA < currB (strictly).
 */
export function crossesBelowValue(
  prev: number | null,
  curr: number | null,
  prevOther: number | null,
  currOther: number | null,
): boolean {
  if (prev === null || curr === null || prevOther === null || currOther === null) return false;
  return prev > prevOther && curr < currOther;
}
