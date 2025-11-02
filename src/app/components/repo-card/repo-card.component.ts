import { Component, Input, signal } from '@angular/core';
import { Repository } from '../../models/repository.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-repo-card',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="card" (click)="toggleDetails()">
      <div class="card-header">
        <img [src]="repository.owner.avatar_url" [alt]="repository.owner.login" class="avatar">
        <div class="header-info">
          <h3 class="repo-name">{{ repository.name }}</h3>
          <a 
            [href]="repository.owner.html_url" 
            target="_blank"
            class="owner-link"
            (click)="$event.stopPropagation()"
          >
            @{{ repository.owner.login }}
          </a>
        </div>
      </div>

      <p class="description">
        {{ repository.description || 'Sin descripción disponible' }}
      </p>

      <div class="stats">
        <div class="stat">
          <span class="stat-icon">⭐</span>
          <span class="stat-value">{{ formatNumber(repository.stargazers_count) }}</span>
        </div>
        <div class="stat">
          <span class="stat-icon">🍴</span>
          <span class="stat-value">{{ formatNumber(repository.forks_count) }}</span>
        </div>
        @if (repository.language) {
          <div class="stat language">
            <span class="language-dot" [style.background-color]="getLanguageColor(repository.language)"></span>
            <span class="stat-value">{{ repository.language }}</span>
          </div>
        }
      </div>

      @if (showDetails()) {
        <div class="details" (click)="$event.stopPropagation()">
          <div class="detail-item">
            <strong>Nombre completo:</strong> {{ repository.full_name }}
          </div>
          <div class="detail-item">
            <strong>Creado:</strong> {{ repository.created_at | date:'dd/MM/yyyy' }}
          </div>
          <div class="detail-item">
            <strong>Actualizado:</strong> {{ repository.updated_at | date:'dd/MM/yyyy' }}
          </div>
          @if (repository.topics && repository.topics.length > 0) {
            <div class="detail-item">
              <strong>Topics:</strong>
              <div class="topics">
                @for (topic of repository.topics; track topic) {
                  <span class="topic-tag">{{ topic }}</span>
                }
              </div>
            </div>
          }
          <a 
            [href]="repository.html_url" 
            target="_blank" 
            class="view-button"
          >
            Ver en GitHub →
          </a>
        </div>
      }

      <div class="card-footer">
        <span class="toggle-text">{{ showDetails() ? '▲ Menos detalles' : '▼ Más detalles' }}</span>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      cursor: pointer;
      height: fit-content;
    }

    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 15px;
    }

    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
    }

    .header-info {
      flex: 1;
    }

    .repo-name {
      margin: 0;
      color: #333;
      font-size: 1.2rem;
      word-break: break-word;
    }

    .owner-link {
      color: #667eea;
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.3s;
    }

    .owner-link:hover {
      color: #764ba2;
      text-decoration: underline;
    }

    .description {
      color: #666;
      line-height: 1.6;
      margin-bottom: 15px;
      min-height: 48px;
    }

    .stats {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      margin-bottom: 15px;
    }

    .stat {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .stat-icon {
      font-size: 1.1rem;
    }

    .stat-value {
      font-weight: 600;
      color: #333;
    }

    .language {
      align-items: center;
    }

    .language-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      display: inline-block;
    }

    .details {
      border-top: 1px solid #e0e0e0;
      margin-top: 15px;
      padding-top: 15px;
      animation: slideDown 0.3s ease;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .detail-item {
      margin-bottom: 10px;
      color: #555;
      font-size: 0.9rem;
    }

    .detail-item strong {
      color: #333;
      display: block;
      margin-bottom: 5px;
    }

    .topics {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 8px;
    }

    .topic-tag {
      background: #e7f0ff;
      color: #667eea;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .view-button {
      display: inline-block;
      margin-top: 15px;
      padding: 10px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      transition: transform 0.3s;
    }

    .view-button:hover {
      transform: scale(1.05);
    }

    .card-footer {
      text-align: center;
      color: #667eea;
      font-size: 0.9rem;
      font-weight: 600;
      margin-top: 10px;
    }

    .toggle-text {
      user-select: none;
    }
  `]
})
export class RepoCardComponent {
  @Input({ required: true }) repository!: Repository;
  showDetails = signal(false);

  toggleDetails() {
    this.showDetails.update(value => !value);
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  getLanguageColor(language: string): string {
    const colors: { [key: string]: string } = {
      'JavaScript': '#f1e05a',
      'TypeScript': '#3178c6',
      'Python': '#3572A5',
      'Java': '#b07219',
      'C++': '#f34b7d',
      'C#': '#178600',
      'Go': '#00ADD8',
      'Rust': '#dea584',
      'PHP': '#4F5D95',
      'Ruby': '#701516',
      'Swift': '#ffac45',
      'Kotlin': '#A97BFF',
    };
    return colors[language] || '#ccc';
  }
}
