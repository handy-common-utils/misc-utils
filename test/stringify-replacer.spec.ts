/* eslint-disable unicorn/no-useless-undefined */
/* eslint-disable unicorn/no-for-loop */
import { expect } from 'chai';
import stringify from 'safe-stable-stringify';
import { mask, maskAll, maskEmail, maskFullName } from '../src/mask';
import { pathAwareReplacer, pathBasedReplacer } from '../src/stringify-replacer';

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

const expectedRoundTripObj = { ...obj };
expectedRoundTripObj.aObj.child.o2.parent = '[Circular]';
delete expectedRoundTripObj.un;

const expectedParamKeys = [
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
  '0',
  '1',
  '2',
  'color',
  'shape',
  'nu',
  'un',
];

const expectedParamPaths = [
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
];

const stringifyKeys: Array<string|number> = [];
const stringifyParents: Array<any> = [];
stringify(obj, function (this: any, key: string|number, value: any) {
  stringifyKeys.push(key);
  stringifyParents.push(this);
  return value;
});

// const jsonStringifyKeys: Array<string|number> = [];
// const jsonStringifyParents: Array<any> = [];
// JSON.stringify(obj, function (this: any, key: string|number, value: any) {
//   jsonStringifyKeys.push(key);
//   jsonStringifyParents.push(this);
//   return value;
// });
// console.log(jsonStringifyKeys);

describe('stringifyReplacer(...)', () => {
  it('should supply the correct parameters to encapsulated replacer function', () => {
    const keys: Array<string|number> = [];
    const paths: string[] = [];
    const parents: Array<object|Array<unknown>> = [];
    const pathArrays: Array<Array<any>> = [];
    const allAncestors: Array<Array<any>> = [];
    const s = stringify(obj, pathAwareReplacer((key: string|number, value: any, path: string, parent: any, pathArray: Array<any>, ancestors: Array<any>) => {
      keys.push(key);
      paths.push(path);
      parents.push(parent);
      pathArrays.push(pathArray);
      allAncestors.push(ancestors);
      return value;
    }), 2);

    expect(s).to.be.a('string');
    expect(JSON.parse(s!)).to.deep.equal(expectedRoundTripObj);

    expect(paths[0]).to.equal('');
    expect(paths[1]).to.equal('aObj');
    expect(parents[0]).to.deep.equal({ '': obj });
    expect(parents[1]).to.equal(obj);

    expect(pathArrays[0].length).to.equal(0);
    expect(pathArrays[1].length).to.equal(1);
    expect(pathArrays[1]).to.deep.equal(['aObj']);
    expect(pathArrays[2].length).to.equal(2);
    expect(pathArrays[2]).to.deep.equal(['aObj', 'child']);

    for (let i = 0; i < pathArrays.length; i++) {
      for (let j = 0; j < pathArrays[i].length; j++) {
        expect(paths[i]).to.include(pathArrays[i][j]);
      }
    }

    expect(allAncestors[0].length).to.equal(0);
    expect(allAncestors[1].length).to.equal(1);
    expect(allAncestors[1][0]).to.equal(obj);
    expect(allAncestors[2].length).to.equal(2);
    expect(allAncestors[2][0]).to.equal(obj);
    expect(allAncestors[2][1]).to.equal(obj.aObj);
    for (let i = 1; i < allAncestors.length; i++) {
      expect(allAncestors[i][0]).to.equal(obj);
    }

    expect(keys).to.deep.equal(stringifyKeys);
    expect(parents).to.deep.equal(stringifyParents);

    expect(keys).to.deep.equal(expectedParamKeys);
    expect(paths).to.deep.equal(expectedParamPaths);
  });

  it('should be able to use options', () => {
    const keys: Array<string|number> = [];
    const paths: string[] = [];
    const s = stringify(obj, pathAwareReplacer((key: string|number, value: any, path: string) => {
      keys.push(key);
      paths.push(path);
      return value;
    }, { pathArray: false, ancestors: false }), 2);

    expect(s).to.be.a('string');
    expect(JSON.parse(s!)).to.deep.equal(expectedRoundTripObj);

    expect(keys).to.deep.equal(expectedParamKeys);
    expect(paths).to.deep.equal(expectedParamPaths);
  });

  it('should honour options', () => {
    const keys: Array<string|number> = [];
    const paths: string[] = [];
    const s = stringify(obj, pathAwareReplacer((key: string|number, value: any, path: string, _parent: any, pathArray: Array<any>, ancestors: Array<any>) => {
      keys.push(key);
      paths.push(path);
      expect(pathArray.length).to.equal(0);
      expect(ancestors.length).to.equal(0);
      return value;
    }, { pathArray: false, ancestors: false }), 2);

    expect(s).to.be.a('string');
    expect(JSON.parse(s!)).to.deep.equal(expectedRoundTripObj);

    expect(keys).to.deep.equal(expectedParamKeys);
    expect(paths).to.deep.equal(expectedParamPaths);
  });
});

describe('pathBasedReplacer(...)', () => {
  it('can be used to mask sensitive information in a complex object', () => {
    const obj = {
      id: '23345232356',
      customer: {
        cc: '1234123412341234',
        ssn: '123-45-6789',
        email: 'john.doe@example.com',
        name: 'John Doe',
      },
      billingAddress: {
        street: '33 High St',
        city: 'New Port',
        state: 'NY',
        zip: '34564',
      },
      shippingAddress: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345',
        recipient: 'Bruce Li',
        email: 'bruce.li@example.com',
      },
    };
    const replacer = pathBasedReplacer([
      [/.*\.email$/, maskEmail],
      [/.*[Aa]ddress\.street$/, maskAll],
      [/.*customer\.name$/, maskFullName],
      [/.*[Aa]ddress\.recipient$/, maskFullName],
      [/.*\.zip$/, (value: string) => value.slice(0, 3) + 'XX'],
      [/.*\.cc$/, () => undefined],
      [/.*\.ssn$/, mask],
    ]);
    const json = JSON.stringify(obj, replacer, 2);
    const replacedObj = JSON.parse(json);
    expect(replacedObj).to.deep.equal({
      id: '23345232356',
      customer: {
        ssn: '1**********',
        // cc has been removed
        email: 'j***.d**@example.com',
        name: 'J*** D**',
      },
      billingAddress: {
        street: '**********',
        city: 'New Port',
        state: 'NY',
        zip: '345XX',
      },
      shippingAddress: {
        street: '***********',
        city: 'Anytown',
        state: 'CA',
        zip: '123XX',
        recipient: 'B**** **',
        email: 'b****.**@example.com',
      },
    });
  });
});
