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

export interface UserRegistration {
  username: string,
  password: string,
  repeatedPassword: string,
  email: string | null,
  firstName: string,
  middleName: string | null,
  lastName: string,
  birthDate: string | null
}


export interface UserUpdatableInfo {
  email: string | null,
  firstName: string,
  middleName: string | null,
  lastName: string,
  birthDate: string | null
}

export async function login(userLogin: UserLogin) {
  const loginFormData = new FormData();
  loginFormData.append("username", userLogin.username);
  loginFormData.append("password", userLogin.password);

  return apiClient.post<UserSession>("/auth/process-login", loginFormData);
}

export async function register(userRegistration: UserRegistration) {
  return apiClient.post("/auth/register", userRegistration);
}

export async function getUserInfo(patientId: string) {
  return apiClient.get<UserUpdatableInfo>(getUserURL(patientId));
}

export async function putUserInfo(patientId: string, userInfo: UserUpdatableInfo) {
  return apiClient.put<UserUpdatableInfo>(getUserURL(patientId), userInfo);
}

function getUserURL(patientId: string) {
  return `/users/${patientId}`;
}
