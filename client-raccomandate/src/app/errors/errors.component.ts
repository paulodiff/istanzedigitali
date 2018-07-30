import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-error',
  templateUrl: './errors.component.html'
  // ,styleUrls: ['./errors.component.scss']
})
export class ErrorsComponent implements OnInit {
  routeParams;
  data;

  constructor(
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.routeParams = this.activatedRoute.snapshot.queryParams;
    let errorData = ''; // JSON.parse(this.routeParams.error);
    console.log(errorData);
    this.data = this.activatedRoute.snapshot.data;
    console.log(this.data);
    console.log(this.routeParams);
    this.routeParams = errorData;
  }
}