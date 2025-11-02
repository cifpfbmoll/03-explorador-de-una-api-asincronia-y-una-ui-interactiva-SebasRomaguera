import { Component } from '@angular/core';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { RepoListComponent } from './components/repo-list/repo-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SearchBarComponent, RepoListComponent],
  template: `
    <div class="container">
      <header class="header">
        <h1>🔍 GitHub Explorer</h1>
        <p>Busca y explora repositorios de GitHub</p>
      </header>
      <app-search-bar></app-search-bar>
      <app-repo-list></app-repo-list>
    </div>
  `,
  styles: [`
    .header {
      text-align: center;
      color: white;
      margin-bottom: 30px;
      padding: 20px;
    }

    .header h1 {
      font-size: 2.5rem;
      margin-bottom: 10px;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    }

    .header p {
      font-size: 1.1rem;
      opacity: 0.9;
    }
  `]
})
export class AppComponent {
  title = 'github-explorer';
}
