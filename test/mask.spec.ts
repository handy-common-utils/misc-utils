/* eslint-disable unicorn/no-useless-undefined */
import { expect } from 'chai';
import { mask, maskAll, maskEmail, maskFullName } from '../src/mask';

describe('mask(...)', () => {
  it('should handle null/undefined/empty correctly', () => {
    expect(mask(undefined)).to.be.undefined;
    expect(mask(null)).to.be.null;
    expect(mask('')).to.equal('');
  });
  it('should throw Error when minLength <= keepLeft + keepRight', () => {
    expect(() => mask('abcd', 3, 5, 2)).to.throw;
    expect(() => mask('abcd', 3, 0, 2)).to.throw;
    expect(() => mask('abcd', 0, 2, 2)).to.throw;
  });
  it('should be able to mask with same length asterisks', () => {
    expect(mask('abcde')).to.equal('a****');
    expect(mask('abc')).to.equal('a**');
    expect(mask('ab')).to.equal('**');
    expect(mask('abcde', 1, 1)).to.equal('a***e');
    expect(mask('abcde', 0, 2)).to.equal('***de');
    expect(mask('abcde', 0, 0)).to.equal('*****');
    expect(mask('abcde', 2, 2, 5)).to.equal('ab*de');
  });
  it('should be able to mask with fixed length asterisks', () => {
    expect(mask('ab', 1, 1, 3, 5)).to.equal('*****');
    expect(mask('abcde', 1, 1, 3, 2)).to.equal('a**e');
    expect(mask('abcde', 0, 2, 3, 10)).to.equal('**********de');
    expect(mask('abcde', 0, 0, 3, 1)).to.equal('*');
    expect(mask('abcde', 2, 2, 5, 0)).to.equal('abde');
  });
  it('should be able to mask with fixed length mask', () => {
    expect(mask('abcde', 1, 1, 3, '###')).to.equal('a###e');
    expect(mask('abcde', 0, 2, 3, '##')).to.equal('##de');
    expect(mask('abcde', 0, 0, 3, 'xyz')).to.equal('xyz');
    expect(mask('abcde', 2, 2, 5, '!')).to.equal('ab!de');
  });
  it('should be able to use maskPattern', () => {
    expect(mask('abcde', 1, 1, 3, 2, '!')).to.equal('a!!e');
    expect(mask('abcde', 0, 2, 3, 10, 'xyz')).to.equal('xyzxyzxyzxde');
    expect(mask('abcde', 0, 0, 3, 1, 'xyz')).to.equal('x');
    expect(mask('abcde', 2, 2, 5, 0, '!')).to.equal('abde');
  });
});

describe('maskEmail(...)', () => {
  it('should handle null/undefined/empty correctly', () => {
    expect(maskEmail(undefined)).to.be.undefined;
    expect(maskEmail(null)).to.be.null;
    expect(maskEmail('')).to.equal('');
  });
  it('should mask normal email addresses correctly', () => {
    expect(maskEmail('james.hu@address.com')).to.equal('j****.**@address.com');
    expect(maskEmail('her@here.com')).to.equal('h**@here.com');
    expect(maskEmail('me@here.com')).to.equal('**@here.com');
    expect(maskEmail('my.new.email.address@example.com')).to.equal('**.n**.e****.a******@example.com');
  });
  it('should invalid email addresses correctly', () => {
    expect(maskEmail('ok')).to.equal('**');
    expect(maskEmail('.com')).to.equal('.***');
    expect(maskEmail('@here.com')).to.equal('@********');
    expect(maskEmail('me@')).to.equal('**@');
    expect(maskEmail('me@@@@')).to.equal('m*****');
    expect(maskEmail('her@')).to.equal('h**@');
    expect(maskEmail('her@@@@')).to.equal('h******');
    expect(maskEmail('new.@')).to.equal('n**.@');
    expect(maskEmail('1.2.3')).to.equal('1****');
    expect(maskEmail('1.2.3@')).to.equal('*.*.*@');
    expect(maskEmail('1...3@')).to.equal('*...*@');
    expect(maskEmail('@')).to.equal('*');
    expect(maskEmail('.')).to.equal('*');
  });
});

describe('maskFullName(...)', () => {
  it('should handle null/undefined/empty correctly', () => {
    expect(maskFullName(undefined)).to.be.undefined;
    expect(maskFullName(null)).to.be.null;
    expect(maskFullName('')).to.equal('');
  });
  it('should mask names correctly', () => {
    expect(maskFullName('James Hu')).to.equal('J**** **');
    expect(maskFullName('John Smith')).to.equal('J*** S****');
    expect(maskFullName('Mike')).to.equal('M***');
    expect(maskFullName('Mia')).to.equal('M**');
    expect(maskFullName('Me')).to.equal('**');
    expect(maskFullName('John von Neumann')).to.equal('J*** v** N******');
    expect(maskFullName('Two  Spaces')).to.equal('T**  S*****');
    expect(maskFullName('张三丰')).to.equal('张**');
    expect(maskFullName('张三')).to.equal('**');
  });
});

describe('maskAll(...)', () => {
  it('should handle null/undefined/empty correctly', () => {
    expect(maskAll(undefined)).to.be.undefined;
    expect(maskAll(null)).to.be.null;
    expect(maskAll('')).to.equal('');
  });
  it('should replace each character with asterisk', () => {
    expect(maskAll('a')).to.equal('*');
    expect(maskAll('aaaaaaaa')).to.equal('********');
    expect(maskAll('a a a c')).to.equal('*******');
  });
});
