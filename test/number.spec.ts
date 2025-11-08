import { expect } from 'chai';

import { clamp, isInRange, roundTo } from '../src/index';

describe('NumberUtils', () => {
  describe('clamp', () => {
    it('should clamp number within range', () => {
      expect(clamp(5, 0, 10)).to.equal(5);
      expect(clamp(-5, 0, 10)).to.equal(0);
      expect(clamp(15, 0, 10)).to.equal(10);
    });

    it('should handle equal min and max', () => {
      expect(clamp(5, 3, 3)).to.equal(3);
    });

    it('should handle zero values', () => {
      expect(clamp(0, -5, 5)).to.equal(0);
    });

    it('should handle min > max by returning the computed min/max result', () => {
      // When min > max, Math.max(num, min) >= min and Math.min(..., max) will choose max.
      // e.g. clamp(5, 10, 1) => Math.min(Math.max(5,10),1) => Math.min(10,1) => 1
      expect(clamp(5, 10, 1)).to.equal(1);
    });
  });

  describe('isInRange', () => {
    it('should return true for number within range', () => {
      expect(isInRange(5, 0, 10)).to.be.true;
    });

    it('should return true for number at boundaries', () => {
      expect(isInRange(0, 0, 10)).to.be.true;
      expect(isInRange(10, 0, 10)).to.be.true;
    });

    it('should return false for number outside range', () => {
      expect(isInRange(-5, 0, 10)).to.be.false;
      expect(isInRange(15, 0, 10)).to.be.false;
    });

    it('should handle equal min and max', () => {
      expect(isInRange(3, 3, 3)).to.be.true;
      expect(isInRange(2, 3, 3)).to.be.false;
    });
  });

  describe('roundTo', () => {
    it('should round to specified decimal places', () => {
      expect(roundTo(3.14159, 2)).to.equal(3.14);
      expect(roundTo(3.14159, 3)).to.equal(3.142);
      expect(roundTo(3.14159, 0)).to.equal(3);
      expect(roundTo(3.14159)).to.equal(3);
    });

    it('should handle negative numbers', () => {
      expect(roundTo(-3.14159, 2)).to.equal(-3.14);
    });

    it('should handle zero', () => {
      expect(roundTo(0, 2)).to.equal(0);
    });

    it('should handle negative precision', () => {
      expect(roundTo(123.456, -1)).to.equal(120);
      expect(roundTo(123.456, -2)).to.equal(100);
    });
  });
});