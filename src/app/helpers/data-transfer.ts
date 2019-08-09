import { Observable } from 'rxjs';

export interface DataTransfer {
  name: string;
  percentage: Observable<number>;
}
