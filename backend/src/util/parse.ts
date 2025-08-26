
export function strQueryToArray<T = string>(strQueryArg: string, parseFunction?: (item: string) => T): T[] {
  let arr = strQueryArg.split(',')

  if (parseFunction) {
    return arr.map(parseFunction);
  }

  return arr as T[];
}
