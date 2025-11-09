/* eslint-disable unicorn/no-array-callback-reference */
/* eslint-disable unicorn/prefer-spread */

/**
 * Options to customize the merge behavior.
 */
export interface MergeOptions {
  /**
   * If `true`, the merge will be immutable, creating a new object.
   * If `false` or not provided, the destination object will be mutated.
   * @default false
   */
  immutable?: boolean;

  /**
   * Defines how to handle arrays during the merge.
   * - `replace`: The source array completely replaces the destination array.
   * - `append`: The source array's elements are added to the end of the destination array.
   * - `merge`: (Default) Mimics Lodash's behavior. It overwrites elements at the same index.
   *   If an element is an object, it merges them recursively. If the source array is longer,
   *   its additional elements are appended.
   * @default 'merge'
   */
  array?: 'replace' | 'append' | 'merge';

  /**
   * Defines how to handle `Set` objects during the merge.
   * - `replace`: (Default) The source `Set` completely replaces the destination `Set`.
   * - `merge`: A new `Set` is created containing all elements from both the destination and source `Set`s.
   * @default 'replace'
   */
  set?: 'replace' | 'merge';
}

const isObject = (value: any): value is Record<string, any> => {
  const type = typeof value;
  return value != null && (type === 'object' || type === 'function') && !Array.isArray(value);
};

const isPlainObject = (value: any): value is Record<string, any> => {
  if (!isObject(value) || Object.prototype.toString.call(value) !== '[object Object]') {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  if (proto === null) {
    return true;
  }
  const Ctor = Object.prototype.hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor === 'function' && Ctor instanceof Ctor && Function.prototype.toString.call(Ctor) === Function.prototype.toString.call(Object);
};

/**
 * Recursively merges properties of one or more source objects into a destination object.
 *
 * @param options - Customizes the merge behavior.
 * @param destination - The object to merge properties into. It will be mutated unless `options.immutable` is true.
 * @param sources - The source objects.
 * @returns The merged object.
 */
export function merge<T extends object, U extends any[]>(
  options: MergeOptions | null | undefined,
  destination: T,
  ...sources: U
): T & (U[number]) {
  const finalOptions: Required<MergeOptions> = {
    immutable: false,
    array: 'merge',
    set: 'replace',
    ...options,
  };

  const deepClone = <V>(value: V): V => {
    if (!isObject(value)) {
      return value;
    }

    if (value instanceof Set) {
      return new Set(Array.from(value.values()).map(deepClone)) as any;
    }

    if (Array.isArray(value)) {
      return value.map(deepClone) as any;
    }

    if (isPlainObject(value)) {
      const newObj: Record<string, any> = {};
      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          newObj[key] = deepClone(value[key]);
        }
      }
      return newObj as any;
    }

    // For other complex objects (like Date, RegExp, class instances), return them as is.
    return value;
  };

  let output = finalOptions.immutable ? deepClone(destination) : destination;

  const baseMerge = (target: any, source: any) => {
    if (!isObject(target) || !isObject(source)) {
      return;
    }

    Object.keys(source).forEach(key => {
      const targetValue = target[key];
      const sourceValue = source[key];

      if (sourceValue === undefined) {
        return;
      }

      // Handle Sets
      if (targetValue instanceof Set && sourceValue instanceof Set) {
        // eslint-disable-next-line perfectionist/sort-sets
        target[key] = finalOptions.set === 'merge' ? new Set([...targetValue, ...sourceValue]) : sourceValue;
        return;
      }

      // Handle Arrays
      if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
        if (finalOptions.array === 'replace') {
          target[key] = sourceValue;
        } else if (finalOptions.array === 'append') {
          target[key] = targetValue.concat(sourceValue);
        } else { // 'merge'
          sourceValue.forEach((item, index) => {
            if (isPlainObject(targetValue[index]) && isPlainObject(item)) {
              baseMerge(targetValue[index], item);
            } else if (index < targetValue.length) {
              targetValue[index] = item;
            } else {
              targetValue.push(item);
            }
          });
        }
        return;
      }

      // Handle plain objects
      if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
        baseMerge(targetValue, sourceValue);
        return;
      }

      // For all other cases (primitives, non-plain objects, etc.), replace the value.
      target[key] = sourceValue;
    });
  };

  for (const source of sources) {
    if (source) {
      baseMerge(output, source);
    }
  }

  return output as T & U[number];
}
