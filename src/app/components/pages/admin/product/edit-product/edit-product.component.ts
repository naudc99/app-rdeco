import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../../../../interfaces/product.interface';
import { Category } from '../../../../../interfaces/category.interface';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../../../../services/category/category.service';
import { PaginatedResponse } from '../../../../../interfaces/paginated-response.interface';

@Component({
  selector: 'app-edit-product',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
  previewImage: string | ArrayBuffer | null = null;
  categories: Category[] = [];

  constructor(
    private categorySrv: CategoryService,
    public dialogRef: MatDialogRef<EditProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: Product },
    
  ) {
    // Establecer la vista previa inicial si está disponible
    if (data.product.productPhoto) {
      this.previewImage = `data:image/jpeg;base64,${data.product.productPhoto}`;
    }
  }

  ngOnInit(): void {
    this.loadCategories();  // Load categories when the component is initialized
  }

  // Obtener todas las categorías sin paginación
  loadCategories(): void {
    this.categorySrv.getAllCategories().subscribe(
      (response: Category[]) => {
        this.categories = response;
      },
      (error) => {
        console.error('Error al cargar categorías', error);
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    console.log('Product:', this.data.product);
    this.dialogRef.close(this.data.product);
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImage = e.target.result;
        this.data.product.productPhoto = e.target.result.split(',')[1];  // Save base64 string
      };
      reader.readAsDataURL(file);
    }
  }
}
