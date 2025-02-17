import { Component, OnInit } from '@angular/core';
import { User } from '../../../interfaces/user.interface';
import { LoginService } from '../../../services/auth/login.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  isUserLogged: Boolean = false;
  isUserAdmin: boolean = false;
  isMenuOpen: boolean = false;
  userData!: User;

  constructor(private loginSrv: LoginService) { }

    ngOnInit(): void {
        this.loginSrv.user.subscribe(user => {
            this.userData = user;
            this.isUserLogged = this.loginSrv.userIsLogged;
            this.isUserAdmin = this.loginSrv.isAdmin;
        });
    }

    handleProfileImageError(event: any) {
        event.target.src = 'assets/media/img/error.png';
    }

    logout(): void {
        this.loginSrv.logout();
    }

    toggleMenu(): void {
        this.isMenuOpen = !this.isMenuOpen;
      }
}
