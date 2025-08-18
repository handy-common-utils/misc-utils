import { expect } from 'chai';

import {
  couldBeNetworkingTimeoutError,
  couldBeServerError,
  couldBeTemporaryNetworkingError,
} from '../src/errors';

describe('couldBeNetworkingTimeoutError', () => {
  it('should return true for statusCode 504', () => {
    expect(couldBeNetworkingTimeoutError({ statusCode: 504 })).to.be.true;
    expect(couldBeNetworkingTimeoutError({ response: { status: 504 } })).to.be.true;
  });

  it('should return true for message containing ETIMEDOUT', () => {
    expect(couldBeNetworkingTimeoutError({ errorMessage: 'ETIMEDOUT occurred' })).to.be.true;
    expect(couldBeNetworkingTimeoutError(new Error('ETIMEDOUT'))).to.be.true;
  });

  it('should return false for other errors', () => {
    expect(couldBeNetworkingTimeoutError({ statusCode: 400 })).to.be.false;
    expect(couldBeNetworkingTimeoutError(new Error('Some other error'))).to.be.false;
  });
  it('should return false for undefined and null', () => {
    expect(couldBeNetworkingTimeoutError(undefined as any)).to.be.false;
    expect(couldBeNetworkingTimeoutError(null)).to.be.false;
  });
});

describe('couldBeTemporaryNetworkingError', () => {
  it('should return true for statusCode 504', () => {
    expect(couldBeTemporaryNetworkingError({ statusCode: 504 })).to.be.true;
  });

  it('should return true for message containing ECONNREFUSED', () => {
    expect(couldBeTemporaryNetworkingError({ errorMessage: 'ECONNREFUSED' })).to.be.true;
  });

  it('should return true for message containing ETIMEDOUT', () => {
    expect(couldBeTemporaryNetworkingError({ errorMessage: 'ETIMEDOUT' })).to.be.true;
  });

  it('should return true for message containing EAI_AGAIN', () => {
    expect(couldBeTemporaryNetworkingError({ errorMessage: 'EAI_AGAIN' })).to.be.true;
  });

  it('should return true for message containing socket hang up', () => {
    expect(couldBeTemporaryNetworkingError({ errorMessage: 'socket hang up' })).to.be.true;
  });

  it('should return false for other errors', () => {
    expect(couldBeTemporaryNetworkingError({ statusCode: 400 })).to.be.false;
    expect(couldBeTemporaryNetworkingError(new Error('Some other error'))).to.be.false;
  });
  it('should return false for undefined and null', () => {
    expect(couldBeTemporaryNetworkingError(undefined as any)).to.be.false;
    expect(couldBeTemporaryNetworkingError(null)).to.be.false;
  });
});

describe('couldBeServerError', () => {
  it('should return true for statusCode in 5xx range', () => {
    expect(couldBeServerError({ statusCode: 500 })).to.be.true;
    expect(couldBeServerError({ statusCode: 502 })).to.be.true;
    expect(couldBeServerError({ response: { status: 503 } })).to.be.true;
  });

  it('should return true for message containing Internal Server Error', () => {
    expect(couldBeServerError({ errorMessage: 'Internal Server Error' })).to.be.true;
    expect(couldBeServerError(new Error('Internal Server Error'))).to.be.true;
  });

  it('should return false for other errors', () => {
    expect(couldBeServerError({ statusCode: 404 })).to.be.false;
    expect(couldBeServerError(new Error('Some other error'))).to.be.false;
  });
  it('should return false for undefined and null', () => {
    expect(couldBeServerError(undefined as any)).to.be.false;
    expect(couldBeServerError(null)).to.be.false;
  });
});