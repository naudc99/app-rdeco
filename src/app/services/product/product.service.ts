import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Product } from '../../interfaces/product.interface';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../../interfaces/paginated-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = `${environment.apiUrl}product`;

  constructor(private http: HttpClient) { }

  // Obtener todos los productos sin paginación
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}`);
  }

  // Obtener productos paginados con filtro de búsqueda
  getAllProductsPaginated(page: number, size: number, sortBy: string, searchTerm: string = ''): Observable<PaginatedResponse<Product>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);

    if (searchTerm) {
      params = params.set('name', searchTerm); // Agregar el término de búsqueda si está presente
    }

    return this.http.get<PaginatedResponse<Product>>(`${this.apiUrl}/paginated`, { params });
  }

  // Obtener un producto por ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo producto
  createProduct(product: Product): Observable<Product> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Product>(this.apiUrl, product, { headers });
  }

  // Actualizar un producto existente
  updateProduct(id: number, product: Product): Observable<Product> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product, { headers });
  }

  // Eliminar un producto
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
