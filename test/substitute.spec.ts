/* eslint-disable unicorn/consistent-function-scoping */
import { expect } from 'chai';

import { substituteAll } from '../src';

describe('substituteAll', () => {
  it('should throw an error when the searchPattern does not have the g flag', () => {
    const input = 'Hello, world!';
    const searchPattern = /world/;
    const substitute = () => '';

    // Wrap the function call in a wrapper function to catch the error
    const wrapper = () => substituteAll(input, searchPattern, substitute);
    expect(wrapper).to.throw('searchPattern must have the g flag');
  });

  it('should handle null input', () => {
    const input: string | null = null;
    const searchPattern = /pattern/g;
    const substitute = () => 'replacement';

    const result = substituteAll(input, searchPattern, substitute);

    expect(result).to.equal(null);
  });

  it('should handle undefined input', () => {
    const searchPattern = /pattern/g;
    const substitute = () => 'replacement';

    const result = substituteAll(undefined, searchPattern, substitute);

    expect(result).to.equal(undefined);
  });

  it('should handle no substitutions', () => {
    const input = 'This is a test string';
    const searchPattern = /non-existent/g;
    const substitute = () => 'x';

    const result = substituteAll(input, searchPattern, substitute);

    expect(result).to.equal(input);
  });

  it('should substitute all occurrences of a pattern in a string', () => {
    const input = 'Hello, {name}! How are you, {name}?';
    const searchPattern = /{name}/g;
    const substitute = () => 'John Doe';

    const result = substituteAll(input, searchPattern, substitute);
    const expected = 'Hello, John Doe! How are you, John Doe?';

    expect(result).to.equal(expected);
  });

  it('should handle substitute function returning null on the second invocation', () => {
    const input = 'Hello, {name}! How are you, {name}? {name} is a nice name.';
    const searchPattern = /{name}/g;
    let substituteCount = 0;
    const substitute = () => {
      substituteCount++;
      return substituteCount === 2 ? null : 'John Doe';
    };

    const result = substituteAll(input, searchPattern, substitute);
    const expected = 'Hello, John Doe! How are you, {name}? {name} is a nice name.';

    expect(result).to.equal(expected);
  });

  it('should handle substitute function utilizing result[1]', () => {
    const input = 'Hello, [name]! How are you, [name]?';
    const searchPattern = /\[([^[\]]+)]/g;
    const substitute = (_: string, result: any) => `Mr. ${result[1]}`;

    const result = substituteAll(input, searchPattern, substitute);
    const expected = 'Hello, Mr. name! How are you, Mr. name?';

    expect(result).to.equal(expected);
  });

  it('should replace placeholder variables in a template string', () => {
    const input = 'Hello, {name}! How are you, {name}? I am {me}';
    const searchPattern = /{([^{}]+)}/g;
    const dict: Record<string, string> = {
      name: 'John',
      me: 'James',
    };
    const substitute: Parameters<typeof substituteAll>[2] = (_match, result) => {
      const key = result[1];
      return dict[key] ?? `{NOT FOUND: ${key}}`;
    };

    const result = substituteAll(input, searchPattern, substitute);
    const expected = 'Hello, John! How are you, John? I am James';

    expect(result).to.equal(expected);
  });

  it('should transform dates in a non-standard format to a standardized format', () => {
    const input = 'Event date: 12/31/21';
    const searchPattern = / ((\d{2})\/(\d{2})\/(\d{2}))/g;
    const substitute = (_: string, result: any) => {
      const [match, date, month, day, year] = result;
      const formattedDate = `20${year}-${month}-${day}`;
      return match.replace(date, formattedDate);
    };

    const result = substituteAll(input, searchPattern, substitute);
    const expected = 'Event date: 2021-12-31';

    expect(result).to.equal(expected);
  });
});
