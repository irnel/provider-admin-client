import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointState, BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-home-cashier',
  templateUrl: './home-cashier.component.html',
  styleUrls: ['./home-cashier.component.scss']
})
export class HomeCashierComponent implements OnInit {

  isHandSet$: Observable<BreakpointState>;

  constructor(private breakPointObserver: BreakpointObserver) {
    this.isHandSet$ = this.breakPointObserver.observe(Breakpoints.Handset);
  }

  ngOnInit() {
  }

}
