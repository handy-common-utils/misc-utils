type Parent = Record<string|number|symbol, unknown>|Array<unknown>;
/**
 * The original replacer expected by JSON.stringify(...)
 */
export type JsonStringifyReplacer = (this: any, key: string, value: any) => any;

/**
 * The replacer that can potentially utilise the full path of the property in the object.
 * @param key Name of the property, or the index in the parent array.
 * @param value Value of the property or the object in the parent array.
 * @param path The full path of the property in the object, such like "access.visitor.location" or "request.x-forwarded-for.0".
 *             Please note that the special characters (including ".") in property names are not escaped, for example, "order.billing address.first line".
 * @param parent The object that the property or the element belongs to. It could be `{ '': <the original object> }` when this replacer function is called the first time.
 * @param pathArray The full path as an array. It is more useful than `path` in case special characters exist in property names.
 *                  When this replacer function is called the first time, pathArray array would have a zero length.
 * @param ancestors All the ancestor objects/arrays of the property.
 *                  When this replacer function is called the first time, ancestors array would have a zero length.
 */
export type PathAwareReplacer = (key: string, value: any, path: string, parent: Parent, pathArray: Array<string>, ancestors: Array<Parent>) => any;

/**
 * Build a replacer function that can be passed to JSON.stringify(...).
 * @param replacer The actual replacer function which could utilise additional information.
 * @param options Options to control whether the pathArray and ancestors parameters would have values populated.
 *                By default all information available would be populated.
 *                There is no need to specify options unless you are extremely concerned about performance, for example if you need to frequently stringify 500MB objects.
 * @param options.pathArray When false, pathArray would be an empty array. This would remove the need to construct a pathArray from the path string.
 * @param options.ancestors When false, ancestors would be an empty array.
 * @returns The replacer function that can be passed to JSON.stringify(...).
 */
export function pathAwareReplacer(replacer: PathAwareReplacer, options?: {pathArray?: boolean, ancestors?: boolean}): JsonStringifyReplacer {
  const currentPath: any[] = [];
  const ancestors: any[] = [];
  return function (this: any, key: string, value: any): any {
    if (typeof key === 'string' && key === '') {   // root object
      currentPath.length = 0;
      ancestors.length = 0;
    } else {
      let i = ancestors.length - 1;
      for (; i >= 0; i--) {
        if (ancestors[i] === this) {
          ancestors.length = i + 1;
          currentPath.length = i;
          break;
        }
      }
      if (i < 0) {
        ancestors.push(this);
      }
      currentPath.push(key);
    }
    return replacer(
      key,
      value,
      currentPath.join('.'),
      this,
      options?.pathArray === false ? [] : [...currentPath],
      options?.ancestors === false ? [] : [...ancestors],
    );
  };
}

/**
 * A JsonStringifyReplacer that was created from path based rules.
 * Those rules are stored in the `rules` property in case of need.
 */
export type JsonStringifyReplacerFromPathBasedRules = JsonStringifyReplacer & { rules: Array<[RegExp, (input: any) => any]> };

/**
 * Create a replacer function for JSON.stringify(...) from an array of path based rules.
 * This function is useful for creating masking replacers which can apply masking based on the path of the property.
 * @example
 * import { mask, maskAll, maskEmail, maskFullName, pathBasedReplacer } from '@handy-common-utils/misc-utils';
 * console.log(JSON.stringify(obj, pathBasedReplacer([
 *  [/.*\.x-api-key$/, maskAll],
 *  [/.*customer\.name$/, maskFullName],
 *  [/.*customer\..*[eE]mail$/, maskEmail],
 *  [/.*\.zip$/, (value: string) => value.slice(0, 3) + 'XX'],
 *  [/.*\.cc$/, () => undefined],
 *  [/.*\.ssn$/, mask],
 * ])));
 * @param rules Array of rules: if the regular expression tests true with the property path, the replacer function will be applied on the value
 * @returns The replacer function built from those path based rules. It also has a `rules` property storing all the path based rules provided as inputs.
 */
export function pathBasedReplacer(rules: JsonStringifyReplacerFromPathBasedRules['rules']): JsonStringifyReplacerFromPathBasedRules {
  const replacer =  pathAwareReplacer(function (_key: string, value: any, path: string): any {
    for (const [regexp, replace] of rules) {
      if (regexp.test(path)) {
        return replace(value);
      }
    }
    return value;
  }, {
    pathArray: false,
    ancestors: false,
  });
  return Object.assign(replacer, { rules });
}
