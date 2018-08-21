import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
// import ❴ Observable ❵ from 'rxjs';
import { ErrorHandlerService } from '../services/error-handler.service';

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
    private errorHandlerService: ErrorHandlerService
  ) { }

  ngOnInit() {
    // this.routeParams = this.activatedRoute.snapshot.queryParams;
    // let errorData = ''; // JSON.parse(this.routeParams.error);
    // console.log(errorData);
    if (this.activatedRoute.snapshot.data){
      console.log(this.activatedRoute.snapshot.data);
      this.data = this.activatedRoute.snapshot.data;
    }

    if (this.errorHandlerService.errorMsg){
      this.data = this.errorHandlerService.errorMsg;
    }
    // this.data = this.activatedRoute.snapshot.data;

    console.log(this.data);
  }
}