/**
 * Generates a random number based on a distribution function.
 * @param probabilityTransformerFunction A function that turns a random number within [0, 1) to another number.
 *                If not provided, the identity function F(x) = x will be used.
 * @returns A generated random number.
 */
export function generateRandomNumber(probabilityTransformerFunction: ((x: number) => number) = x => x): number {
  return probabilityTransformerFunction(Math.random());
}

/**
 * Generates a random integer within [min, max).
 * @param min The inclusive lower bound.
 * @param max The exclusive upper bound.
 * @returns A random integer between min (inclusive) and max (exclusive).
 */
export function generateRandomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Generates a random boolean value.
 * @param probabilityOfTrue The probability of returning true, between 0 and 1. Default is 0.5.
 * @returns True with the specified probability, otherwise false.
 */
export function generateRandomBoolean(probabilityOfTrue = 0.5): boolean {
  return Math.random() < probabilityOfTrue;
}

/**
 * Picks a random element from an array.
 * @param array The array to pick an element from.
 * @returns A randomly selected element from the array, or undefined if the array is empty.
 */
export function pickRandomElement<T>(array: Array<T>): T | undefined {
  if (array.length === 0) {
    return;
  }
  return array[generateRandomInteger(0, array.length)];
}
