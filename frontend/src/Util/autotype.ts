/**
 * File: autotype.ts
 * Purpose: Automatic typing support
 */

/**
 * When the dates come from BE response, they are in ISO format, we need the as Date objects
 * 
 * This function will accept an array of objects and an array of keys to type and it will type them to Dates
 * @param arr Array of objects which supposedly have a Date type field
 */
export function typedates(arr: any[], keys: string[]): any[] {
  return arr.map((val) => {
    let obj: { [key: string]: any } = {};
    Object.keys(val).forEach((key) => {
      const value = val[key];

      if (keys.includes(key)) {
        obj[key] = new Date(value);
      } else {
        obj[key] = value;
      }
    });
    return obj;
  });
}
