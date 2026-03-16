export class NumberUtils {
  /**
   * Constrains a number within specified bounds.
   * @param num The number to clamp
   * @param min The minimum value (inclusive)
   * @param max The maximum value (inclusive)
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

  /**
   * Calculates the intersection between two ranges.
   * @param min1 Minimum value of the first range
   * @param max1 Maximum value of the first range
   * @param min2 Minimum value of the second range
   * @param max2 Maximum value of the second range
   * @returns The intersection as a tuple [min, max], or undefined if there is no intersection.
   */
  static rangeIntersection(min1: number, max1: number, min2: number, max2: number): [number, number] | undefined {
    const r1Min = Math.min(min1, max1);
    const r1Max = Math.max(min1, max1);
    const r2Min = Math.min(min2, max2);
    const r2Max = Math.max(min2, max2);

    const intersectionMin = Math.max(r1Min, r2Min);
    const intersectionMax = Math.min(r1Max, r2Max);

    if (intersectionMin <= intersectionMax) {
      return [intersectionMin, intersectionMax];
    }
    return undefined;
  }
}

// Export functions as constants for convenience
/**
 * Constrains a number within specified bounds.
 * @param num The number to clamp
 * @param min The minimum value
 * @param max The maximum value
 * @returns The clamped value
 */
export const clamp = NumberUtils.clamp;

/**
 * Checks if a number is within a specified range (inclusive).
 * @param num The number to check
 * @param min The minimum value
 * @param max The maximum value
 * @returns True if the number is within range
 */
export const isInRange = NumberUtils.isInRange;

/**
 * Rounds a number to a specified number of decimal places.
 * @param num The number to round
 * @param precision The number of decimal places (default: 0)
 * @returns Rounded number
 */
export const roundTo = NumberUtils.roundTo;

/**
 * Calculates the intersection between two ranges.
 * @param min1 Minimum value of the first range
 * @param max1 Maximum value of the first range
 * @param min2 Minimum value of the second range
 * @param max2 Maximum value of the second range
 * @returns The intersection as a tuple [min, max], or undefined if there is no intersection.
 */
export const rangeIntersection = NumberUtils.rangeIntersection;