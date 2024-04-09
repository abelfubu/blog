import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import FooterComponent from './components/footer.component';
import { HeaderComponent } from './components/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <main class="flex flex-col min-h-screen">
      <afb-header />
      <section class="grow">
        <router-outlet />
      </section>
      <afb-footer />
    </main>
  `,
})
export class AppComponent {}
