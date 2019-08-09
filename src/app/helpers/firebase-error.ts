import { FirebaseCode } from './firebase-code';

export interface FirebaseError {
  code: FirebaseCode;
  message: string;
}
