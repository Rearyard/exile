import Axios from "axios";

export const API_PREFIX = ''

export interface BaseGetParameters {
  offset: number
  amount: number
}

export interface BaseResponse {
  status: boolean;
  msg?: string;
}

export async function get<TReturn = any, TQuery extends { [key: string]: any } = { [key: string]: any }>(path: string, query?: TQuery | undefined) {
  const qs = query ? '?' + Object
    .entries(query)
    .map(([k, v]) => `${k}=${v.toString()}`)
    .join('&') : ''

  return (await Axios.get(API_PREFIX + path + qs)).data as TReturn
}

export async function del<TReturn = any>(path: string) {
  return (await Axios.delete(API_PREFIX + path)).data as TReturn
}

export async function put<TReturn = any, TRequest = any>(path: string, data: TRequest) {
  return (await Axios.put(API_PREFIX + path, data)).data as TReturn
}

export async function post<TReturn = any, TRequest = any>(path: string, data: TRequest) {
  return (await Axios.post(API_PREFIX + path, data)).data as TReturn
}



