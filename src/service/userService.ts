import "axios"
import axios from 'axios'
import apiClient from '@/service/apiClient.ts'

export interface UserSession {
  id: number,
  username: string,
  roles: Set<string>
}

export interface UserLogin {
  username: string,
  password: string
}

const AUTH_LOGIN_URL = `/auth/process-login`;

export async function login(userLogin: UserLogin) {
  const loginFormData = new FormData();
  loginFormData.append("username", userLogin.username);
  loginFormData.append("password", userLogin.password);

  return apiClient.post<UserSession>(AUTH_LOGIN_URL, loginFormData);
}
