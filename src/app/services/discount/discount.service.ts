import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment'; // Asegúrate de tener la URL base correcta
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Discount } from '../../interfaces/discount.interface';  // Importa la interfaz Discount
import { PaginatedResponse } from '../../interfaces/paginated-response.interface';  // Si usas una interfaz para la paginación

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  private apiUrl = `${environment.apiUrl}discount`; // La URL base de la API

  constructor(private http: HttpClient) { }

  // Obtener todos los descuentos
  getAllDiscounts(): Observable<Discount[]> {
    return this.http.get<Discount[]>(this.apiUrl);
  }

  // Obtener un descuento por ID
  getDiscountById(id: number): Observable<Discount> {
    return this.http.get<Discount>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo descuento
  createDiscount(discount: Discount): Observable<Discount> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Discount>(this.apiUrl, discount, { headers });
  }

  // Actualizar un descuento existente
  updateDiscount(id: number, discount: Discount): Observable<Discount> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Discount>(`${this.apiUrl}/${id}`, discount, { headers });
  }

  // Eliminar un descuento
  deleteDiscount(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Obtener descuentos paginados
  getAllDiscountsPaginated(page: number, size: number, sortBy: string, minPercentage?: number, maxPercentage?: number): Observable<PaginatedResponse<Discount>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);
  
    if (minPercentage !== undefined && minPercentage !== null) {
      params = params.set('minPercentage', minPercentage.toString());
    }
    if (maxPercentage !== undefined && maxPercentage !== null) {
      params = params.set('maxPercentage', maxPercentage.toString());
    }
  
    return this.http.get<PaginatedResponse<Discount>>(this.apiUrl + '/paginated', { params });
  }
  
}
