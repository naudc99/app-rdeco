import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../../../../interfaces/product.interface';
import { DiscountService } from '../../../../../services/discount/discount.service';
import { ProductService } from '../../../../../services/product/product.service';
import { Router } from '@angular/router';
import { Discount } from '../../../../../interfaces/discount.interface';
import { CommonModule } from '@angular/common';
import { PaginatedResponse } from '../../../../../interfaces/paginated-response.interface';

@Component({
  selector: 'app-new-discount',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './new-discount.component.html',
  styleUrl: './new-discount.component.scss'
})
export class NewDiscountComponent implements OnInit {
  discountForm: FormGroup;
  products: Product[] = [];

  constructor(
    private fb: FormBuilder,
    private discountSrv: DiscountService,
    private productSrv: ProductService,
    private router: Router
  ) {
    this.discountForm = this.fb.group({
      percentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      product: [null, Validators.required]  // Ahora se maneja un objeto producto completo
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productSrv.getAllProducts().subscribe(
      (response: Product[]) => {
        this.products = response;  // Asignamos la lista de productos directamente
      },
      (error) => {
        console.error('Error al cargar productos', error);
      }
    );
  }

  onSubmit(): void {
    if (this.discountForm.valid) {
  
      // Obtener solo el id del producto seleccionado
      const productId = this.discountForm.value.product?.id;
  
      // Crear el objeto discountData
      const discountData: any = {
        id: 0,  // Si es un nuevo descuento, probablemente no tenga id
        percentage: this.discountForm.value.percentage,
        productId: productId  // Ahora solo enviamos el id del producto
      };
  
      console.log('Descuento a enviar:', discountData);
  
      this.discountSrv.createDiscount(discountData).subscribe(
        (response) => {
          console.log('Descuento creado:', response);
          this.router.navigate(['/admin/listDiscount']);
        },
        (error) => {
          console.error('Error al crear el descuento:', error.error);
        }
      );
    } else {
      console.error('Por favor, complete todos los campos obligatorios.');
    }
  }
  
  

  cancel(): void {
    this.router.navigate(['/admin/listDiscount']);
  }
}
