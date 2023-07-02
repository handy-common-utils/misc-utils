/**
 * Substitute all occurrences of a pattern in a string.
 * @param input The input string on which the substitutions will be performed.
 * @param searchPattern The regular expression pattern used to search for segments that should be substituted.
 *        It must have the `g` flag set.
 *        If the beginning part of the `input` should be skipped, set the `lastIndex` of the `searchPattern` before calling this function.
 *        After all the substitution are done, the `lastIndex` of the `searchPattern` will be reset to zero.
 *        See {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/lastIndex}
 * @param substitute TThe function that builds the substitution string.
 *        It is called with the matched substring and the result of `RegExp.exec()`.
 *        See {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec#examples}.
 *        The function can return null to indicate that no further substitution is desired.
 *        In such case, the `lastIndex` of the `searchPattern` will not be reset to zero.
 * @returns The resulting string after performing all substitutions.
 */
export function substituteAll<T extends string|null|undefined>(input: T, searchPattern: RegExp, substitute: (match: string, matchResult: NonNullable<ReturnType<RegExp['exec']>>) => string|null): T {
  if (input == null) {
    return input;
  }

  if (!searchPattern.global) {
    throw new Error('searchPattern must have the g flag');
  }

  const segments: string[] = [];
  let result;
  let previousLastIndex = 0;
  while ((result = searchPattern.exec(input)) !== null) {
    const substitution = substitute(result[0], result);
    if (substitution == null) { // append the remaining and exit
      segments.push(input.slice(previousLastIndex));
      previousLastIndex = input.length;
      break;
    }
    segments.push(input.slice(previousLastIndex, searchPattern.lastIndex - result[0].length), substitution);
    previousLastIndex = searchPattern.lastIndex;
  }
  if (segments.length === 0) {  // no matching at all
    return input as T;
  }
  if (previousLastIndex < input.length) { // remaining part
    segments.push(input.slice(previousLastIndex));
  }
  return segments.join('') as T;
}
