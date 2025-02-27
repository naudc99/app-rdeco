import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Discount } from '../../../../../interfaces/discount.interface';

@Component({
  selector: 'app-delete-discount',
  imports: [],
  templateUrl: './delete-discount.component.html',
  styleUrl: './delete-discount.component.scss'
})
export class DeleteDiscountComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteDiscountComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { discount: Discount }
  ) { }

  onNoClick(): void {
    this.dialogRef.close();  // Cierra el diálogo sin hacer nada
  }

  onDelete(): void {
    this.dialogRef.close(true);  // Cierra el diálogo y confirma la eliminación
  }
}
