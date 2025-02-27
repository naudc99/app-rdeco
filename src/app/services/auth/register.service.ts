import { Injectable } from '@angular/core';
import { ErrorHandlerService } from './error-handler.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RegisterRequest } from '../../interfaces/register-request.interface';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environment/environment';
import { response } from '../../interfaces/response.interface';

@Injectable({
  providedIn: 'root'
})
export class RegisterService extends ErrorHandlerService {

  constructor(private http: HttpClient) {
      super();
  }

  register(credentials: RegisterRequest): Observable<response> {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      var response = this.http.post<response>(`${environment.apiUrl}auth/register`, credentials, { headers }).pipe(
          tap((response: response) => {
              if (response && response.numberOfErrors > 0)
                  throwError(() => new Error(response.messages.join('\n')));
              return response;
          }),
          catchError(error => this.errorHandle(error, 'Usuario'))
      );
      return response;
  }

  registerAdmin(credentials: RegisterRequest, token: string): Observable<response> {
      const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      });
      return this.http.post<response>(`${environment.apiUrl}auth/registeradmin`, credentials, { headers }).pipe(
          tap((response: response) => {
              if (response && response.numberOfErrors > 0)
                  throwError(() => new Error(response.messages.join('\n')));
              return response;
          }),
          catchError(error => this.errorHandle(error, 'Usuario'))
      );
  }
}
