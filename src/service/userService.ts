import "axios"
import axios from 'axios'

export type User = {username: string, password: string}

const AUTH_LOGIN_URL = 'http://localhost:8080/api/v1/auth/process-login';

export async function login(username: string, password: string) {
  axios.defaults.withCredentials = true;
  const loginFormData = new FormData();
  loginFormData.append("username", username);
  loginFormData.append("password", password);

  return axios.post(AUTH_LOGIN_URL, loginFormData);
}

export async function getGlucose(id: number) {
  //axios.defaults.withCredentials = true;
  await axios.get("http://localhost:8080/api/v1/patients/2/entries")
  .then(response => {
    console.log(response);
  }).catch(err => {console.log(err);});
}
