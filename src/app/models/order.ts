import { Product } from './product';
import { firestore } from 'firebase';

export interface Order {
  createdDate: firestore.Timestamp;
  pickupTime: string;
  status: string;
  paid: boolean;
  remarks?: string;
  products?: Product [];
  providerName?: string;
  providerId?: string;
  displayName?: string;
  userId?: string;
  id?: string;
}
