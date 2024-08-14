// eslint-disable-next-line unicorn/prefer-node-protocol
import * as crypto from 'crypto';

/**
 * Make a "normal" (BASE64) string URL/path safe.
 * @param base64Input A (BASE64) string which could be null or undefined.
 * @param replacements A string containing replacement characters for "/", "+", and "=".
 * If omitted, default value of '_-=' would be used.
 * @returns URL/path safe version of the (BASE64) input string, or the original input if it is null or undefined.
 */
export function urlSafe<T extends string | undefined | null>(base64Input: T, replacements = '_-='): T {
  if (base64Input == null) {
    return base64Input;
  }
  return base64Input.replace(/\//g, replacements.charAt(0))
        .replace(/\+/g, replacements.charAt(1))
        .replace(/=/g, replacements.charAt(2)) as T;
}

/**
 * Encode an unsigned 32-bit integer into BASE64 string.
 * @param ui32 A 32-bit integer number which could also be null or undefined.
 * It must be a valid unsigned 32-bit integer. Behavior is undefined when the value is anything other than an unsigned 32-bit integer.
 * If you don't care about loosing precision, you can convert a number by doing `n >>> 0` (See https://stackoverflow.com/questions/22335853/hack-to-convert-javascript-number-to-uint32)
 * @returns BASE64 string representing the integer input, or the original input if it is null or undefined.
 */
export function base64FromUInt32<T extends number | undefined | null>(ui32: T): Exclude<T, number> | string {
  if (ui32 == null) {
    return ui32 as any;
  }
  const buf = Buffer.allocUnsafe(4);
  buf.writeUInt32BE(ui32!, 0);
  return buf.toString('base64');
}

/**
 * Encode an unsigned 32-bit integer into BASE64 string without trailing '='.
 * @param ui32 A 32-bit integer number which could also be null or undefined.
 * It must be a valid unsigned 32-bit integer. Behavior is undefined when the value is anything other than an unsigned 32-bit integer.
 * If you don't care about loosing precision, you can convert a number by doing `n >>> 0` (See https://stackoverflow.com/questions/22335853/hack-to-convert-javascript-number-to-uint32)
 * @returns BASE64 string without trailing '=' representing the integer input, or the original input if it is null or undefined.
 */
export function shortBase64FromUInt32<T extends number | undefined | null>(ui32: T): Exclude<T, number> | string {
  if (ui32 == null) {
    return ui32 as any;
  }
  return base64FromUInt32(ui32 as number).replace(/=+$/, '');
}

/**
 * Encode an unsigned 32-bit integer into URL/path safe BASE64 string.
 * @param ui32 A 32-bit integer number which could also be null or undefined.
 * It must be a valid unsigned 32-bit integer. Behavior is undefined when the value is anything other than an unsigned 32-bit integer.
 * If you don't care about loosing precision, you can convert a number by doing `n >>> 0` (See https://stackoverflow.com/questions/22335853/hack-to-convert-javascript-number-to-uint32)
 * @param replacements A string containing replacement characters for "/", "+", and "=".
 * If omitted, default value of '_-=' would be used.
 * @returns URL/path safe BASE64 string representing the integer input, or the original input if it is null or undefined.
 */
export function base64UrlFromUInt32<T extends number | undefined | null>(ui32: T, replacements = '_-='): Exclude<T, number> | string {
  return urlSafe(base64FromUInt32(ui32), replacements);
}

/**
 * Encode an unsigned 32-bit integer into URL/path safe BASE64 string without trailing '='.
 * @param ui32 A 32-bit integer number which could also be null or undefined.
 * It must be a valid unsigned 32-bit integer. Behavior is undefined when the value is anything other than an unsigned 32-bit integer.
 * If you don't care about loosing precision, you can convert a number by doing `n >>> 0` (See https://stackoverflow.com/questions/22335853/hack-to-convert-javascript-number-to-uint32)
 * @param replacements A string containing replacement characters for "/" and "+".
 * If omitted, default value of '_-' would be used.
 * @returns URL/path safe BASE64 string without trailing '=' representing the integer input, or the original input if it is null or undefined.
 */
export function shortBase64UrlFromUInt32<T extends number | undefined | null>(ui32: T, replacements = '_-'): Exclude<T, number> | string {
  return urlSafe(shortBase64FromUInt32(ui32), replacements);
}

/**
 * Generate a strong (using crypto.randomFillSync(...)) random string that is URL/path safe.
 * In the generated string, approximately every 6 characters represent randomly generated 32 bits.
 * For example, if you need 128 bits of randomness, you just need to generate a string containing 24 characters.
 * @param len length of the string to be generated
 * @returns the random string
 */
export function generateRandomString(len: number): string {
  // 32 bits => 6 characters
  const numbers = new Uint32Array(Math.ceil((len + 1) / 6));
  crypto.randomFillSync(numbers);
  const strings: string[] = [];
  for (const i of numbers) {
    strings.push(shortBase64UrlFromUInt32(i));
  }
  return strings.join('').slice(0, len);
}

/**
 * Generate a weak (using Math.random()) random string that is URL/path safe.
 * In the generated string, approximately every 6 characters represent randomly generated 32 bits.
 * For example, if you need 128 bits of randomness, you just need to generate a string containing 24 characters.
 * @param len length of the string to be generated
 * @returns the random string
 */
export function generateRandomStringQuickly(len: number): string {
  // 32 bits => 6 characters
  const strings: string[] = [];
  for (let i = 0; i < Math.ceil((len + 1) / 6); i++) {
    strings.push(shortBase64UrlFromUInt32((Math.random() * 4294967295) >>> 0));
  }
  return strings.join('').slice(0, len);
}

/**
 * Escape a string literal for using it inside of RegExp.
 * (From: https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex)
 * @param text the string literal to be escaped
 * @returns escaped string that can be used inside of RegExp, or an empty string if the input is null or undefined
 */
export function escapeForRegExp(text: string|undefined|null): string {
  if (text == null) {
    return '';
  }
  // eslint-disable-next-line unicorn/better-regex
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

/**
 * Escape replacement string for using it inside of RegExp replacement parameter.
 * (From: https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex)
 * @param text the replacement string to be escaped, or an empty string if the input is null or undefined
 * @returns escaped replacement string that can be used inside of RegExp replacement parameter
 */
export function escapeForRegExpReplacement(text: string|undefined|null): string {
  if (text == null) {
    return '';
  }
  return text.replace(/\$/g, '$$$$');
}
