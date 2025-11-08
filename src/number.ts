export class NumberUtils {
  /**
   * Constrains a number within specified bounds.
   * @param num The number to clamp
   * @param min The minimum value
   * @param max The maximum value
   * @returns The clamped value
   */
  static clamp(num: number, min: number, max: number): number {
    return Math.min(Math.max(num, min), max);
  }

  /**
   * Checks if a number is within a specified range (inclusive).
   * @param num The number to check
   * @param min The minimum value
   * @param max The maximum value
   * @returns True if the number is within range
   */
  static isInRange(num: number, min: number, max: number): boolean {
    return num >= min && num <= max;
  }

  /**
   * Rounds a number to a specified number of decimal places.
   * @param num The number to round
   * @param precision The number of decimal places (default: 0)
   * @returns Rounded number
   */
  static roundTo(num: number, precision = 0): number {
    const factor = Math.pow(10, precision);
    return Math.round(num * factor) / factor;
  }
}

// Export functions as constants for convenience
export const clamp = NumberUtils.clamp;
export const isInRange = NumberUtils.isInRange;
export const roundTo = NumberUtils.roundTo;