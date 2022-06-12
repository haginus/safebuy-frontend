import { Service, USER_API_URL } from "./constants";
import * as SecureStore from 'expo-secure-store';

export async function apiCall<R>(service: Service, url: string, method: string, data?: any) {
  const urls = {
    [Service.USER]: USER_API_URL,
    [Service.MARKETPLACE]: 'null',
    [Service.PAYMENT]: 'null'
  }
  
  const resultUrl = new URL(url, urls[service]).toString();
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  const token = await SecureStore.getItemAsync("token");
  if(token) {
    headers.append("Authorization", `Bearer ${token}`);
  }
  try {
    const result = await fetch(resultUrl, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    if(!result.ok) {
      throw (await result.json()); 
    }
    return result.json() as Promise<R>;
  } catch(e) {
    console.log(e);
    throw { message: "Something went wrong", code: "Unknown" };
  }
}