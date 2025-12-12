
/**
 * Parse an array from the URL query
 * 
 * @param arr The argument from query
 * @param parseFunction Funtion to call on each item in the array (Used for changing the value type)
 * @returns Array of values of type T
 */
export function parseArray<T = number>(arr: string[], parseFunction?: (item: string) => T): T[] {
  if (typeof arr !== 'object') {
    return [arr] as T[];
  }

  if (parseFunction) {
    return arr.map((val) => parseFunction(val));
  }

  return arr as T[];
}

/**
 * Capitalize the first letter of any string
 * @param val The string to capitalize
 * @returns Capitalized string
 */
export function capitalizeFirstLetter(s: string) {
    return String(s).charAt(0).toUpperCase() + String(s).slice(1);
}
