import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../../../../interfaces/product.interface';
import { Discount } from '../../../../../interfaces/discount.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../../services/product/product.service';

@Component({
  selector: 'app-edit-discount',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-discount.component.html',
  styleUrl: './edit-discount.component.scss'
})
export class EditDiscountComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private productSrv: ProductService,
    public dialogRef: MatDialogRef<EditDiscountComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { discount: Discount }
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  // Cargar todos los productos disponibles
  loadProducts(): void {
    this.productSrv.getAllProducts().subscribe(
      (response: Product[]) => {
        this.products = response;
      },
      (error) => {
        console.error('Error al cargar productos', error);
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    console.log('Descuento actualizado:', this.data.discount);
    this.dialogRef.close(this.data.discount);
  }
}
