export interface signUpPayload {
  name: string;
  mobileNo: string;
  email: string;
  password: string;
}

export interface signInPayload {
  email: string;
  password: string;
}
