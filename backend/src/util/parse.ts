
export function strQueryToArray<T = string>(strQueryArg: string, parseFunction?: (item: string) => T): T[] {
  let arr = strQueryArg.split(',')

  if (parseFunction) {
    return arr.map((val) => parseFunction(val));
  }

  return arr as T[];
}
