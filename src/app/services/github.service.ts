import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Repository, GitHubSearchResponse, SearchState } from '../models/repository.model';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private readonly API_URL = 'https://api.github.com/search/repositories';
  
  // Signals para estado reactivo
  repositories = signal<Repository[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  totalCount = signal<number>(0);
  searchState = signal<SearchState>({ query: '', language: '', minStars: 0 });

  constructor(private http: HttpClient) {}

  searchRepositories(query: string, language: string = '', minStars: number = 0) {
    if (!query.trim()) {
      this.repositories.set([]);
      this.error.set(null);
      this.totalCount.set(0);
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.searchState.set({ query, language, minStars });

    // Construir la consulta
    let searchQuery = query;
    if (language) {
      searchQuery += ` language:${language}`;
    }
    if (minStars > 0) {
      searchQuery += ` stars:>=${minStars}`;
    }

    const params = new HttpParams()
      .set('q', searchQuery)
      .set('sort', 'stars')
      .set('order', 'desc')
      .set('per_page', '30');

    this.http.get<GitHubSearchResponse>(this.API_URL, { params })
      .pipe(
        tap(response => {
          this.repositories.set(response.items);
          this.totalCount.set(response.total_count);
          this.loading.set(false);
        }),
        catchError((error: HttpErrorResponse) => {
          this.loading.set(false);
          
          let errorMessage = 'Error al buscar repositorios';
          
          if (error.status === 403) {
            errorMessage = 'Límite de tasa de API excedido. Por favor, intenta más tarde.';
          } else if (error.status === 422) {
            errorMessage = 'Consulta de búsqueda inválida. Por favor, revisa tu búsqueda.';
          } else if (error.status === 0) {
            errorMessage = 'Error de conexión. Por favor, verifica tu conexión a internet.';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }
          
          this.error.set(errorMessage);
          this.repositories.set([]);
          this.totalCount.set(0);
          
          return of(null);
        })
      )
      .subscribe();
  }

  clearSearch() {
    this.repositories.set([]);
    this.error.set(null);
    this.totalCount.set(0);
    this.loading.set(false);
    this.searchState.set({ query: '', language: '', minStars: 0 });
  }
}
