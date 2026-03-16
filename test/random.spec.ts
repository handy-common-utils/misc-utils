import { expect } from 'chai';

import { generateRandomBoolean, generateRandomInteger, generateRandomNumber, pickRandomElement } from '../src/random';

describe('random', () => {
  describe('generateRandomNumber()', () => {
    it('should generate numbers within [0, 1) by default', () => {
      const num = generateRandomNumber();
      expect(num).to.be.at.least(0);
      expect(num).to.be.below(1);
    });

    it('should respect the probabilityTransformerFunction', () => {
      // eslint-disable-next-line unicorn/consistent-function-scoping
      const transformer = (x: number) => x * 10;
      const num = generateRandomNumber(transformer);
      expect(num).to.be.at.least(0);
      expect(num).to.be.below(10);
    });
  });

  describe('generateRandomInteger()', () => {
    it('should generate integers within [min, max)', () => {
      for (let i = 0; i < 100; i++) {
        const num = generateRandomInteger(5, 10);
        expect(num).to.be.at.least(5);
        expect(num).to.be.below(10);
        expect(Number.isInteger(num)).to.be.true;
      }
    });
  });

  describe('generateRandomBoolean()', () => {
    it('should return true or false', () => {
      const bool = generateRandomBoolean();
      expect(typeof bool).to.equal('boolean');
    });

    it('should always return true if probability is 1', () => {
      expect(generateRandomBoolean(1)).to.be.true;
    });

    it('should always return false if probability is 0', () => {
      expect(generateRandomBoolean(0)).to.be.false;
    });
  });

  describe('pickRandomElement()', () => {
    it('should return undefined for empty array', () => {
      expect(pickRandomElement([])).to.be.undefined;
    });

    it('should return an element from the array', () => {
      const array = [1, 2, 3, 4, 5];
      const element = pickRandomElement(array);
      expect(array).to.include(element as number);
    });
  });
});
