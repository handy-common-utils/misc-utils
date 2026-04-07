import { expect } from 'chai';

import { chunk, distributeRoundRobin, downSampleRandomly, findIndexInSorted, findInsertionIndexInSorted, findInSorted, partition, shuffle } from '../src/array';

describe('distributeRoundRobin()', () => {
  it('should work when number of groups equals number of elements', () => {
    const items: number[] = [1, 2, 3, 4, 5];
    const result = distributeRoundRobin(items, 5);
    expect(result).to.deep.equal([[1], [2], [3], [4], [5]]);
  });
  it('should work when number of groups equals to half of the number of elements', () => {
    const items = [1, 2, 3, 4, 5, 6];
    const result = distributeRoundRobin(items, 3);
    expect(result).to.deep.equal([[1, 4], [2, 5], [3, 6]]);
  });
  it('should work when number of groups is more than the number of elements', () => {
    const items = [1, 2, 3, 4];
    const result = distributeRoundRobin(items, 6);
    expect(result).to.deep.equal([[1], [2], [3], [4], [], []]);
  });
  it('should work when number of groups is less than the number of elements', () => {
    const items = [1, 2, 3, 4];
    const result = distributeRoundRobin(items, 3);
    expect(result).to.deep.equal([[1, 4], [2], [3]]);
  });
  it('should work when the input array is empty', () => {
    const items: number[] = [];
    const result = distributeRoundRobin(items, 3);
    expect(result).to.deep.equal([[], [], []]);
  });
  it('should work when the number of groups is 1', () => {
    const items = [1, 2, 3, 4];
    const result = distributeRoundRobin(items, 1);
    expect(result).to.deep.equal([[1, 2, 3, 4]]);
  });
  it('should return empty array when the number of groups is 0', () => {
    const items = [1, 2, 3, 4];
    const result = distributeRoundRobin(items, 0);
    expect(result).to.deep.equal([]);
  });
  it('should return empty array when the number of groups is -1', () => {
    const items = [1, 2, 3, 4];
    const result = distributeRoundRobin(items, -1);
    expect(result).to.deep.equal([]);
  });
  // for (const [size, groups] of [[10000, 7], [100000, 7], [100000, 77], [1000000, 7], [10000000, 7], [10000000, 333]]) {
  //   it(`should have good performance for distributing array of size ${size} into ${groups} groups`, function () {
  //     this.timeout(20000);
  //     // eslint-disable-next-line unicorn/no-new-array
  //     const array = new Array(size).map((_, i) => `String at position ${i}`);
  //     const repeat = 30;
  //     let totalDuration = 0;
  //     let totalDurationWithoutOptimisation = 0;

  //     for (let i = 0; i < repeat; i++) {
  //       let startTime = Date.now();
  //       let result = distributeRoundRobin(array, groups);
  //       totalDuration += Date.now() - startTime;
  //       expect(result.length).to.equal(groups);

  //       startTime = Date.now();
  //       result = distributeRoundRobinWithoutOptimisation(array, groups);
  //       totalDurationWithoutOptimisation += Date.now() - startTime;
  //       expect(result.length).to.equal(groups);
  //     }
  //     console.log(`${size} / ${groups} => ${(totalDuration / repeat).toFixed(1)}ms vs. ${(totalDurationWithoutOptimisation / repeat).toFixed(1)}ms`);
  //   });
  // }
});

