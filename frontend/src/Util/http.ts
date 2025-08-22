const BASE_URL = import.meta.env.VITE_BE_URL;
import { csrfHeaders } from "./csrf";

function constructURL(path: string, args: object = {}) {
  path = (path.length > 0) ? path : '/';
  path = (path[0] === '/') ? path : '/'+path;
  let url = new URL(`${BASE_URL}${path}`);
  if (args && typeof args === 'object') {
    Object.entries(args).forEach((val: string[]) => {
      let k = val[0], v = val[1];
      url.searchParams.append(k, v);
    });
  }
  return url.toString();
}

export async function get(path: string, args: {[key: string]: string} = {}) {
  let url = constructURL(path, args);
  try {
    let res = await fetch(url, {method: 'GET', headers: {'Accept': 'application/json', ...csrfHeaders()}});
    return res;
  } catch (error) {
    console.error(error);
  }
}

export async function post(path: string, args: {[key: string]: string} = {}) {
  let url = constructURL(path);
  try {
    let res = await fetch(url, {method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json', ...csrfHeaders()}, body: JSON.stringify(args)});
    return res;
  } catch (error) {
    console.error(error);
  }
}
