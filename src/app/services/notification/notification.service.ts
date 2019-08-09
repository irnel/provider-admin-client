import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FirebaseError } from 'firebase';
import { FirebaseCode } from 'src/app/helpers/firebase-code';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private readonly toast: ToastrService) {}

  InfoMessage(message: string, title: string, timeOut?: number) {
    this.toast.info(message, title);
  }

  SuccessMessage(body: string, title: string, timeOut?: number) {
    this.toast.success(body, title);
  }

  ErrorMessage(body: string, title: string, timeOut?: number) {
    this.toast.error(body, title);
  }

  WarningMessage(body: string, title: string, timeOut: number) {
    this.toast.warning(body, title);
  }
}
