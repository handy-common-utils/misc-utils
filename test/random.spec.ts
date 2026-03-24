import { expect } from 'chai';

import { gaussianRandom, generateRandomBoolean, generateRandomInteger, generateRandomNumber, generateRandomStringFromChars, pickRandomElement, seededRandom, weightedPickRandomElement } from '../src/random';

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

  describe('generateRandomStringFromChars()', () => {
    it('should generate a string of requested length', () => {
      expect(generateRandomStringFromChars(10)).to.have.length(10);
    });

    it('should use provided characters', () => {
      const result = generateRandomStringFromChars(100, 'ABC');
      expect(result).to.match(/^[ABC]+$/);
    });

    it('should handle length 0', () => {
      expect(generateRandomStringFromChars(0)).to.equal('');
    });
  });

  describe('weightedPickRandomElement()', () => {
    it('should pick based on weights', () => {
      const items = ['A', 'B'];
      const weights = [1, 0]; // Always A
      expect(weightedPickRandomElement(items, weights)).to.equal('A');
    });

    it('should return undefined for invalid input', () => {
      expect(weightedPickRandomElement([], [])).to.be.undefined;
      expect(weightedPickRandomElement(['A'], [1, 2])).to.be.undefined;
      expect(weightedPickRandomElement(['A'], [0])).to.be.undefined;
    });

    it('should handle zero weight correctly', () => {
      const items = ['A', 'B', 'C'];
      const weights = [0, 1, 0]; // Always B
      expect(weightedPickRandomElement(items, weights)).to.equal('B');
    });

    it('should fallback to last element if random is exactly totalWeight (rare)', () => {
      // Hard to test without mocking Math.random
    });
  });

  describe('gaussianRandom()', () => {
    it('should return a number', () => {
      expect(gaussianRandom()).to.be.a('number');
    });
  });

  describe('seededRandom()', () => {
    it('should be repeatable with same seed', () => {
      const gen1 = seededRandom(12345);
      const gen2 = seededRandom(12345);
      const values1 = [gen1(), gen1(), gen1()];
      const values2 = [gen2(), gen2(), gen2()];
      expect(values1).to.deep.equal(values2);
    });

    it('should be different with different seeds', () => {
      const gen1 = seededRandom(12345);
      const gen2 = seededRandom(54321);
      expect(gen1()).to.not.equal(gen2());
    });

    it('should handle 0 as seed', () => {
      const gen = seededRandom(0);
      expect(gen()).to.be.within(0, 1);
    });
  });
});
