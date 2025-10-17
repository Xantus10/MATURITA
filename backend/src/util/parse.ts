
/**
 * Parse an array from the URL query
 * 
 * @param strQueryArg The argument from query
 * @param parseFunction Funtion to call on each item in the array (Used for changing the value type)
 * @returns Array of values of type T
 */
export function strQueryToArray<T = string>(strQueryArg: string, parseFunction?: (item: string) => T): T[] {
  let arr = strQueryArg.split(',')

  if (parseFunction) {
    return arr.map((val) => parseFunction(val));
  }

  return arr as T[];
}
