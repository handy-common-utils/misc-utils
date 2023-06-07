/* eslint-disable unicorn/no-useless-undefined */
import { expect } from 'chai';
import { base64UrlFromUInt32, shortBase64UrlFromUInt32, urlSafe } from '../src/index';

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

