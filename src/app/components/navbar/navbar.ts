import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';


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

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    console.log('Logout clicked');

    fetch('http://localhost:8080/logout', {
      method: 'POST',
      credentials: 'include'
    }).then(() => {
      window.location.href = '/login';
    })
  }

  @HostListener('document:click', ['$event'])
    clickOutside(event: MouseEvent) {
      if (!this.menuContainer.nativeElement.contains(event.target)) {
        this.menuOpen = false;
      }
    }
}
