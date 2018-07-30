// errors-handler.ts
import { ErrorHandler, Injectable, Injector} from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';


@Injectable()
export class ErrorHandlerService implements ErrorHandler {


    constructor(
        private injector: Injector,
    ) {}


    // handleError(error: Error | HttpErrorResponse) {
    handleError(error) {
        console.log('##HANDLE ERRORE SERVICE##', error);
        // const message = error.message ? error.message : error.toString();
        const notificationService = this.injector.get(NotificationService);
        const router = this.injector.get(Router);

        console.error(error);
        console.log('handleError:navigate to /error');
        // router.navigate(['/error'], { queryParams: {error: error} });

        /*
        if (error instanceof HttpErrorResponse) {
        // Server error happened
          if (!navigator.onLine) {
            // No Internet connection
            return notificationService.notifyError('No Internet Connection');
          }
          // Http Error
          return notificationService.notifyError(`${error.status} - ${error.message}`);
        } else {
          // Client Error Happend
          router.navigate(['/error'], { queryParams: {error: error} });
        }
        // Log the error anyway
        console.error(error);
        */

        // throw error;
    }
}