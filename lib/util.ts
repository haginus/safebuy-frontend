import { Service, USER_API_URL, PAYMENT_API_URL, MARKETPLACE_API_URL } from "./constants";
import * as SecureStore from 'expo-secure-store';
import { Animated } from "react-native";
import { GenericError } from "./model/GenericError";

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

export function formatUrlParams(url: string, params: { [key: string]: any }) {
  const urlParts = url.split('?');
  const urlPath = urlParts[0];
  const urlParams = urlParts[1] ? urlParts[1].split('&') : [];
  Object.keys(params).forEach(key => {
    if(params[key] != null && params[key] != '') {
      urlParams.push(key + '=' + params[key])
    }
  });
  return `${urlPath}?${urlParams.join('&')}`;
}



type AnimationABProperties = { [key: string]: { from: number, to: number } };
type AnimationABOptions = { duration: number, easing?: string };

export class AnimationAB {

  public values: { [key: string]: Animated.Value }

  constructor(private properties: AnimationABProperties, private options: AnimationABOptions) {
    this.values = Object.keys(properties).reduce((acc, key) => {
      acc[key] = new Animated.Value(properties[key].from);
      return acc;
    }, {} as any);
  }

  toA(callback?: Animated.EndCallback | undefined) {
    this._generateAnim('from').start(callback);
  }

  toB(callback?: Animated.EndCallback | undefined) {
    this._generateAnim('to').start(callback);
  }
  
  alternate(until?: () => boolean | undefined) {
    const _until = (until || (() => true));
    _until() && this.toA(() => _until() && this.toB(() => this.alternate(until)));
  }

  private _generateAnim(value: 'from' | 'to') {
    const keys = Object.keys(this.properties);
    const timingArr = keys.map(key => {
      const property = this.properties[key];
      const { duration } = this.options;
      const toValue = property[value];
      return Animated.timing(this.values[key], {
        toValue,
        duration,
        useNativeDriver: false
      });
    });
    return Animated.parallel(timingArr);
  }
}

export function parseGenericError(dispatchResult: any) {
  if(dispatchResult.error) {
    return (dispatchResult.error as GenericError).message
  }
  return null;
}
