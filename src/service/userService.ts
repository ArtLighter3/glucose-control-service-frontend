import "axios"
import axios from 'axios'

export interface UserSession {
  id: number,
  username: string,
  roles: Set<string>
}

export interface UserLogin {
  username: string,
  password: string,
  error: boolean
}

//const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const AUTH_LOGIN_URL = `${API_BASE_URL}/api/v1/auth/process-login`;

export async function login(username: string, password: string) {
  axios.defaults.withCredentials = true;
  const loginFormData = new FormData();
  loginFormData.append("username", username);
  loginFormData.append("password", password);

  return axios.post<UserSession>(AUTH_LOGIN_URL, loginFormData);
}
