import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.css']
})
export class LogoComponent {
  hasImageError = false;
  logoUrl = 'assets/Capa_1.png';  
  fallbackLogoUrl = 'assets/group.svg';  

  onImageError() {
    console.error('Error cargando el logo');
    if (this.logoUrl !== this.fallbackLogoUrl) {
      this.logoUrl = this.fallbackLogoUrl;
    } else {
      this.hasImageError = true;
    }
  }
}