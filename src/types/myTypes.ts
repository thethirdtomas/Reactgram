export type AuthState = {
  authLevel: number;
  uid: string | null;
  email: string | null;
  name: string | null;
  photoURL: string | null;
}

export type SignUpFormData = {
  email: string,
  name: string,
  username: string,
  password: string,
}

export type EditProfileData = {
  name: string,
  bio: string | null,
  location: string | null,
  birthDate: Date | null,
}

