export type AuthState = {
  authLevel: number;
  uid: string | undefined;
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

export type ProfileData = {
  name: string,
  username: string,
  joined: firebase.firestore.Timestamp,
  bio: string | null,
  location: string | null,
  birthDate: firebase.firestore.Timestamp | null,
  photoURL: string | null;
  headerURL: string | null;
}