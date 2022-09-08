import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from "rxjs/operators";
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      .pipe(
        catchError((erreur) => {
          if (erreur instanceof HttpErrorResponse) {
            if (erreur.status >= 400 && erreur.status < 404) {
              this.auth.deconnexion();
              this.auth.l.msg.msgFail(this.auth.l.t['MSG_ER_AUTH']);
              console.log("Une erreur s'est produite", erreur);
            }else if(erreur.status == 404){
              this.auth.l.msg.msgFail(this.auth.l.t['MSG_ER_404']);
            }else if(erreur.status >= 500){
              this.auth.l.msg.msgFail(this.auth.l.t['MSG_ER_500']);
            }else{
              this.auth.l.msg.msgFail(this.auth.l.t['MSG_ER_HTTP']);
            }
          }
          return throwError(erreur)
          // return Observable.throw(erreur); // Retourner l'erreur dans tous les cas
        })) as any;
    // return next.handle(request);
  }
}
