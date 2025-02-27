import { Component, OnInit } from '@angular/core';
import { Discount } from '../../../../../interfaces/discount.interface';
import { DiscountService } from '../../../../../services/discount/discount.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { EditDiscountComponent } from '../edit-discount/edit-discount.component';
import { DeleteDiscountComponent } from '../delete-discount/delete-discount.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-discount',
  imports: [CommonModule, FormsModule],
  templateUrl: './list-discount.component.html',
  styleUrl: './list-discount.component.scss'
})
export class ListDiscountComponent implements OnInit {
  discounts: Discount[] = [];
  totalElements: number = 0;
  page: number = 0;
  size: number = 5; 
  sortBy: string = 'percentage';
  totalPages: number = 0;

  minPercentage: number | null = null;
  maxPercentage: number | null = null;

  constructor(
    private discountSrv: DiscountService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getDiscounts();
  }

  getDiscounts(): void {
    const min = this.minPercentage !== null ? this.minPercentage : undefined;
    const max = this.maxPercentage !== null ? this.maxPercentage : undefined;
  
    this.discountSrv.getAllDiscountsPaginated(this.page, this.size, this.sortBy, min, max)
      .subscribe(
        data => {
          this.discounts = data.content;
          this.totalElements = data.totalElements;
          this.totalPages = data.totalPages;
        },
        (error) => {
          console.error('Error al obtener descuentos:', error);
        }
      );
  }
  

  onSearch(): void {
    this.page = 0;
    this.getDiscounts();
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.page = page;
      this.getDiscounts();
    }
  }

  addDiscount(): void {
    this.router.navigate(['/admin/newDiscount']);
  }

  openEditDialog(discount: Discount): void {
    const discountCopy = { ...discount };
    const dialogRef = this.dialog.open(EditDiscountComponent, {
      width: '400px',
      data: { discount: discountCopy }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.discountSrv.updateDiscount(discount.id, result).subscribe(
          () => {
            this.getDiscounts(); // Recargar la lista de descuentos
          },
          (error) => {
            console.error('Error al actualizar el descuento:', error);
            alert('Hubo un error al actualizar el descuento.');
          }
        );
      }
    });
  }

  openDeleteDialog(discount: Discount): void {
    const dialogRef = this.dialog.open(DeleteDiscountComponent, {
      width: '300px',
      data: { discount: discount }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.discountSrv.deleteDiscount(discount.id).subscribe(
          () => {
            this.getDiscounts(); 
          },
          (error) => {
            console.error('Error al eliminar el descuento:', error);
            alert('Hubo un error al eliminar el descuento.');
          }
        );
      }
    });
  }
}
