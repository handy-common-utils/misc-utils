/**
 * Distributes an array into a number of groups in a round robin fashion.
 * @param array The input array
 * @param groups Number of groups the elements in the input array need to be distributed into.
 * @returns The result as an array of arrays which each represents a group
 */
export function distributeRoundRobin<T>(array: Array<T>, groups: number): Array<Array<T>> {
  const result: Array<Array<T>> = [];
  if (groups <= 0) {
    return result;
  }
  for (let i = 0; i < groups; i++) {
    result.push([]);
  }
  // eslint-disable-next-line unicorn/no-for-loop
  for (let i = 0; i < array.length; i++) {
    result[i % groups].push(array[i]);
  }
  return result;
}