describe('downSampleRandomly()', () => {
  it('should return an empty array when numSamples is 0', () => {
    const items = [1, 2, 3, 4, 5];
    const result = downSampleRandomly(items, 0);
    expect(result).to.deep.equal([]);
  });

  it('should return the same array when numSamples is greater than or equal to the array length', () => {
    const items = [1, 2, 3, 4, 5];
    const result = downSampleRandomly(items, 5);
    expect(result).to.have.members(items);
    expect(result.length).to.equal(items.length);
  });

  it('should return a subset of the array when numSamples is less than the array length', () => {
    const items = [1, 2, 3, 4, 5];
    const result = downSampleRandomly(items, 3);
    expect(result.length).to.equal(3);
    result.forEach(item => expect(items).to.include(item));
  });

  it('should respect the probabilityTransformerFunction', () => {
    const items = [1, 2, 3, 4, 5];
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const transformer = (x: number) => x / 2; // Bias towards the first half of the array
    const result = downSampleRandomly(items, 3, transformer);
    expect(result.length).to.equal(3);
    expect(result).to.deep.equal([1, 2, 3]); // Expecting the first three elements to be selected
  });

  it('should work with an empty array', () => {
    const items: number[] = [];
    const result = downSampleRandomly(items, 3);
    expect(result).to.deep.equal([]);
  });

  it('should not modify the input array', () => {
    const items = [1, 2, 3, 4, 5];
    const original = [...items];
    downSampleRandomly(items, 3);
    expect(items).to.deep.equal(original);
  });

  it('should return unique elements in the result', () => {
    const items = [1, 2, 3, 4, 5];
    const result = downSampleRandomly(items, 3);
    const uniqueItems = new Set(result);
    expect(uniqueItems.size).to.equal(result.length);
  });
});

describe('findInSorted()', () => {
  it('should find an element in the middle of a sorted array', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(findInSorted(arr, (item) => item - 5)).to.equal(5);
  });

  it('should find the first element', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(findInSorted(arr, (item) => item - 1)).to.equal(1);
  });

  it('should find the last element', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(findInSorted(arr, (item) => item - 5)).to.equal(5);
  });

  it('should return undefined if the element is not found (smaller than min)', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(findInSorted(arr, (item) => item - 0)).to.be.undefined;
  });

  it('should return undefined if the element is not found (larger than max)', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(findInSorted(arr, (item) => item - 6)).to.be.undefined;
  });

  it('should return undefined if the element is not found (between elements)', () => {
    const arr = [1, 3, 5, 7, 9];
    expect(findInSorted(arr, (item) => item - 4)).to.be.undefined;
  });

  it('should return undefined for an empty array', () => {
    expect(findInSorted([], (item: number) => item - 1)).to.be.undefined;
  });

  it('should return undefined for a null or undefined array', () => {
    expect(findInSorted(null, (item: number) => item - 1)).to.be.undefined;
    expect(findInSorted(undefined, (item: number) => item - 1)).to.be.undefined;
  });

  it('should work with a single element array (found)', () => {
    expect(findInSorted([42], (item) => item - 42)).to.equal(42);
  });

  it('should work with a single element array (not found)', () => {
    expect(findInSorted([42], (item) => item - 43)).to.be.undefined;
  });

  it('should work with a large array', () => {
    const arr = Array.from({ length: 1000 }, (_, i) => i * 2);
    expect(findInSorted(arr, (item) => item - 500)).to.equal(500);
    expect(findInSorted(arr, (item) => item - 501)).to.be.undefined;
  });
});

describe('findIndexInSorted()', () => {
  it('should find the index of an element in the middle', () => {
    const arr = [10, 20, 30, 40, 50];
    expect(findIndexInSorted(arr, (item: number) => item - 30)).to.equal(2);
  });

  it('should find the index of the first element', () => {
    const arr = [10, 20, 30];
    expect(findIndexInSorted(arr, (item: number) => item - 10)).to.equal(0);
  });

  it('should find the index of the last element', () => {
    const arr = [10, 20, 30];
    expect(findIndexInSorted(arr, (item: number) => item - 30)).to.equal(2);
  });

  it('should return undefined if not found', () => {
    const arr = [10, 20, 30];
    expect(findIndexInSorted(arr, (item: number) => item - 25)).to.be.undefined;
  });

  it('should return undefined for empty/null/undefined array', () => {
    expect(findIndexInSorted([], (item: number) => item - 10)).to.be.undefined;
    expect(findIndexInSorted(null, (item: number) => item - 10)).to.be.undefined;
    expect(findIndexInSorted(undefined, (item: number) => item - 10)).to.be.undefined;
  });
});

