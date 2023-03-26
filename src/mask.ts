/* eslint-disable no-mixed-operators */
/* eslint-disable unicorn/prefer-string-slice */

/**
 * Mask the content of a string
 * @param input The input which could also be null or undefined
 * @param keepLeft Number of characters on the left to be kept in the output without masking.
 *                 Default value is 1.
 * @param keepRight Number of characters on the right to be kept in the output without masking.
 *                  Default value is 0.
 * @param minLength Minimal length of the string for keepLeft and keepRight to be effective.
 *                  If the input string is shorter than this length, the whole string would be masked.
 *                  Default value is 3.
 * @param maskLengthOrMaskString The string to be used for replacing the part in the input that needs to be masked,
 *                               or the length of the mask string if a fixed length is desired,
 *                               or null/undefined if the mask string should have the same length as the part to be masked.
 *                               Default value is null.
 * @param maskPattern The pattern to be repeated as the mask.
 *                    Default value is '*'.
 * @returns String with masked content
 */
export function mask<T extends string|undefined|null>(input: T, keepLeft = 1, keepRight = 0, minLength = 3, maskLengthOrMaskString: number|string|undefined|null = null, maskPattern = '*'): T {
  if (minLength <= keepLeft + keepRight) {
    throw new Error(`Invalid parameter: expected minLength > keepLeft + keepRight, but got ${minLength}, ${keepLeft}, ${keepRight}`);
  }

  // pass through for undefined and null
  if (input == null) {
    return input;
  }

  if (input.length < minLength) {
    keepLeft = 0;
    keepRight = 0;
  }

  let maskString: string;
  if (typeof maskLengthOrMaskString === 'string') {
    maskString = maskLengthOrMaskString;
  } else {
    const maskLength = maskLengthOrMaskString == null ? (input.length - keepLeft - keepRight) : maskLengthOrMaskString;
    maskString = maskPattern.length === 1 ? maskPattern.repeat(maskLength) : maskPattern.repeat(maskLength / maskPattern.length + 1).substring(0, maskLength);
  }

  return `${input.substring(0, keepLeft)}${maskString}${input.substring(input.length - keepRight, input.length)}` as T;
}

/**
 * Mask sensitive information in an email address while keeping some information for troubleshooting
 * @param email the email address which could also be null or undefined
 * @returns masked email address
 */
export function maskEmail<T extends string|undefined|null>(email: T): T {
  // pass through for undefined and null
  if (email == null) {
    return email;
  }

  const segments = email.split('@');
  if (segments.length === 2 && segments[0].length >= 3) {
    const parts = segments[0].split('.');
    segments[0] = parts.map(s => mask(s, 1)).join('.');
    return segments.join('@') as T;
  }

  // does not look like an email
  return mask(email);
}

/**
 * Mask sensitive information in the full name while keeping useful information for troubleshooting
 * @param name the full name which could also be null or undefined
 * @returns masked full name
 */
export function maskFullName<T extends string|undefined|null>(name: T): T {
  // pass through for undefined and null
  if (name == null) {
    return name;
  }

  const segments = name.split(' ');
  return segments.map(s => mask(s, 1)).join(' ') as T;
}

/**
 * Replace each character of the input with '*'
 * @param input a string or null or undefined
 * @returns masked string or null or undefined
 */
export function maskAll<T extends string|undefined|null>(input: T): T {
  return mask(input, 0);
}
