// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-header',
//   standalone: true,
//   imports: [],
//   templateUrl: './header.component.html',
//   styleUrl: './header.component.css'
// })
// export class HeaderComponent {

// }


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {}