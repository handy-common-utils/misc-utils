/* eslint-disable unicorn/no-array-for-each */
import { expect } from 'chai';

import { distributeRoundRobin , downSampleRandomly } from '../src';

describe('distributeRoundRobin()', () => {
  it('should work when number of groups equals number of elements', () => {
    const items = [1, 2, 3, 4, 5];
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
