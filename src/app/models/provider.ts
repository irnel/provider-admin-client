import { Address } from './address';
import { Schedule } from './schedule';

export interface Provider {
  name: string;
  address: Address;
  phone?: string;
  availableHours?: Schedule [];
  description?: string;
  url?: string;
  userId?: string;
  id?: string;
}
