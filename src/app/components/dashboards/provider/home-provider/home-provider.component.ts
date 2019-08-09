import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home-provider',
  templateUrl: './home-provider.component.html',
  styleUrls: ['./home-provider.component.scss']
})
export class HomeProviderComponent implements OnInit {

  isHandSet$: Observable<BreakpointState>;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.isHandSet$ = this.breakpointObserver.observe(Breakpoints.Handset);
  }

  ngOnInit() {
  }

}
