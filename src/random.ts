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

/**
 * Generates a random string using the characters provided.
 * @param length The length of the string to generate.
 * @param chars The characters to use. Defaults to alphanumeric characters.
 * @returns A random string.
 */
export function generateRandomStringFromChars(length: number, chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Picks an item from an array based on weights.
 * @param items The items to pick from.
 * @param weights The weights of the items.
 * @returns The picked item or undefined if invalid input.
 */
export function weightedPickRandomElement<T>(items: Array<T>, weights: Array<number>): T | undefined {
  if (items.length === 0 || items.length !== weights.length) {
    return undefined;
  }
  const totalWeight = weights.reduce((acc, w) => acc + w, 0);
  if (totalWeight <= 0) {
    return undefined;
  }
  let r = Math.random() * totalWeight;
  for (const [i, item] of items.entries()) {
    if (r < weights[i]) {
      return item;
    }
    r -= weights[i];
  }
  return items.at(-1);
}

/**
 * Generates a random number following a normal (Gaussian) distribution using Box-Muller transform.
 * @param mean The mean of the distribution.
 * @param stdev The standard deviation of the distribution.
 * @returns A random number.
 */
export function gaussianRandom(mean: number = 0, stdev: number = 1): number {
  const u = 1 - Math.random(); // (0, 1]
  const v = Math.random(); // [0, 1)
  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return z * stdev + mean;
}

/**
 * Creates a seeded pseudo-random number generator (LCG).
 * @param seed The seed value.
 * @returns A function that generates random numbers in [0, 1).
 */
export function seededRandom(seed: number): () => number {
  let state = Math.abs(seed) % 2147483647;
  if (state === 0) {
    state = 1;
  }

  return () => {
    state = (state * 48271) % 2147483647;
    return (state - 1) / 2147483646;
  };
}
