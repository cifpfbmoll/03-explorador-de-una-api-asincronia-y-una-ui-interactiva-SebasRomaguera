import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GithubService } from '../../services/github.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="search-container">
      <div class="search-box">
        <input 
          type="text" 
          [ngModel]="searchQuery()"
          (ngModelChange)="searchQuery.set($event)"
          (keyup.enter)="onSearch()"
          placeholder="Buscar repositorios..."
          class="search-input"
        >
        <button (click)="onSearch()" class="search-button" [disabled]="!searchQuery().trim()">
          🔍 Buscar
        </button>
        @if (searchQuery()) {
          <button (click)="onClear()" class="clear-button">
            ✕ Limpiar
          </button>
        }
      </div>

      <div class="filters">
        <div class="filter-group">
          <label for="language">Lenguaje:</label>
          <select id="language" [ngModel]="language()" (ngModelChange)="language.set($event)" class="filter-select">
            <option value="">Todos</option>
            <option value="JavaScript">JavaScript</option>
            <option value="TypeScript">TypeScript</option>
            <option value="Python">Python</option>
            <option value="Java">Java</option>
            <option value="C++">C++</option>
            <option value="C#">C#</option>
            <option value="Go">Go</option>
            <option value="Rust">Rust</option>
            <option value="PHP">PHP</option>
            <option value="Ruby">Ruby</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="stars">Estrellas mínimas:</label>
          <input 
            type="number" 
            id="stars"
            [ngModel]="minStars()"
            (ngModelChange)="minStars.set($event)"
            min="0"
            placeholder="0"
            class="filter-input"
          >
        </div>
      </div>

      @if (githubService.totalCount() > 0) {
        <div class="results-info">
          📊 Se encontraron {{ githubService.totalCount().toLocaleString() }} repositorios
        </div>
      }
    </div>
  `,
  styles: [`
    .search-container {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 12px;
      padding: 25px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      margin-bottom: 30px;
    }

    .search-box {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }

    .search-input {
      flex: 1;
      padding: 12px 20px;
      font-size: 16px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      outline: none;
      transition: border-color 0.3s;
    }

    .search-input:focus {
      border-color: #667eea;
    }

    .search-button,
    .clear-button {
      padding: 12px 24px;
      font-size: 16px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
      font-weight: 600;
    }

    .search-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .search-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .search-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .clear-button {
      background: #ff4757;
      color: white;
    }

    .clear-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 71, 87, 0.4);
    }

    .filters {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }

    .filter-group {
      flex: 1;
      min-width: 200px;
    }

    .filter-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #333;
    }

    .filter-select,
    .filter-input {
      width: 100%;
      padding: 10px;
      font-size: 14px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      outline: none;
      transition: border-color 0.3s;
    }

    .filter-select:focus,
    .filter-input:focus {
      border-color: #667eea;
    }

    .results-info {
      margin-top: 15px;
      padding: 12px;
      background: #f0f7ff;
      border-left: 4px solid #667eea;
      border-radius: 4px;
      color: #333;
      font-weight: 500;
    }
  `]
})
export class SearchBarComponent {
  searchQuery = signal('');
  language = signal('');
  minStars = signal(0);

  constructor(public githubService: GithubService) {}

  onSearch() {
    if (this.searchQuery().trim()) {
      this.githubService.searchRepositories(
        this.searchQuery(),
        this.language(),
        this.minStars()
      );
    }
  }

  onClear() {
    this.searchQuery.set('');
    this.language.set('');
    this.minStars.set(0);
    this.githubService.clearSearch();
  }
}
