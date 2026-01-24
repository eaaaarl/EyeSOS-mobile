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

export interface profile {
  id: string;
  name: string;
  email: string;
  mobileNo: string;
  avatarUrl?: string;
  created_at?: string;
  emergency_contact_name: string;
  emergency_contact_number: string;
}

export interface getProfilesRespons {
  profile: profile;
}
