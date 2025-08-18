/* eslint-disable unicorn/no-useless-undefined */
import { expect } from 'chai';

import { base64UrlFromUInt32, escapeForRegExp, escapeForRegExpReplacement, generateRandomString, generateRandomStringQuickly, shortBase64UrlFromUInt32, urlSafe } from '../src/index';

describe('pathSafe', () => {
  it('should return null for null', () => {
    expect(urlSafe(null)).to.be.null;
  });
  it('should return undefined for undefined', () => {
    expect(urlSafe(undefined)).to.be.undefined;
  });
  it('should do defult replacement correctly', () => {
    expect(urlSafe('abcd/xyz/123+456=579=?')).to.equal('abcd_xyz_123-456=579=?');
  });
  it('should do custom replacement correctly', () => {
    expect(urlSafe('abcd/xyz/123+456=579=?', '1,2')).to.equal('abcd1xyz1123,45625792?');
  });
});

describe('shortBase64UrlFromUInt32 and base64UrlFromUInt32', () => {
  it('should return null for null', () => {
    expect(shortBase64UrlFromUInt32(null)).to.be.null;
    expect(base64UrlFromUInt32(null)).to.be.null;
  });
  it('should return undefined for undefined', () => {
    expect(shortBase64UrlFromUInt32(undefined)).to.be.undefined;
    expect(base64UrlFromUInt32(undefined)).to.be.undefined;
  });
  for (const [i, r] of [
    [0, 'AAAAAA'],
    [1, 'AAAAAQ'],
    [1234234, 'ABLVOg'],
    [8378978, 'AH_aYg'],
  ] as Array<[number, string]>) {
    it(`should return correct values for ${i}`, () => {
      expect(shortBase64UrlFromUInt32(i)).to.equal(r);
      expect(base64UrlFromUInt32(i)).to.equal(r + '==');
    });
  }
});

describe('generateRandomString', () => {
  it('should generate strings of desired length', () => {
    expect(generateRandomString(0)).to.have.length(0);
    expect(generateRandomString(1)).to.have.length(1);
    expect(generateRandomString(5)).to.have.length(5);
    expect(generateRandomString(6)).to.have.length(6);
    expect(generateRandomString(7)).to.have.length(7);
    expect(generateRandomString(11)).to.have.length(11);
    expect(generateRandomString(12)).to.have.length(12);
    expect(generateRandomString(13)).to.have.length(13);
    expect(generateRandomString(900)).to.have.length(900);
  });
});

describe('generateRandomStringQuickly', () => {
  it('should generate strings of desired length', () => {
    expect(generateRandomStringQuickly(0)).to.have.length(0);
    expect(generateRandomStringQuickly(1)).to.have.length(1);
    expect(generateRandomStringQuickly(5)).to.have.length(5);
    expect(generateRandomStringQuickly(6)).to.have.length(6);
    expect(generateRandomStringQuickly(7)).to.have.length(7);
    expect(generateRandomStringQuickly(11)).to.have.length(11);
    expect(generateRandomStringQuickly(12)).to.have.length(12);
    expect(generateRandomStringQuickly(13)).to.have.length(13);
    expect(generateRandomStringQuickly(900)).to.have.length(900);
  });
});

describe('escapeForRegExp', () => {
  it('should return an empty string when input is undefined or null', () => {
    expect(escapeForRegExp(undefined)).to.equal('');
    expect(escapeForRegExp(null)).to.equal('');
  });
  it('should escape special characters used in RegExp', () => {
    expect(escapeForRegExp('.*+?^${}()|[]\\')).to.equal('\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
  });

  it('should return the same string if there are no special characters', () => {
    expect(escapeForRegExp('abc')).to.equal('abc');
  });

  it('should escape a string with mixed characters', () => {
    expect(escapeForRegExp('abc.*+?^$def')).to.equal(String.raw`abc\.\*\+\?\^\$def`);
  });

  it('should handle empty strings', () => {
    expect(escapeForRegExp('')).to.equal('');
  });

  it('should escape a string with only one special character', () => {
    expect(escapeForRegExp('$')).to.equal(String.raw`\$`);
  });
});

describe('escapeForRegExpReplacement', () => {
  it('should return an empty string when input is undefined or null', () => {
    expect(escapeForRegExpReplacement(undefined)).to.equal('');
    expect(escapeForRegExpReplacement(null)).to.equal('');
  });
  it('should escape $ in the replacement string', () => {
    expect(escapeForRegExpReplacement('$')).to.equal('$$');
  });

  it('should escape multiple $ symbols in the replacement string', () => {
    expect(escapeForRegExpReplacement('$$$')).to.equal('$$$$$$');
  });

  it('should return the same string if there are no $ symbols', () => {
    expect(escapeForRegExpReplacement('abc')).to.equal('abc');
  });

  it('should handle a string with mixed characters including $', () => {
    expect(escapeForRegExpReplacement('abc$def')).to.equal('abc$$def');
  });

  it('should handle empty strings', () => {
    expect(escapeForRegExpReplacement('')).to.equal('');
  });
});
