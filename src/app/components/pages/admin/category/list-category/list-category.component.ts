import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category } from '../../../../../interfaces/category.interface';
import { CategoryService } from '../../../../../services/category/category.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditCategoryComponent } from '../edit-category/edit-category.component';
import { DeleteCategoryComponent } from '../delete-category/delete-category.component';

@Component({
  selector: 'app-list-category',
  imports: [CommonModule, FormsModule],
  templateUrl: './list-category.component.html',
  styleUrl: './list-category.component.scss'
})
export class ListCategoryComponent implements OnInit{
  categories: Category[] = [];
  totalElements: number = 0;
  page: number = 0;
  size: number = 6;
  sortBy: string = 'name';
  totalPages: number = 0; 
  searchTerm: string = '';

  constructor(
    private categorySrv: CategoryService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(searchTerm: string = ''): void {
    this.categorySrv.getAllCategoriesPaginated(this.page, this.size, this.sortBy, searchTerm).subscribe(data => {
      console.log('Respuesta completa del servidor:', data);
      this.categories = data.content;
      this.totalElements = data.totalElements;
      this.totalPages = data.totalPages;
    });
  }
  
  onSearch(): void {
    this.page = 0; 
    this.getCategories(this.searchTerm); 
  }
  

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.page = page;
      this.getCategories(this.searchTerm); 
    }
  }

  addCategory(): void {
    this.router.navigate(['/admin/newCategory']); 
  }

  openEditDialog(category: Category): void {
    const categoryCopy = { ...category };

    const dialogRef = this.dialog.open(EditCategoryComponent, {
      width: '400px',
      data: { category: categoryCopy }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categorySrv.updateCategory(category.id, result).subscribe(
          () => {
            this.getCategories();
          },
          (error) => {
            console.error('Error updating category:', error);
          }
        );
      }
    });
  }

  openDeleteDialog(category: Category): void {
    const dialogRef = this.dialog.open(DeleteCategoryComponent, {
      width: '300px',
      data: { category: category }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categorySrv.deleteCategory(category.id).subscribe(
          () => {
            this.getCategories();
          },
          (error) => {
            console.error('Error deleting actor:', error);
          }
        );
      }
    });
  }

}
