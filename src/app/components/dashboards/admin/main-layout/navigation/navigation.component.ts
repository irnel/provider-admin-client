import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { AuthService } from './../../../../../services';

import { User } from '../../../../../models';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  currentUser: User;
  clicked: boolean;

  @ViewChild('sidenav', {static: true}) sidenav: ElementRef;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private readonly authService: AuthService
  ) {
    this.clicked = this.clicked === undefined ? false : true;

    this.currentUser = this.authService.currentUserValue;
  }

  ngOnInit() {
  }

  setClicked(val: boolean): void {
    this.clicked = val;
  }

  SignOut() {
    this.authService.SignOut();
  }
}
