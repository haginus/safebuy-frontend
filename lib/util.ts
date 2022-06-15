import { Service, USER_API_URL, PAYMENT_API_URL, MARKETPLACE_API_URL } from "./constants";
import * as SecureStore from 'expo-secure-store';

export async function apiCall<R>(service: Service, url: string, method: string, data?: any) {
  const urls = {
    [Service.USER]: USER_API_URL,
    [Service.MARKETPLACE]: MARKETPLACE_API_URL,
    [Service.PAYMENT]: PAYMENT_API_URL,
  }
  
  const resultUrl = new URL(url, urls[service]).toString();
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  const token = await SecureStore.getItemAsync("token");
  if(token) {
    headers.append("Authorization", `Bearer ${token}`);
  }
  return new Promise<R>((resolve, reject) => {
    fetch(resultUrl, { method, headers, body: JSON.stringify(data) })
      .then(async (result) => { 
        if(!result.ok) {
          reject(await result.json());
        }
        resolve(await result.json());
      })
      .catch(() => reject({ message: "Something went wrong", code: "Unknown" }));
  });
}

export function formatPrice(price: number, currency: string = 'lei') {
  const formatter = new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
  const formatted = formatter.format(price);
  return currency.toLowerCase() == currency ? formatted.toLowerCase() : formatted;
}

export function wait(timeout: number) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export function formatCardNumber(cardNumber: string) {
  return '••• ' + cardNumber.substring(cardNumber.length - 4);
}