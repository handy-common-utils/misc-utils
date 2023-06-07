import { expect } from 'chai';
import { distributeRoundRobin } from '../src';

describe('distributeRoundRobin()', () => {
  it('should work when number of groups equal number of elements', () => {
    const items = [1, 2, 3, 4, 5];
    const result = distributeRoundRobin(items, 5);
    expect(result).to.deep.equal([[1], [2], [3], [4], [5]]);
  });
  it('should work when number of groups equal to half of the number of elements', () => {
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
});
