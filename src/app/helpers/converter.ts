import { User } from '../models';

export class Converter {
  // Convert firebase user to user app
  static ToUser(firebaseUser) {
    const user: User = {
      displayName: firebaseUser.displayName,
      email: firebaseUser.email,
      phoneNumber: firebaseUser.phoneNumber,
      photoURL: firebaseUser.photoURL,
      publish: firebaseUser.publish,
      roles: firebaseUser.roles,
      emailVerified: firebaseUser.emailVerified,
      refreshToken: firebaseUser.refreshToken,
      uid: firebaseUser.uid
    };

    return user;
  }
}
