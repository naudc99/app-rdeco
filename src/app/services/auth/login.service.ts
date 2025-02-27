import { Injectable } from '@angular/core';
import { ErrorHandlerService } from './error-handler.service';
import { User } from '../../interfaces/user.interface';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, catchError, filter, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environment/environment';
import { LoginRequest } from '../../interfaces/login-request.interface';
import { TokenJWT } from '../../interfaces/token-jwt.interface';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends ErrorHandlerService {
  private voidUser: User = {
      userId: -1,
      name: '',
      email: '',
      image: '',
  };

  private userData: BehaviorSubject<User> = new BehaviorSubject<User>(this.voidUser);
  public sessionInitializedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
      super();
      if (!this.sessionInitializedSubject.value) {
          const token = localStorage.getItem('sessToken');
          const userId = localStorage.getItem('sessId');
          if (!token || !userId) {
              this.sessionInitializedSubject.next(true);
              this.userData.next(this.voidUser);
          } else {
              this.retrieveUser().subscribe({
                  next: (userData) => {
                      if (!userData)
                          this.logout();
                      this.userData.next(userData);
                      this.sessionInitializedSubject.next(true);
                      return of(userData);
                  },
                  error: (error) => {
                      this.logout();
                      return throwError(error);
                  }
              });
          }
      }
  }

  getAllUserNames(): Observable<string[]> {
      try {
          const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
          return this.http.get<string[]>(`${environment.apiUrl}auth/names`, { headers }).pipe(
              catchError(error => this.errorHandle(error, 'Usuario'))
          );
      } catch {
          return throwError('Error al recuperar los datos');
      }
  }

  login(credentials: LoginRequest): Observable<any> {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      return this.http.post<any>(`${environment.apiUrl}auth/login`, credentials, { headers }).pipe(
          switchMap((response: any) => {
              if (response.jwt === '') {
                  return throwError(() => new Error('Inicio de sesión inválido'));
              }
              localStorage.setItem('sessToken', response.jwt);
              return this.retrieveUser().pipe(
                  tap(userData => {
                      if (!userData) {
                          this.logout();
                      } else {
                          this.handleSuccessfulLogin(userData, response.jwt);
                      }
                  }),
                  catchError(error => {
                      this.logout();
                      return throwError(error);
                  })
              );
          }),
          catchError(error => this.errorHandle(error, 'Usuario'))
      );
  }

  private handleSuccessfulLogin(userData: any, jwt: string): void {
      const decodedToken: TokenJWT = jwtDecode(jwt);
      localStorage.setItem('sessId', decodedToken.sub);
      this.userData.next(userData);
      this.sessionInitializedSubject.next(true);
  }


  logout(): void {
      if (localStorage.getItem('sessToken') != '') {
          localStorage.removeItem('sessToken');
          this.userData.next(this.voidUser);
          this.router.navigateByUrl('/index');
      }
  }

  private retrieveUser(): Observable<User> {
      try {
          const decodedToken = jwtDecode(this.token);
          const userId = Number.parseInt(decodedToken.sub || "-1");
          const headers = new HttpHeaders({
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.token}`
          });
          return this.http.get<User>(`${environment.apiUrl}user/${userId}`, { headers }).pipe(
              catchError(error => this.errorHandle(error, 'Usuario')),
          );
      } catch {
          return throwError('Error al decodificar el token JWT.');
      }
  }

  updateUserData(user: User) {
      this.userData.next(user);
  }

  removeUserData() {
      this.userData.next(this.voidUser);
  }

  get user(): Observable<User> {
      if (this.sessionInitializedSubject.value === true)
          return this.userData.asObservable();
      else
          return this.sessionInitializedSubject.pipe(
              filter(initialized => initialized),
              take(1),
              switchMap(() => this.userData.asObservable())
          );
  }

  get token(): string {
      return localStorage.getItem('sessToken') || '';
  }

  get isAdmin(): boolean {
      try {
          const decodedToken: TokenJWT = jwtDecode(this.token);
          return decodedToken.role === 'ADMIN';
      } catch {
          return false;
      }
  }


  get userId(): number {
      try {
          const decodedToken = jwtDecode(this.token);
          return Number.parseInt(decodedToken.sub || "-1");
      } catch {
          return -1;
      }
  }

  get userIsLogged(): boolean {
      const userId = this.userId;
      return userId > 0;
  }
}