describe('shuffle()', () => {
  it('should keep the same elements and length', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffle(arr);
    expect(result).to.have.members(arr);
    expect(result.length).to.equal(arr.length);
  });

  it('should return an empty array if input is empty', () => {
    expect(shuffle([])).to.deep.equal([]);
  });

  it('should not mutate the original array', () => {
    const arr = [1, 2, 3];
    shuffle(arr);
    expect(arr).to.deep.equal([1, 2, 3]);
  });
});

describe('chunk()', () => {
  it('should split array into equal chunks', () => {
    expect(chunk([1, 2, 3, 4], 2)).to.deep.equal([[1, 2], [3, 4]]);
  });

  it('should handle uneven chunks', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).to.deep.equal([[1, 2], [3, 4], [5]]);
  });

  it('should handle chunk size larger than array', () => {
    expect(chunk([1, 2, 3], 5)).to.deep.equal([[1, 2, 3]]);
  });

  it('should return empty for empty array or size <= 0', () => {
    expect(chunk([], 2)).to.deep.equal([]);
    expect(chunk([1, 2], 0)).to.deep.equal([]);
    expect(chunk([1, 2], -1)).to.deep.equal([]);
  });
});

describe('partition()', () => {
  it('should partition based on boolean', () => {
    const arr = [1, 2, 3, 4];
    // true -> group 0, false -> group 1
    const result = partition(arr, (item: number) => item % 2 === 0);
    expect(result[0]).to.have.members([2, 4]);
    expect(result[1]).to.have.members([1, 3]);
  });

  it('should partition based on number', () => {
    const arr = [1, 2, 3, 4, 5, 6];
    // group by remainder of 3
    const result = partition(arr, (item: number) => item % 3);
    // 1 % 3 = 1, 2 % 3 = 2, 3 % 3 = 0, 4 % 3 = 1, 5 % 3 = 2, 6 % 3 = 0
    expect(result[0]).to.have.members([3, 6]);
    expect(result[1]).to.have.members([1, 4]);
    expect(result[2]).to.have.members([2, 5]);
  });

  it('should handle negative numbers as group 0', () => {
    const arr = [1];
    expect(partition(arr, () => -5)[0]).to.deep.equal([1]);
  });

  it('should handle empty gaps in number partitions', () => {
    const arr = [1];
    const result = partition(arr, () => 2); // all go to index 2
    expect(result[0]).to.deep.equal([]);
    expect(result[1]).to.deep.equal([]);
    expect(result[2]).to.deep.equal([1]);
  });

  it('should respect initialCapacity and populate empty arrays when input is empty', () => {
    const arr: number[] = [];
    const result = partition(arr, () => 0, 3);
    expect(result.length).to.equal(3);
    expect(result).to.deep.equal([[], [], []]);
  });

  it('should respect initialCapacity when elements fall within the capacity', () => {
    const arr = [1, 2];
    const result = partition(arr, (item: number) => item % 2, 4);
    expect(result.length).to.equal(4);
    expect(result).to.deep.equal([[2], [1], [], []]);
  });

  it('should dynamically expand beyond initialCapacity if classifier returns a larger index', () => {
    const arr = [1];
    const result = partition(arr, () => 5, 2);
    expect(result.length).to.equal(6);
    expect(result).to.deep.equal([[], [], [], [], [], [1]]);
  });
});

describe('findInsertionIndex()', () => {
  it('should find index in the middle', () => {
    expect(findInsertionIndexInSorted([10, 20, 30], 25, (a: number, b: number) => a - b)).to.equal(2);
  });

  it('should find index at the start', () => {
    expect(findInsertionIndexInSorted([10, 20, 30], 5, (a: number, b: number) => a - b)).to.equal(0);
  });

  it('should find index at the end', () => {
    expect(findInsertionIndexInSorted([10, 20, 30], 35, (a: number, b: number) => a - b)).to.equal(3);
  });

  it('should find index for duplicate items (after existing)', () => {
    // Standard binary search finds the first position where it doesn't violate order (leftmost)
    expect(findInsertionIndexInSorted([10, 20, 20, 30], 20, (a: number, b: number) => a - b)).to.equal(1);
  });

  it('should work on empty array', () => {
    expect(findInsertionIndexInSorted([], 10, (a: number, b: number) => a - b)).to.equal(0);
  });
});
