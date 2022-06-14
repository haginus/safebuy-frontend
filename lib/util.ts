import { Service, USER_API_URL, PAYMENT_API_URL } from "./constants";
import * as SecureStore from 'expo-secure-store';

export async function apiCall<R>(service: Service, url: string, method: string, data?: any) {
  const urls = {
    [Service.USER]: USER_API_URL,
    [Service.MARKETPLACE]: 'null',
    [Service.PAYMENT]: PAYMENT_API_URL,
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
      headers,
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

export function formatPrice(price: number) {
  const formatter = new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'lei',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
  return formatter.format(price).toLowerCase();
}