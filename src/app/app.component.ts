// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BackgroundComponent } from './shared/components/background/background.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { LoginComponent } from "./features/auth/login/login.component";
import { LogoComponent } from "./shared/components/logo/logo.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterOutlet, BackgroundComponent, HeaderComponent, LoginComponent,
    LogoComponent
   ]
})
export class AppComponent {
  title = 'AguaLuz';
}