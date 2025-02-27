import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../../services/product/product.service';
import { Product } from '../../../../../interfaces/product.interface';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { DeleteProductComponent } from '../delete-product/delete-product.component';

@Component({
  selector: 'app-list-product',
  imports: [CommonModule, FormsModule],
  templateUrl: './list-product.component.html',
  styleUrl: './list-product.component.scss'
})
export class ListProductComponent implements OnInit {
  products: Product[] = [];
  totalElements: number = 0;
  page: number = 0;
  size: number = 5; 
  sortBy: string = 'name';
  totalPages: number = 0;
  searchTerm: string = '';

  constructor(
    private productSrv: ProductService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(searchTerm: string = ''): void {
    this.productSrv.getAllProductsPaginated(this.page, this.size, this.sortBy, searchTerm).subscribe(data => {
      console.log('Respuesta del servidor:', data);
      this.products = data.content;
      this.totalElements = data.totalElements;
      this.totalPages = data.totalPages;
  
      // Verifica que los productos tengan descuentos correctamente asignados
      this.products.forEach(product => {
        console.log('Producto:', product);
        console.log('Descuento:', product.discount);
      });
    }, (error) => {
      console.error('Error al obtener productos:', error);
    });
  }
  

  onSearch(): void {
    this.page = 0;
    this.getProducts(this.searchTerm);
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.page = page;
      this.getProducts(this.searchTerm);
    }
  }

  addProduct(): void {
    this.router.navigate(['/admin/newProduct']);
  }

  openEditDialog(product: Product): void {
    const productCopy = { ...product };
    const dialogRef = this.dialog.open(EditProductComponent, {
      width: '400px',
      data: { product: productCopy }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productSrv.updateProduct(product.id, result).subscribe(
          () => {
            this.getProducts();
          },
          (error) => {
            console.error('Error al actualizar el producto:', error);
          }
        );
      }
    });
  }

  openDeleteDialog(product: Product): void {
    const dialogRef = this.dialog.open(DeleteProductComponent, {
      width: '300px',
      data: { product: product }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productSrv.deleteProduct(product.id).subscribe(
          () => {
            this.getProducts();
          },
          (error) => {
            console.error('Error al eliminar el producto:', error);
          }
        );
      }
    });
  }
}
