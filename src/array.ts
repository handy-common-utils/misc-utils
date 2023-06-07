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
