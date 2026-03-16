import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user-service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})

export class Navbar {
  menuOpen = false;

  @ViewChild('menuContainer') menuContainer!: ElementRef;

  constructor(
    private router: Router,
    private userService: UserService,
  ) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.userService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login']),
    });
  }

  @HostListener('document:click', ['$event'])
    clickOutside(event: MouseEvent) {
      if (!this.menuContainer.nativeElement.contains(event.target)) {
        this.menuOpen = false;
      }
    }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
