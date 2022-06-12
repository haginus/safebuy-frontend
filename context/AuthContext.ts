import { createContext } from "react";
import { AuthResponse } from "../lib/model/AuthResponse";

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export interface IAuthContext {
  signIn: (authResponse: AuthResponse) => void;
  signOut: () => void;
}