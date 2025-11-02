
/**
 * Parse an array from the URL query
 * 
 * @param arr The argument from query
 * @param parseFunction Funtion to call on each item in the array (Used for changing the value type)
 * @returns Array of values of type T
 */
export function parseArray<T = number>(arr: string[], parseFunction?: (item: string) => T): T[] {

  if (parseFunction) {
    return arr.map((val) => parseFunction(val));
  }

  return arr as T[];
}
