import { firestore } from 'firebase';

export interface Schedule {
  dayOfWeek: string;
  opening: firestore.Timestamp;
  closing: firestore.Timestamp;
}
