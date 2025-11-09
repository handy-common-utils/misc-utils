/* eslint-disable unicorn/prefer-structured-clone */
/* eslint-disable unicorn/prefer-spread */
import { expect } from 'chai';
import _ from 'lodash';

import { merge } from '../src/merge';

describe('merge()', () => {
  it('should perform a basic mutable merge of two simple objects', () => {
    const dest = { a: 1, b: 2 };
    const src = { b: 3, c: 4 };
    const destClone = _.cloneDeep(dest);
    const srcClone = _.cloneDeep(src);

    const result = merge(null, dest, src);
    expect(result).to.equal(dest);
    expect(result).to.deep.equal(_.merge({}, destClone, srcClone));
    expect(dest).to.deep.equal({ a: 1, b: 3, c: 4 });
  });

  it('should perform a basic immutable merge of two simple objects', () => {
    const dest = { a: 1, b: 2 };
    const src = { b: 3, c: 4 };
    const destClone = _.cloneDeep(dest);
    const srcClone = _.cloneDeep(src);

    const result = merge({ immutable: true }, dest, src);
    expect(result).to.not.equal(dest);
    expect(dest).to.deep.equal({ a: 1, b: 2 });
    expect(result).to.deep.equal(_.merge({}, destClone, srcClone));
    expect(result).to.deep.equal({ a: 1, b: 3, c: 4 });
  });

  it('should deep merge nested objects', () => {
    const dest = { a: { b: 1 } };
    const src = { a: { c: 2 } };
    const destClone = _.cloneDeep(dest);
    const srcClone = _.cloneDeep(src);

    merge(null, dest, src);
    expect(dest).to.deep.equal(_.merge({}, destClone, srcClone));
    expect(dest).to.deep.equal({ a: { b: 1, c: 2 } });
  });

  it('should handle array merging with "replace" strategy', () => {
    const dest = { a: [1, 2] };
    const src = { a: [3, 4] };
    merge({ array: 'replace' }, dest, src);
    expect(dest).to.deep.equal({ a: [3, 4] });
  });

  it('should handle array merging with "append" strategy', () => {
    const dest = { a: [1, 2] };
    const src = { a: [3, 4] };
    merge({ array: 'append' }, dest, src);
    expect(dest).to.deep.equal({ a: [1, 2, 3, 4] });
  });

  it('should handle array merging with "merge" strategy (default)', () => {
    const dest = { a: [1, { b: 1 }] };
    const src = { a: [2, { c: 2 }] };
    const destClone = _.cloneDeep(dest);
    const srcClone = _.cloneDeep(src);

    merge(null, dest, src);
    expect(dest).to.deep.equal(_.merge({}, destClone, srcClone));
    expect(dest).to.deep.equal({ a: [2, { b: 1, c: 2 }] });
  });

  it('should handle array "merge" when source is longer', () => {
    const dest = { a: [1, 2] };
    const src = { a: [3, 4, 5] };
    const destClone = _.cloneDeep(dest);
    const srcClone = _.cloneDeep(src);

    merge({ array: 'merge' }, dest, src);
    expect(dest).to.deep.equal(_.merge({}, destClone, srcClone));
    expect(dest).to.deep.equal({ a: [3, 4, 5] });
  });

  it('should handle set merging with "replace" strategy (default)', () => {
    const dest = { a: new Set([1, 2]) };
    const src = { a: new Set([3, 4]) };
    const destClone = _.cloneDeep(dest);
    const srcClone = _.cloneDeep(src);

    merge(null, dest, src);
    expect(dest).to.deep.equal(_.merge({}, destClone, srcClone));
    expect(dest.a).to.be.an.instanceof(Set);
    expect(Array.from(dest.a)).to.have.members([3, 4]);
  });

  it('should handle set merging with "merge" strategy', () => {
    const dest = { a: new Set([1, 2]) };
    const src = { a: new Set([2, 3]) };
    merge({ set: 'merge' }, dest, src);
    expect(dest.a).to.be.an.instanceof(Set);
    expect(Array.from(dest.a)).to.have.members([1, 2, 3]);
  });

  it('should merge multiple source objects', () => {
    const dest = { a: 1 };
    const src1 = { b: 2 };
    const src2 = { c: 3 };
    const destClone = _.cloneDeep(dest);
    const src1Clone = _.cloneDeep(src1);
    const src2Clone = _.cloneDeep(src2);

    merge(null, dest, src1, src2);
    expect(dest).to.deep.equal(_.merge({}, destClone, src1Clone, src2Clone));
    expect(dest).to.deep.equal({ a: 1, b: 2, c: 3 });
  });

  it('should ignore undefined values in source objects', () => {
    const dest = { a: 1 };
    const src = { a: undefined, b: 2 };
    const destClone = _.cloneDeep(dest);
    const srcClone = _.cloneDeep(src);

    merge(null, dest, src);
    expect(dest).to.deep.equal(_.merge({}, destClone, srcClone));
    expect(dest).to.deep.equal({ a: 1, b: 2 });
  });

  it('should merge different value types correctly', () => {
    const dest = { a: 1, b: 'hello', c: null };
    const src = { a: 2, b: 'world', d: false };
    const destClone = _.cloneDeep(dest);
    const srcClone = _.cloneDeep(src);

    merge(null, dest, src);
    expect(dest).to.deep.equal(_.merge({}, destClone, srcClone));
    expect(dest).to.deep.equal({ a: 2, b: 'world', c: null, d: false });
  });

  it('should work correctly when merging with an empty source object', () => {
    const dest = { a: 1 };
    const src = {};
    const destClone = _.cloneDeep(dest);
    const srcClone = _.cloneDeep(src);

    merge(null, dest, src);
    expect(dest).to.deep.equal(_.merge({}, destClone, srcClone));
    expect(dest).to.deep.equal({ a: 1 });
  });

  it('should work correctly when merging into an empty destination object', () => {
    const dest = {};
    const src = { a: 1 };
    const destClone = _.cloneDeep(dest);
    const srcClone = _.cloneDeep(src);

    merge(null, dest, src);
    expect(dest).to.deep.equal(_.merge({}, destClone, srcClone));
    expect(dest).to.deep.equal({ a: 1 });
  });

  it('immutable merge should not mutate the source object', () => {
    const dest = { a: { b: 1 } };
    const src = { a: { c: 2 } };
    const srcOriginal = _.cloneDeep(src);
    merge({ immutable: true }, dest, src);
    expect(src).to.deep.equal(srcOriginal);
  });

  it('should handle complex nested objects and arrays', () => {
    const dest = {
      a: {
        b: [1, { x: 10 }],
        c: new Set([100]),
      },
      d: 1,
    };
    const src = {
      a: {
        b: [2, { y: 20 }, 3],
        c: new Set([200]),
      },
      e: 2,
    };
    const destClone = _.cloneDeep(dest);
    const srcClone = _.cloneDeep(src);

    expect(merge({ immutable: true }, destClone, srcClone)).to.deep.equal(_.merge({}, destClone, srcClone));

    const result = merge(
      { immutable: true, array: 'merge', set: 'merge' },
      dest,
      src,
    );

    const expectedResult = {
      a: {
        b: [2, { x: 10, y: 20 }, 3],
        c: new Set([100, 200]),
      },
      d: 1,
      e: 2,
    };

    expect(result.a.b).to.deep.equal(expectedResult.a.b);
    expect(Array.from(result.a.c as Set<number>)).to.have.members(
      Array.from(expectedResult.a.c),
    );
    expect(result.d).to.equal(expectedResult.d);
    expect(result.e).to.equal(expectedResult.e);

    // Ensure original objects are not mutated
    expect(dest.a.b[1]).to.deep.equal({ x: 10, y: 20 });
    expect(Array.from(dest.a.c)).to.have.members([100]);
  });

  it('should merge a nested object with a null prototype', () => {
    const dest = { a: { b: 1 } };
    const src = { a: Object.create(null) };
    src.a.c = 2;

    merge(null, dest, src);
    expect(dest).to.deep.equal({ a: { b: 1, c: 2 } });
  });

  it('should not overwrite nested property with undefined from source', () => {
    const dest = { a: { b: 1 } };
    const src = { a: { b: undefined } };
    merge(null, dest, src);
    expect(dest).to.deep.equal({ a: { b: 1 } });
  });

  it('should recursively merge deeply nested plain objects within arrays', () => {
    const dest = { a: [{ b: { c: 1 } }] };
    const src = { a: [{ b: { d: 2 } }] };
    merge(null, dest, src);
    expect(dest).to.deep.equal({ a: [{ b: { c: 1, d: 2 } }] });
  });

  it('should recursively merge nested plain objects', () => {
    const d1 = new Date();
    const d2 = new Date();
    const dest = { a: { b: { c: 1, f: d1 } } };
    const src = { a: { b: { d: 2, f: d2 } } };
    merge(null, dest, src);
    expect(dest).to.deep.equal({ a: { b: { c: 1, d: 2, f: d2 } } });
  });
});
