import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class AccessGuard implements CanActivate {

  constructor(
    private router: Router,
    private readonly authService: AuthService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      let validRole = false;
      const currentUser = this.authService.currentUserValue;
      currentUser.roles.forEach(role => {
        if (role === next.data.role) {
          validRole = true;
        }
      });

      // valid role so return true
      if (validRole) { return true; }

      // not valid role in so redirect to not found component
      this.router.navigate(['not-found']);
      return false;
  }
}
