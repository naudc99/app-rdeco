import { Component, HostListener } from '@angular/core';
import { Product } from '../../../interfaces/product.interface';
import { ProductService } from '../../../services/product/product.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  products: Product[] = []
  page = 0
  size = 20
  isLoading = false
  searchTerm = ""

  constructor(
    private productSrv: ProductService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getProducts()
  }

  getProducts(searchTerm = ""): void {
    if (this.isLoading) return
    this.isLoading = true

    this.productSrv.getAllProductsPaginated(this.page, this.size, "name", searchTerm).subscribe(
      (data) => {
        this.products = [...this.products, ...data.content]
        this.page++
        this.isLoading = false
      },
      (error) => {
        console.error("Error loading products:", error)
        this.isLoading = false
      },
    )
  }

  onSearch(): void {
    this.page = 0
    this.products = []
    this.getProducts(this.searchTerm)
  }

  @HostListener("window:scroll", [])
  onScroll(): void {
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const scrollPosition = window.pageYOffset + windowHeight

    if (scrollPosition >= documentHeight - 100 && !this.isLoading) {
      this.getProducts(this.searchTerm)
    }
  }

  navigateToProductDetail(productId: number) {
    this.router.navigate(["/product", productId])
  }
}
