import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category } from '../../../../../interfaces/category.interface';
import { CategoryService } from '../../../../../services/category/category.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-category',
  imports: [CommonModule, FormsModule],
  templateUrl: './new-category.component.html',
  styleUrl: './new-category.component.scss'
})
export class NewCategoryComponent {
  category: Category = { id: 0, name: ''};

  constructor(private categorySrv: CategoryService, private router: Router) {}

  onSubmit(): void {
    this.categorySrv.createCategory(this.category).subscribe(() => {
      this.router.navigate(['/admin/listCategory']);
    });
  }

  cancel() {
    this.router.navigate(['/admin/listCategory']); 
  }
}
