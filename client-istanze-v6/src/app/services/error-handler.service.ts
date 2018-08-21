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
    
    public errorMsg: {};

    // handleError(error: Error | HttpErrorResponse) {
    handleError(error) {
        console.log('##HANDLE ERRORE SERVICE##', error);
        // const message = error.message ? error.message : error.toString();
        // const notificationService = this.injector.get(NotificationService);
        const router = this.injector.get(Router);

        console.error(error);
        console.log('handleError:navigate to /error');
        // const myError = this.addContextInfo(error);
        this.errorMsg = error;
        router.navigate(['/error']);

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

    addContextInfo(error) {
        // All the context details that you want (usually coming from other services; Constants, UserService...)
        const name = error.name || '';
        const appId = 'raccomandate';
        const time = new Date().getTime();
        // const url = location instanceof PathLocationStrategy ? location.path() : '';
        const url = error.url || '';
        const status = error.status || '';
        const statusText = error.statusText || '';
        const message = error.message || error.toString();
        const errorToSend = {appId, name, time, url, status, statusText, message};
        return errorToSend;
    }
}