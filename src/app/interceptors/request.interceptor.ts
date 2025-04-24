import {
    HttpInterceptorFn,
    HttpRequest,
    HttpHandlerFn,
    HttpEvent,
    HttpResponse,
    HttpErrorResponse
  } from '@angular/common/http';
  import { Observable, throwError } from 'rxjs';
  import { map, catchError } from 'rxjs/operators';
  import { environment } from 'src/environments/environment';
  
  export const AuthInterceptor : HttpInterceptorFn = (
    req: HttpRequest<any>,
    next: HttpHandlerFn
  ): Observable<HttpEvent<any>> => {
    const token = localStorage.getItem('access_token');
    const apiKey = environment.x_api_key; 
  
    let headers = req.headers
      .set('x-api-key', apiKey);
  
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
  
    const authReq = req.clone({ headers });
  
    return next(authReq).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const body = event.body;
          if (body?.codigoEstado) {
            if (body.codigoEstado > 401) {
              throw new Error(body.respuesta?.mensaje || 'Error de servidor');
            }
  
            if (body.codigoEstado === 401) {
              throw new Error(body.respuesta?.mensaje || 'No autorizado');
            }
            
            
          }
        }
        return event;
      }),
      catchError((error: HttpErrorResponse | any) => {
        const codigoEstado = error?.codigoEstado || error?.status;
  
        if (codigoEstado >= 400) {
          if (codigoEstado === 401) {
            return throwError(() => new Error("No tienes autorización"));
          } else if (codigoEstado === 404) {
            return throwError(() => new Error("No encontrado"));
          } else {
            return throwError(() => new Error("Lo sentimos, ocurrió un error al procesar tu solicitud. Intenta más tarde."));
          }
        }
  
        return throwError(() => error);
      })
    );
  };