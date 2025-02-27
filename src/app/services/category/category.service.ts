import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../../interfaces/category.interface';
import { PaginatedResponse } from '../../interfaces/paginated-response.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}category`;

  constructor(private http: HttpClient) { }

  // Obtener todas las categorías sin paginación
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}`);
  }

  // Obtener categorías paginadas y filtradas
  getAllCategoriesPaginated(page: number, size: number, sortBy: string, searchTerm: string = ''): Observable<PaginatedResponse<Category>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);

    if (searchTerm) {
      params = params.set('name', searchTerm); // Agregar el término de búsqueda si está presente
    }
  
    return this.http.get<PaginatedResponse<Category>>(`${this.apiUrl}/paginated`, { params });
  }

  // Obtener una categoría por ID
  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva categoría
  createCategory(category: Category): Observable<Category> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Category>(this.apiUrl, category, { headers });
  }

  // Actualizar una categoría existente
  updateCategory(id: number, category: Category): Observable<Category> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category, { headers });
  }

  // Eliminar una categoría
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
