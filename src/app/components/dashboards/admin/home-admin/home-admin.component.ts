import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointState, BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.scss']
})
export class HomeAdminComponent implements OnInit {
  isHandSet$: Observable<BreakpointState>;

  constructor(private breakPointObserver: BreakpointObserver) {
    this.isHandSet$ = this.breakPointObserver.observe(Breakpoints.Handset);
  }

  ngOnInit() {
  }

}
