/**
 * Distributes an array into a number of groups in a round robin fashion.
 * This function has been tuned for performance.
 * @param array The input array
 * @param groups Number of groups the elements in the input array need to be distributed into.
 * @returns The result as an array of arrays which each represents a group
 */
export function distributeRoundRobin<T>(array: Array<T>, groups: number): Array<Array<T>> {
  if (groups <= 0) {
    return [];
  }
  // eslint-disable-next-line unicorn/no-new-array
  const result: Array<Array<T>> = new Array(groups);

  let remainingElements = array.length;
  for (let groupIndex = 0, remainingGroups = groups; groupIndex < groups; groupIndex++, remainingGroups--) {
    const size = Math.ceil(remainingElements / remainingGroups);
    // eslint-disable-next-line unicorn/no-new-array
    const group = new Array(size);
    result[groupIndex] = group;
    for (let i = 0, j = groupIndex; i < size; i++, j += groups) {
      group[i] = array[j];
    }
    remainingElements -= size;
  }

  return result;
}

// export function distributeRoundRobinWithoutOptimisation<T>(array: Array<T>, groups: number): Array<Array<T>> {
//   if (groups <= 0) {
//     return [];
//   }

//   const result: Array<Array<T>> = [];
//   for (let i = 0; i < groups; i++) {
//     result.push([]);
//   }
//   // eslint-disable-next-line unicorn/no-for-loop
//   for (let i = 0; i < array.length; i++) {
//     result[i % groups].push(array[i]);
//   }
//   return result;
// }

/**
 * Down samples the input array randomly.
 * @param array The input array
 * @param numSamples Number of samples to be taken from the input array.
 *                  If the number of samples is greater than or equal to the length of the input array,
 *                  the output array will contain all the elements in the input array.
 * @param probabilityTransformerFunction A function that turns a random number within [0, 1) to another number within [0, 1).
 *                If not provided, the identity function F(x) = x will be used.
 *                The probability of an element being selected from the input array is determined by this function.
 * @returns A new array with the down sampled elements from the input array.
 *          The order of the elements in the output array is the same as the input array.
 */
export function downSampleRandomly<T>(array:  Array<T>, numSamples: number, probabilityTransformerFunction: ((x: number) => number) = x => x): Array<T> {
  if (numSamples <= 0) {
    return [];
  }
  if (numSamples >= array.length) {
    return [...array];
  }

  const result: Array<T> = [];
  const indexes = new Set<number>();
  while (indexes.size < numSamples) {
    const r = Math.random();
    indexes.add(Math.floor(probabilityTransformerFunction(r) * array.length));
  }
  // eslint-disable-next-line unicorn/no-for-loop
  for (let i = 0; i < array.length; i++) {
    if (indexes.has(i)) {
      result.push(array[i]);
    }
  }
  return result;
}

/**
 * Finds an element in a sorted array using a golden ratio split (0.618) which statistically performs better than a "standard" binary search.
 * @param array The sorted input array. If it is not sorted, the result would be incorrect.
 * @param compareFn A function that returns:
 *                  - 0 if the element is the exact match.
 *                  - A negative number if the element comes before the target.
 *                  - A positive number if the element comes after the target.
 * @returns The found element or undefined if not found or the array is null/empty.
 */
export function findInSorted<T>(array: Array<T> | null | undefined, compareFn: (item: T) => number): T | undefined {
  if (!array || array.length === 0) {
    return undefined;
  }

  const GOLDEN_RATIO = 0.6180339887;

  const search = (low: number, high: number): T | undefined => {
    if (low > high) {
      return undefined;
    }

    const index = Math.floor(low + (high - low) * GOLDEN_RATIO);
    const item = array![index];
    const comparison = compareFn(item);

    if (comparison === 0) {
      return item;
    }

    if (comparison < 0) {
      return search(index + 1, high);
    }

    return search(low, index - 1);
  };

  return search(0, array.length - 1);
}
