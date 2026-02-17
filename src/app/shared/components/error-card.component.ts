import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-error-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="glass-card error-card" role="alert">
      <div class="error-icon">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="var(--accent-red)" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <circle cx="12" cy="16" r="0.5" fill="var(--accent-red)"/>
        </svg>
      </div>
      <p class="error-title">{{ title() }}</p>
      <p class="error-message">{{ message() }}</p>
      @if (retryable()) {
        <button class="btn-secondary retry-btn" (click)="retry.emit()">Try Again</button>
      }
    </div>
  `,
  styles: [`
    .error-card {
      text-align: center;
      padding: var(--space-xl);
      max-width: 400px;
      margin: var(--space-2xl) auto;
    }
    .error-icon { margin-bottom: var(--space-md); }
    .error-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: var(--space-sm);
    }
    .error-message {
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin-bottom: var(--space-lg);
      line-height: 1.5;
    }
    .retry-btn { margin: 0 auto; display: block; }
  `],
})
export class ErrorCardComponent {
  readonly title = input('Something went wrong');
  readonly message = input('Unable to load data. Please check your connection and try again.');
  readonly retryable = input(true);
  readonly retry = output<void>();
}
