import { Component } from '@angular/core';
import { GithubService } from '../../services/github.service';
import { RepoCardComponent } from '../repo-card/repo-card.component';

@Component({
  selector: 'app-repo-list',
  standalone: true,
  imports: [RepoCardComponent],
  template: `
    <div class="repo-list-container">
      @if (githubService.loading()) {
        <div class="loading">
          <div class="spinner"></div>
          <span>Buscando repositorios...</span>
        </div>
      }

      @if (githubService.error()) {
        <div class="error">
          ⚠️ {{ githubService.error() }}
        </div>
      }

      @if (!githubService.loading() && !githubService.error() && githubService.repositories().length === 0 && githubService.searchState().query) {
        <div class="empty">
          <h3>😕 No se encontraron repositorios</h3>
          <p>Intenta con otra búsqueda o ajusta los filtros</p>
        </div>
      }

      @if (!githubService.loading() && !githubService.error() && githubService.repositories().length === 0 && !githubService.searchState().query) {
        <div class="welcome">
          <h2>👋 Bienvenido a GitHub Explorer</h2>
          <p>Busca repositorios usando la barra de búsqueda arriba</p>
          <div class="suggestions">
            <h4>💡 Sugerencias de búsqueda:</h4>
            <ul>
              <li>Busca por nombre: <code>react</code>, <code>angular</code>, <code>vue</code></li>
              <li>Filtra por lenguaje para mejores resultados</li>
              <li>Usa estrellas mínimas para encontrar proyectos populares</li>
            </ul>
          </div>
        </div>
      }

      @if (githubService.repositories().length > 0) {
        <div class="repo-grid">
          @for (repo of githubService.repositories(); track repo.id) {
            <app-repo-card [repository]="repo"></app-repo-card>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .repo-list-container {
      min-height: 300px;
    }

    .repo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .welcome {
      background: rgba(255, 255, 255, 0.95);
      padding: 40px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .welcome h2 {
      color: #667eea;
      margin-bottom: 15px;
      font-size: 2rem;
    }

    .welcome p {
      color: #666;
      font-size: 1.1rem;
      margin-bottom: 30px;
    }

    .suggestions {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      text-align: left;
      max-width: 600px;
      margin: 0 auto;
    }

    .suggestions h4 {
      color: #333;
      margin-bottom: 15px;
    }

    .suggestions ul {
      list-style: none;
      padding: 0;
    }

    .suggestions li {
      padding: 8px 0;
      color: #555;
    }

    .suggestions code {
      background: white;
      padding: 2px 8px;
      border-radius: 4px;
      color: #667eea;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .repo-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RepoListComponent {
  constructor(public githubService: GithubService) {}
}
