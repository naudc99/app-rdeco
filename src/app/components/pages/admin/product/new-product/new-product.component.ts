import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../../../../../interfaces/category.interface';
import { CategoryService } from '../../../../../services/category/category.service';
import { ProductService } from '../../../../../services/product/product.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../../interfaces/product.interface';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PaginatedResponse } from '../../../../../interfaces/paginated-response.interface';

@Component({
  selector: 'app-new-product',
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.scss'
})
export class NewProductComponent implements OnInit {
  productForm: FormGroup;
  categories: Category[] = [];
  previewImage: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private categorySrv: CategoryService,
    private productSrv: ProductService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      referenceNumber: ['', Validators.required],  // Aquí agregamos el campo de referenceNumber
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      category: [null, Validators.required],
      image: ['']
    });
    
  }

  ngOnInit(): void {
    this.loadCategories();
  }

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

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input && input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.previewImage = reader.result;
      };

      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const productData: any = {
        name: this.productForm.value.name,
        description: this.productForm.value.description,
        price: this.productForm.value.price,
        stock: this.productForm.value.stock,
        referenceNumber: this.productForm.value.referenceNumber,
        productPhoto: this.previewImage ? this.previewImage.toString().split(',')[1] : '', // Solo la parte base64
        categoryId: this.productForm.value.category  // Aquí cambiamos a categoryId
      };
  
      console.log('Producto a enviar:', productData);
  
      this.productSrv.createProduct(productData).subscribe(
        (response) => {
          console.log('Producto creado:', response);
          this.router.navigate(['/admin/listProduct']);
        },
        (error) => {
          console.error('Error al crear el producto:', error.error);
        }
      );
    } else {
      console.error('Por favor, complete todos los campos obligatorios.');
    }
  }
  

  cancel(): void {
    this.router.navigate(['/admin/listProduct']);
  }
}
