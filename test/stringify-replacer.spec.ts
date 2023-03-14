import { expect } from 'chai';
import stringify from 'safe-stable-stringify';
import { pathAwareReplacer } from '../src/stringify-replacer';

const o2 = {
  name: 'o2',
  parent: {},
};
const obj = {
  aObj: {
    x: 1,
    y: 2,
    name: 'name',
    'name.with.dots': 'name with dots',
    'name with spaces': 'name with spaces',
    child: {
      location: null,
      ip: '127.0.0.1',
      o2,
    },
  },
  age: 10,
  nu: null,
  un: undefined,
  arr: [
    'apple',
    'pear',
    {
      color: 'red',
      shape: 'square',
    },
  ],
};
o2.parent = obj;

describe('stringifyReplacer(...)', () => {
  it('should supply the correct parameters to encapsulated replacer function', () => {
    const keys: Array<string|number> = [];
    const paths: string[] = [];
    const s = stringify(obj, pathAwareReplacer((key: string|number, value: any, path: string, _obj: any) => {
      keys.push(key);
      paths.push(path);
      return value;
    }), 2);
    expect(s).to.be.a('string');
    const expected = { ...obj };
    expected.aObj.child.o2.parent = '[Circular]';
    delete expected.un;
    expect(JSON.parse(s!)).to.deep.equal(expected);
    expect(keys).to.deep.equal([
      '',
      'aObj',
      'child',
      'ip',
      'location',
      'o2',
      'name',
      'parent',
      'name',
      'name with spaces',
      'name.with.dots',
      'x',
      'y',
      'age',
      'arr',
      0,
      1,
      2,
      'color',
      'shape',
      'nu',
      'un',
    ]);
    expect(paths).to.deep.equal([
      '',
      'aObj',
      'aObj.child',
      'aObj.child.ip',
      'aObj.child.location',
      'aObj.child.o2',
      'aObj.child.o2.name',
      'aObj.child.o2.parent',
      'aObj.name',
      'aObj.name with spaces',
      'aObj.name.with.dots',
      'aObj.x',
      'aObj.y',
      'age',
      'arr',
      'arr.0',
      'arr.1',
      'arr.2',
      'arr.2.color',
      'arr.2.shape',
      'nu',
      'un',
    ]);
  });
});
