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

/**
 * Finds the index of an element in a sorted array using a golden ratio split (0.6180339887).
 * @param array The sorted input array.
 * @param compareFn A function that returns:
 *                  - 0 if the element is the exact match.
 *                  - A negative number if the element comes before the target.
 *                  - A positive number if the element comes after the target.
 * @returns The index of the found element, or undefined if not found or the array is null/empty.
 */
export function findIndexInSorted<T>(array: Array<T> | null | undefined, compareFn: (item: T) => number): number | undefined {
  if (!array || array.length === 0) {
    return undefined;
  }

  const GOLDEN_RATIO = 0.6180339887;

  const search = (low: number, high: number): number | undefined => {
    if (low > high) {
      return undefined;
    }

    const index = Math.floor(low + (high - low) * GOLDEN_RATIO);
    const item = array![index];
    const comparison = compareFn(item);

    if (comparison === 0) {
      return index;
    }

    if (comparison < 0) {
      return search(index + 1, high);
    }

    return search(low, index - 1);
  };

  return search(0, array.length - 1);
}

/**
 * Finds the index where an item should be inserted into a sorted array to maintain order,
 * using a golden ratio split (0.6180339887) for consistent performance.
 * @param array The sorted input array.
 * @param item The item to be inserted. Please note that it does not have to be of the same type as the elements in the array.
 * @param compareFn A function to compare the element in the array with the item passed in (standard comparator).
 *                  Should return a negative number if the element in the array is before the item passed in,
 *                  0 if it is at the same position as the item passed in, and a positive number if the element in the array is after the item passed in.
 * @returns The insertion index.
 */
export function findInsertionIndexInSorted<T, I = T>(array: Array<T>, item: I, compareFn: (a: T, b: I) => number): number {
  const GOLDEN_RATIO = 0.6180339887;
  let low = 0;
  let high = array.length;
  while (low < high) {
    const index = Math.floor(low + (high - low) * GOLDEN_RATIO);
    const mid = Math.max(low, Math.min(index, high - 1));

    if (compareFn(array[mid], item) < 0) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return low;
}

/**
 * Finds all elements within a specified range in a sorted array.
 * @param array The sorted input array.
 * @param lowBoundary The lower boundary of the range.
 * @param highBoundary The upper boundary of the range.
 * @param compareFn A function to compare an element of type T with a boundary of type B.
 *                  Should return a negative number if `a < b`, 0 if `a === b`, and a positive number if `a > b`.
 * @param options specify whether boundaries are inclusive or exclusive. By default, both are inclusive.
 * @param options.lowInclusive optionally specifying whether the lowBoundary is inclusive. Default is true.
 * @param options.highInclusive optionally specifying whether the highBoundary is inclusive. Default is true.
 * @returns An array containing all elements within the specified range.
 */
export function findWithinRangeInSorted<T, B>(
  array: Array<T>,
  lowBoundary: B,
  highBoundary: B,
  compareFn: (a: T, b: B) => number,
  options?: { lowInclusive?: boolean; highInclusive?: boolean, },
): Array<T> {
  const lowInclusive = options?.lowInclusive ?? true;
  const highInclusive = options?.highInclusive ?? true;

  const startIndex = findInsertionIndexInSorted(array, lowBoundary, compareFn);

  const result: Array<T> = [];
  for (let i = startIndex; i < array.length; i++) {
    const item = array[i];
    const lowCmp = compareFn(item, lowBoundary);

    // Check if item meets lower boundary constraint
    if (lowCmp < 0 || (!lowInclusive && lowCmp === 0)) {
      continue;
    }

    const highCmp = compareFn(item, highBoundary);
    // Check if item meets upper boundary constraint
    if (highCmp > 0 || (!highInclusive && highCmp === 0)) {
      break;
    }

    result.push(item);
  }

  return result;
}


/**
 * Shuffles the elements of an array randomly using the Fisher-Yates algorithm.
 * @param array The input array.
 * @returns A new array with the elements shuffled.
 */
export function shuffle<T>(array: Array<T>): Array<T> {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Splits an array into chunks of a specified size.
 * @param array The input array.
 * @param size The size of each chunk.
 * @returns An array of chunks.
 */
export function chunk<T>(array: Array<T>, size: number): Array<Array<T>> {
  if (size <= 0) {
    return [];
  }
  const result: Array<Array<T>> = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

/**
 * Partitions an array into multiple groups based on a classifier function.
 * Please note that by default the returned array could have length of zero if the input array is empty,
 * or length of 1 if the classifier always returns the same value, or length of any number depending on the classifier function.
 * For your use case, you may want to specify `initialCapacity` to make sure that the returned array always contains the
 * specified number of elements or to avoid the overhead of resizing the result array.
 * @param array The input array.
 * @param classifier A function that returns a boolean or a non-negative integer.
 *                  - If boolean: true maps to group 0, false maps to group 1.
 *                  - If number: the index of the group. Negative numbers map to group 0.
 * @param initialCapacity The initial capacity of the result array.
 *                        If not specified, the returned array could contain any number of elements depending on the classifier function.
 *                        For example, setting it to 2 could be useful for most binary classification use case.
 * @returns An array of arrays, each representing a group.
 */
export function partition<T>(array: Array<T>, classifier: (item: T) => boolean | number, initialCapacity?: number): Array<Array<T>> {
  const result: Array<Array<T>> = [];
  if (initialCapacity) {
    for (let i = 0; i < initialCapacity; i++) {
      result.push([]);
    }
  }

  for (const item of array) {
    const key = classifier(item);
    const index = typeof key === 'boolean' ? (key ? 0 : 1) : (key < 0 ? 0 : Math.floor(key));

    while (result.length <= index) {
      result.push([]);
    }
    result[index].push(item);
  }
  return result;
}


