/**
 * File: autotype.ts
 * Purpose: Automatic typing support
 */

/**
 * When the dates come from BE response, they are in ISO format, we need the as Date objects
 * 
 * This function will bruteforce all the fields and try to convert them to
 * @param arr Array of objects which supposedly have a Date type field
 */
export function typedates(arr: any[]): any[] {
  return arr.map((val) => {
    let obj: { [key: string]: any } = {};
    Object.keys(val).forEach((key) => {
      const value = val[key];

      if (typeof value === 'string' && !isNaN(Date.parse(value))) {
        obj[key] = new Date(value);
      } else {
        obj[key] = value;
      }
    });
    return obj;
  });
}
