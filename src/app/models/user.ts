export interface User {
  displayName: string;
  email: string;
  phoneNumber?: string;
  password?: string;    // if user sign in with provider don't need password
  photoURL?: string;
  publish?: boolean;
  emailVerified?: boolean;
  refreshToken?: string;
  roles?: Array<string>;
  parentId?: string;     // null when user is admin or provider
  uid?: string;
}
