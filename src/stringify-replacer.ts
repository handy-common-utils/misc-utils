type Index = string|number;
type JsonStringifyReplacer = (this: any, key: string, value: any) => any;
export type PathAwareReplacer = (key: Index, value: any, path: string, obj: any, pathArray: ReadonlyArray<Index>, ancestors: ReadonlyArray<any>) => any;

const currentPath: any[] = [];
const ancestors: any[] = [];

export function pathAwareReplacer(replacer: PathAwareReplacer): JsonStringifyReplacer {
  return function (this: any, key: string, value: any): any {
    if (key === '') {   // root object
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
    return replacer(key, value, currentPath.join('.'), this, currentPath, ancestors);
  };
}
