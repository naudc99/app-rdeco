import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from '../../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = `${environment.apiUrl}user/`;

  constructor(private http: HttpClient) { }

  // Obtener un usuario por su ID
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar usuario completo
  updateUser(userRequest: User): Observable<any> {
    return this.http.put(`${this.apiUrl}${userRequest.userId}`, userRequest).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar el nombre de usuario
  updateUserName(userId: number, nameNew: string): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}${userId}/name`, { nameNew }).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar el email del usuario
  updateUserEmail(userId: number, emailNew: string): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}${userId}/email`, { emailNew }).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar un usuario
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${userId}`).pipe(
      catchError(this.handleError)
    );
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 0) {
      console.error('Se ha producido un error:', error.error);
    } else {
      console.error('Backend retornó el código de estado:', error.status, 'cuerpo:', error.error);
    }
    return throwError('Algo falló. Por favor intente nuevamente.');
  }
}
