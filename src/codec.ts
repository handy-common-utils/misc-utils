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
