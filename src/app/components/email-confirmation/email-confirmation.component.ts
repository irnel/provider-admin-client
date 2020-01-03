import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.scss']
})
export class EmailConfirmationComponent implements OnInit {

  mode: any;

  constructor(private activatedRoute: ActivatedRoute) {

    this.mode = this.activatedRoute.snapshot.queryParams.mode;
  }

  ngOnInit() {
  }

}
