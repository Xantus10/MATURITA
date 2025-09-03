const BASE_URL = import.meta.env.VITE_BE_URL + '/api';
import { csrfHeaders } from "./csrf";

function constructURL(path: string, args: object = {}) {
  path = (path.length > 0) ? path : '/';
  path = (path[0] === '/') ? path : '/'+path;
  let url = new URL(`${BASE_URL}${path}`);
  if (args && typeof args === 'object') {
    Object.entries(args).forEach(([k, v]) => {
      url.searchParams.append(k, v);
    });
  }
  return url.toString();
}

export async function get(path: string, args: {[key: string]: any} = {}) {
  let url = constructURL(path, args);
  try {
    let res = await fetch(url, {method: 'GET', headers: {'Accept': 'application/json', ...csrfHeaders()}});
    return res;
  } catch (error) {
    console.error(error);
  }
}

export async function post(path: string, args: {[key: string]: any} = {}) {
  let url = constructURL(path);
  try {
    let res = await fetch(url, {method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json', ...csrfHeaders()}, body: JSON.stringify(args)});
    return res;
  } catch (error) {
    console.error(error);
  }
}

export async function deletef(path: string, args: {[key: string]: any} = {}) {
  let url = constructURL(path);
  try {
    let res = await fetch(url, {method: 'DELETE', headers: {'Accept': 'application/json', 'Content-Type': 'application/json', ...csrfHeaders()}, body: JSON.stringify(args)});
    return res;
  } catch (error) {
    console.error(error);
  }
}

export async function postFormV(path: string, args: {[key: string]: any} = {}) {
  let url = constructURL(path);
  let form = new FormData();
  if (args) {
    Object.entries(args).forEach(([k, v]) => {
      form.append(k, v);
    })
  }
  try {
    let res = await fetch(url, {method: 'POST', headers: {'Accept': 'application/json', ...csrfHeaders()}, body: form});
    return res;
  } catch (error) {
    console.error(error);
  }
}
