/**
 * File: http.ts
 * Purpose: Wrapper functions around standard fetch API
 */


/**
 * Base BE URL
 */
const BASE_URL = window.location.protocol + '://' + import.meta.env.VITE_BE_URL + '/api';
import { csrfHeaders } from "./csrf";

/**
 * Create an URL for a path with query params
 * 
 * @param path Path of the request
 * @param args Query params
 * @returns Complete URL
 */
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

/**
 * GET method wrapper
 * 
 * @param path Relative path to request to
 * @param args Query params
 * @returns Response or undefined if request failed
 */
export async function get(path: string, args: {[key: string]: any} = {}) {
  let url = constructURL(path, args);
  try {
    let res = await fetch(url, {method: 'GET', headers: {'Accept': 'application/json', ...csrfHeaders()}});
    return res;
  } catch (error) {
    console.error(error);
  }
}

/**
 * POST method wrapper
 * 
 * @param path Relative path to request to
 * @param args Body json params
 * @returns Response or undefined if request failed
 */
export async function post(path: string, args: {[key: string]: any} = {}) {
  let url = constructURL(path);
  try {
    let res = await fetch(url, {method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json', ...csrfHeaders()}, body: JSON.stringify(args)});
    return res;
  } catch (error) {
    console.error(error);
  }
}

/**
 * DELETE method wrapper
 * 
 * @param path Relative path to request to
 * @param args Body json params
 * @returns Response or undefined if request failed
 */
export async function deletef(path: string, args: {[key: string]: any} = {}) {
  let url = constructURL(path);
  try {
    let res = await fetch(url, {method: 'DELETE', headers: {'Accept': 'application/json', 'Content-Type': 'application/json', ...csrfHeaders()}, body: JSON.stringify(args)});
    return res;
  } catch (error) {
    console.error(error);
  }
}

/**
 * POST method wrapper  
 * Used for posting files with multipart/form-data
 * 
 * @param path Relative path to request to
 * @param args Body form params
 * @returns Response or undefined if request failed
 */
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
