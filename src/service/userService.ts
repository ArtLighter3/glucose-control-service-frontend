import "axios"
import apiClient from '@/service/apiClient.ts'
import type { Page } from '@/util/pagination.ts'

export enum Role {
  ROLE_PATIENT = "ROLE_PATIENT",
  ROLE_DOCTOR = "ROLE_DOCTOR",
  ROLE_ADMIN = "ROLE_ADMIN",
  ROLE_SUPERUSER = "ROLE_SUPERUSER"
}

export interface UserSession {
  id: number,
  username: string,
  roles: Set<Role>
}

export interface UserLogin {
  username: string,
  password: string
}

export interface UserRegistration {
  username: string | null,
  password: string | null,
  repeatedPassword: string | null,
  email: string | null,
  firstName: string | null,
  middleName: string | null,
  lastName: string | null,
  birthDate: string | null
}

export interface UserUpdatableInfo {
  email: string | null,
  firstName: string,
  middleName: string | null,
  lastName: string,
  birthDate: string | null
}

export interface UserDetailedInfo {
  id: string,
  email: string | null,
  firstName: string,
  middleName: string | null,
  lastName: string,
  birthDate: string | null,
  roles: Set<Role>
}

const pageSize = import.meta.env.VITE_DEFAULT_FETCH_PAGE_SIZE;

export async function login(userLogin: UserLogin) {
  const loginFormData = new FormData();
  loginFormData.append("username", userLogin.username);
  loginFormData.append("password", userLogin.password);

  return apiClient.post<UserSession>("/auth/process-login", loginFormData);
}

export async function register(userRegistration: UserRegistration) {
  return apiClient.post("/auth/register", userRegistration);
}

export async function logout() {
  return apiClient.post("/auth/logout");
}

export async function searchUsers(query: string, page: number) {
  return apiClient.get<Page<UserDetailedInfo>>(getUsersSearchURL(), {
    params: {
      query: query,
      page: page,
      size: pageSize
    }
  });
}

export async function getUserInfo(patientId: string) {
  return apiClient.get<UserUpdatableInfo>(getUserURL(patientId));
}

export async function putUserInfo(patientId: string, userInfo: UserUpdatableInfo) {
  return apiClient.put<UserUpdatableInfo>(getUserURL(patientId), userInfo);
}

export async function getCsrf() {
  return apiClient.get("/auth/csrf");
}

function getUsersSearchURL() {
  return `/users/search`;
}

function getUserURL(patientId: string) {
  return `/users/${patientId}`;
}
